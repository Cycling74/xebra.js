import { OBJECTS, MANDATORY_OBJECTS, OBJECT_PARAMETERS } from "./lib/objectList.js";
import { ResourceController } from "./lib/resource.js";
import { EventEmitter } from "events";
import pick from "lodash.pick";
import XebraCommunicator from "xebra-communicator";

import { getInstanceForObjectType, ObjectNode, ParamNode } from "./nodes/index.js";

const RESOURCE_REQUEST_DOMAIN = Object.freeze({
	INFO : "info",
	DATA : "data"
});

/**
 * List of objects available for synchronization in Xebra. Use this or a subset of this when setting the supported_objects option in Xebra.State.
 *
 * @static
 * @constant
 * @memberof Xebra
 * @type {string[]}
 */
const SUPPORTED_OBJECTS = Object.freeze(Array.from(Object.values(OBJECTS)));

/**
 * @namespace Xebra
 * @tutorial 01-quickstart
 */

// /////////////////////
// Type Definitions   //
// /////////////////////

/**
 * A string or number based id
 * @typedef {number|string} NodeId
 * @memberof Xebra
 */

/**
 * @typedef {number[]} PatchingRect
 * @memberof Xebra
 * @desc Patching Rectangle attribute consisting of 4 Numbers (x, y, width, height)
 */

/**
 * @typedef {number|string|string[]|number[]|object} ParamValueType
 * @memberof Xebra
 * @desc Generic parameter value type
 */

// /////////////////////


/**
 * @desc State instances wrap the state sync and connection with the Max backend.
 * @class
 */
class State extends EventEmitter {

	/**
	 * @param  {Object} options
	 * @param  {Boolean} options.auto_connect=true - Whether to autoconnect on startup
	 * @param  {String} options.hostname - The host of the Xebra backend
	 * @param  {Number} options.port - The port of the Xebra backend
	 * @param  {Boolean} options.secure=false - Whether to use a secure WS connection or not (ws vs wss)
	 * @param  {Boolean} options.reconnect=true - Whether to try auto-reconnecting after the connection closed
	 * @param  {Number} options.reconnect_attempts=5 - The amount of retries before considering it a failure
	 * @param  {Number} options.reconnect_timeout=1000 - Timeout between reconnects in ms
	 * @param  {string[]} options.supported_objects - List of objects to include in the state
	 */
	constructor(options) {
		super();

		const commOptions = pick(options, ["auto_connect", "hostname", "port", "secure", "reconnect", "reconnect_attempts", "reconnect_timeout"]);
		if (!options.supported_objects) options.supported_objects = SUPPORTED_OBJECTS;

		commOptions.supported_objects = Object.assign({}, MANDATORY_OBJECTS);
		options.supported_objects.forEach((objName) => {
			const params = OBJECT_PARAMETERS[objName];
			if (params) {
				commOptions.supported_objects[objName] = params;
			} else if (!MANDATORY_OBJECTS.hasOwnProperty(objName)) {
				console.log(`WARN: Unsupported or unknown object ${objName}`);
			}
		});

		this._communicator = new XebraCommunicator(commOptions);
		this._communicator.on(XebraCommunicator.XEBRA_MESSAGES.CONNECTION_CHANGE, this._onConnectionChange);

		this._communicator.on(XebraCommunicator.XEBRA_MESSAGES.ADD_NODE, this._addNode);
		this._communicator.on(XebraCommunicator.XEBRA_MESSAGES.ADD_PARAM, this._addParam);
		this._communicator.on(XebraCommunicator.XEBRA_MESSAGES.DELETE_NODE, this._deleteNode);
		this._communicator.on(XebraCommunicator.XEBRA_MESSAGES.HANDLE_RESOURCE_DATA, this._handleResourceData);
		this._communicator.on(XebraCommunicator.XEBRA_MESSAGES.HANDLE_RESOURCE_INFO, this._handleResourceInfo);
		this._communicator.on(XebraCommunicator.XEBRA_MESSAGES.INIT_NODE, this._modifyNode);
		this._communicator.on(XebraCommunicator.XEBRA_MESSAGES.MODIFY_NODE, this._modifyNode);
		this._communicator.on(XebraCommunicator.XEBRA_MESSAGES.STATEDUMP, this._statedump);
		this._communicator.on(XebraCommunicator.XEBRA_MESSAGES.CLIENT_param_changed, this._clientParamChange);

		this._resourceRequests = {
			info : {
				sequence : 0,
				resourceToSequence : {},
				sequenceToResource : {}
			},
			data : {
				sequence : 0,
				resourceToSequence : {},
				sequenceToResource : {}
			}
		};

		this._isStateLoaded = false;
		this._rootNode = null;
		this._state = new Map();
		this._patchers = new Map();
		this._motionNodes = new Map();
		this._resourceController = new ResourceController();
		this._resourceController.on("get_resource_info", this._onGetResourceInfo);
	}

	/**
	 * Indicated whether motion tracking is currently enabled/disabled
	 * @type {boolean}
	 * @readonly
	 */
	get isMotionEnabled() {
		return this._motionNodes.size > 0;
	}

	/**
	 * The current connection state
	 * @type {number}
	 * @readonly
	 * @see {Xebra.CONNECTION_STATES}
	 */
	get connectionState() {
		return this._communicator.connectionState;
	}

	/**
	 * Name of the current xebra connection. For some Max objects, like mira.motion and mira.multitouch, multiple
	 * xebra clients (connected via Xebra.js or the Mira iOS app) can send events to the same object. This name
	 * property will be appended to these events, so that the events can be routed in Max.
	 * @type {string}
	 */
	get name() {
		return this._communicator.name;
	}

	set name(name) {
		this._communicator.name = name;
	}

	/**
	 * Hostname of the Max WebSocket
	 * @type {string}
	 * @readonly
	 */
	get hostname() {
		return this._communicator.host;
	}

	/**
	 * Indicates whether the initial state has been received from Max and loaded
	 * @type {boolean}
	 * @readonly
	 */
	get isStateLoaded() {
		return this._isStateLoaded;
	}

	/**
	 * Port number of the Max WebSocket
	 * @type {number}
	 * @readonly
	 */
	get port() {
		return this._communicator.port;
	}

	/**
	 * WebSocket connection URL
	 * @type {string}
	 * @readonly
	 */
	get wsUrl() {
		return this._communicator.wsUrl;
	}

	/**
	 * UUID associated with this state
	 * @type {string}
	 * @readonly
	 */
	get uuid() {
		return this._communicator.uuid;
	}

	/**
	 * UID assigned to this state by Max, after connection
	 * @private
	 * @readonly
	 */
	get xebraUuid() {
		return this._communicator.xebraUuid;
	}

	/* Connection related events */

	/**
	 * @private
	 * @throws throws an Error when the RESOURCE_REQUEST_DOMAIN is invalid
	 */
	_makeResourceRequest(context, resource, domain) {
		if (domain !== RESOURCE_REQUEST_DOMAIN.INFO && domain !== RESOURCE_REQUEST_DOMAIN.DATA) {
			throw new Error(`Resource request domain must be one of: ${RESOURCE_REQUEST_DOMAIN.DATA}, ${RESOURCE_REQUEST_DOMAIN.INFO}`);
		}

		// If there was a previous request from this resource, remove it
		if (this._resourceRequests[domain].resourceToSequence.hasOwnProperty(resource.id)) {
			const oldSequence = this._resourceRequests[domain].resourceToSequence[resource.id];
			delete this._resourceRequests[domain].sequenceToResource[oldSequence];
		}

		const sequence = ++this._resourceRequests[domain].sequence;
		this._resourceRequests[domain].resourceToSequence[resource.id] = sequence;
		this._resourceRequests[domain].sequenceToResource[sequence] = resource;
		const payload = {
			context : context,
			name : resource.filename,
			width : resource.dimensions.width,
			height : resource.dimensions.height,
			sequence : sequence,
			as_png : 1 // This asks Max to render SVG surfaces to PNG instead of raw bytes
		};

		if (domain === RESOURCE_REQUEST_DOMAIN.INFO) {
			this._communicator.getResourceInfo(payload);
		} else if (domain === RESOURCE_REQUEST_DOMAIN.DATA) {
			this._communicator.getResourceData(payload);
		}
	}


	/**
	 * @private
	 */
	_onConnectionChange = (status) => {
		/**
		 * ConnectionState change event
		 * @event State#connection_changed
		 */
		this.emit("connection_changed", status);
	}

	/**
	 * @private
	 */
	_onGetResourceInfo = (resource) => {
		this._makeResourceRequest(resource.objectContext, resource, "info");
	}

	/**
	 * @private
	 * @fires State.frame_changed
	 * @fires State.object_changed
	 * @fires State.patcher_changed
	 */
	_onNodeChange = (object, param) => {
		if (object.type === OBJECTS.MIRA_FRAME) {
			/**
			 * Frame changed event
			 * @event State.frame_changed
			 * @param {FrameNode}				frame     The changed frame
			 * @param {ParamNode}		param      The parameter node
			 */
			if (object.isReady) this.emit("frame_changed", object, param);
		}
		if (object.type === OBJECTS.PATCHER) {
			/**
			 * Patcher changed event
			 * @event State.patcher_changed
			 * @param {PatcherNode}    patcher    The changed patcher
			 * @param {ParamNode}  param      The parameter node
			 */
			if (object.isReady) this.emit("patcher_changed", object, param);
		}

		/**
		 * Object changed event
		 * @event State.object_changed
		 * @param {ObjectNode} object     The changed object
		 * @param {ParamNode}  param      The parameter node
		 */
		if (object.isReady) this.emit("object_changed", object, param);
	}

	/**
	 * @private
	 */
	_onNodeInitialized = (object) => {
		this.emit("object_added", object);
	}

	/**
	 * @private
	 */
	_onFrameInitialized = (frame) => {
		this.emit("frame_added", frame);
	}

	/**
	 * @private
	 */
	_onPatcherInitialized = (patcher) => {
		this.emit("patcher_added", patcher);
	}

	/**
	 * @private
	 */
	_onModifiyNodeChange = (object, param) => {
		let val = param.value;
		if (!Array.isArray(val)) val = [val];

		this._communicator.sendModifyMessage({
			id : param.id,
			sequence : param.sequence,
			creation_sequence : param.creationSequence,
			values : val,
			types : param.types
		});
	}

	/**
	 * @private
	 */
	_addMotion(node) {
		this._motionNodes.set(node.id, node);

		if (this._motionNodes.size === 1) {
			/**
			 * Motion Enable event
			 * @event State#enable_motion
			 */
			this.emit("motion_enabled");
		}
	}

	/**
	 * @private
	 */
	_getMotion(id) {
		return this._motionNodes.get(id) || null;
	}

	/**
	 * @private
	 */
	_removeMotion(node) {
		this._motionNodes.delete(node.id);
		if (this._motionNodes.size === 0) {
			/**
			 * Motion Disable event
			 * @event State#disable_motion
			 */
			this.emit("motion_disabled");
		}
	}

	/**
	 * @private
	 */
	_addPatcher(node) {
		this._patchers.set(node.id, node);
	}

	/**
	 * @private
	 */
	_getPatcher(id) {
		return this._patchers.get(id) || null;
	}

	/**
	 * @private
	 */
	_removePatcher(node) {
		this._patchers.delete(node.id);
	}

	/**
	 * @private
	 *
	 * @listens ObjectNode.param_changed
	 * @listens ObjectNode#param_set
	 * @fires State.frame_added
	 * @fires State.object_added
	 * @fires State.patcher_added
	 */
	_addNode = (data) => {

		const node = getInstanceForObjectType(data.id, data.type, data.sequence, data.parent_id);

		// patchers and frames are handled differently as we have to put them into the correct
		// list other than just adding them to the statetree.
		if (node.type === OBJECTS.PATCHER) {
			this._addPatcher(node);

			/**
			 * Patcher added event
			 * @event State.patcher_added
			 * @param {PatcherNode} object The added patcher
			 */
			if (node.isReady) {
				this.emit("patcher_added", node);
			} else {
				node.once("initialized", this._onPatcherInitialized);
			}

		} else if (data.type === OBJECTS.MIRA_FRAME) {
			const parentPatcher = this._getPatcher(data.parent_id);
			parentPatcher.addFrame(node);

			/**
			 * Frame added event
			 * @event State.frame_added
			 * @param {FrameNode} object The added frame
			 */
			if (node.isReady) {
				this.emit("frame_added", node);
			} else {
				node.once("initialized", this._onFrameInitialized);
			}

		} else { // object node
			const parentPatcher = this._getPatcher(data.parent_id);
			parentPatcher.addObject(node);

			if (node.type === OBJECTS.MIRA_MOTION) this._addMotion(node);
		}

		this._doInsertNode(node);

		/**
		 * Object added event
		 * @event State.object_added
		 * @param {ObjectNode} object The added object
		 */
		if (node.isReady) {
			this.emit("object_added", node);
		} else {
			node.once("initialized", this._onNodeInitialized);
		}
	}

	/**
	 * @private
	 */
	_doInsertNode(node) {
		this._state.set(node.id, node);
		node.on("param_changed", this._onNodeChange);
		node.on("param_set", this._onModifiyNodeChange);
		if (node.resourceController) node.resourceController.on("get_resource_info", this._onGetResourceInfo);
	}

	/**
	 * @private
	 */
	_addParam = (data) => {
		const parent = this._state.get(data.parent_id);
		const param = new ParamNode(data.id, data.type, data.sequence);

		this._state.set(param.id, param);

		parent.addParam(param);
	}

	/**
	 * @private
	 */
	_clientParamChange = (key, value) => {
		/**
		 * Client param change event
		 * @event State#client_param_changed
		 * @param {String} key
		 * @param {String} value
		 */
		this.emit("client_param_changed", key, value);
	}

	/**
	 * @private
	 * @fires State.frame_removed
	 * @fires State.object_removed
	 * @fires State.patcher_removed
	 */
	_deleteNode = (data) => {
		const node = this._state.get(data.id);
		if (!node) return;

		const parentPatcher = this._getPatcher(node.patcherId);

		// remove frame from parent patcher
		if (node.type === OBJECTS.MIRA_FRAME) {
			if (parentPatcher) parentPatcher.removeFrame(node.id);

			/**
			 * Frame removed event
			 * @event State.frame_removed
			 * @param {FrameNode} object The removed frame
			 */
			if (node.isReady) this.emit("frame_removed", node);
		} else if (node.type === OBJECTS.PATCHER) {

			/**
			 * Patcher removed event
			 * @event State.patcher_removed
			 * @param {PatcherNode} object The removed patcher
			 */
			if (node.isReady) this.emit("patcher_removed", node);
		} else {
			if (parentPatcher) parentPatcher.removeObject(node.id);
		}

		if (node.type === OBJECTS.MIRA_MOTION) this._removeMotion(node);

		this._destroyNode(node);

		/**
		 * Object removed event
		 * @event State.object_removed
		 * @param {ObjectNode} object The removed object
		 */
		if (node.isReady) this.emit("object_removed", node);
	}

	_destroyNode(node) {
		node.destroy();

		node.forEachChild((child) => {
			if (child instanceof ParamNode) this._destroyNode(child);
		}, this);

		this._state.delete(node.id);
	}

	/**
	 * private
	 */

	_handleResourceData = (data) => {
		if (data.request) {
			const sequence = data.request.sequence;
			const resource = this._resourceRequests.data.sequenceToResource[sequence];
			if (resource) {
				resource.handleData(data);
				delete this._resourceRequests.data.resourceToSequence[resource.id];
				delete this._resourceRequests.data.sequenceToResource[sequence];
			}

		}
	}

	_handleResourceInfo = (data) => {
		if (data.request) {
			const sequence = data.request.sequence;
			const resource = this._resourceRequests.info.sequenceToResource[sequence];
			if (resource) {
				this._makeResourceRequest(data.request.context, resource, "data");
				delete this._resourceRequests.info.resourceToSequence[resource.id];
				delete this._resourceRequests.info.sequenceToResource[sequence];
			}
		} else {
			console.log("Could not handle badly formatted resource info response", data);
		}
	}

	/**
	 * @private
	 */
	_modifyNode = (data) => {
		const node = this._state.get(data.id);
		if (node) node.modify(data.values, data.types, data.sequence);
	}

	/**
	 * @private
	 */
	_statedump = (data) => {
		/**
		 * State reset event
		 * @event State#reset
		 */
		if (this._state) {
			this.emit("reset");
		}

		this._resetState();

		for (let i = 0, il = data.messages.length; i < il; i++) {
			const msg = data.messages[i];
			if (msg.message === XebraCommunicator.XEBRA_MESSAGES.ADD_NODE) {
				this._addNode(msg.payload);
			} else if (msg.message === XebraCommunicator.XEBRA_MESSAGES.ADD_PARAM) {
				this._addParam(msg.payload);
			} else if (msg.message === XebraCommunicator.XEBRA_MESSAGES.MODIFY_NODE) {
				this._modifyNode(msg.payload, true);
			}
		}

		/**
		 * State loaded event
		 * @event State#loaded
		 */
		this._isStateLoaded = true;
		this.emit("loaded");
	}

	/**
	 * @private
	 */
	_resetState() {
		// destroy all old nodes
		if (this._state) {
			this._state.forEach((node) => {
				node.destroy();
			});
			this._state.clear();
		}

		this._isStateLoaded = false;
		this._state = new Map();
		this._patchers = new Map();

		// reset motion
		this._motionNodes = new Map();
		this.emit("disable_motion");

		this._rootNode = new ObjectNode(0, "root");
		this._doInsertNode(this._rootNode);
	}

	/**
	 * Closes the Xebra connection and resets the state
	 */
	close() {
		this._communicator.close();
		this._resetState();
	}

	/**
	 * Connects to the Xebra server. If `auto_connect : true` is passed to State on
	 */
	connect() {
		this._communicator.connect();
	}

	/**
	 * Create a {@link Resource}, which can be used to retrieve image data from the Max search path
	 * @return {Resource}
	 */
	createResource() {
		return this._resourceController.createResource();
	}

	/**
	 * Send mira.motion updates to parameters on the root node
	 * @see Xebra.MOTION_TYPES
	 * @param {string} motionType - The type of motion
	 * @param {number} motionX
	 * @param {number} motionY
	 * @param {number} motionZ
	 * @param {number} timestamp
	 * @throws Will throw an error when motion is currently disabled on the instance of State
	 */
	sendMotionData(motionType, motionX, motionY, motionZ, timestamp) {
		const xuuid = this.xebraUuid;
		if (!xuuid) return;

		if (!this.isMotionEnabled) throw new Error("Can't send motion data when motion is disabled");

		this._rootNode.setParamValue(motionType, [
			xuuid,
			xuuid,
			motionX,
			motionY,
			motionZ,
			timestamp
		]);
	}

	/**
	 * Returns a list of available patchers
	 * @return {PatcherNode[]}
	 */
	getPatchers() {
		return Array.from(this._patchers.values());
	}

	/**
	 * Returns a list of node objects with the given scripting name (the Max attribute 'varname')
	 * @return {ObjectNode[]}
	 */
	getObjectsByScriptingName(scriptingName) {
		const retVal = [];
		this._patchers.forEach((patcher, id) => {
			const obj = patcher.getObjectByScriptingName(scriptingName);
			if (obj) retVal.push(obj);
		});
		return retVal;
	}
}

export { State };

// constants

/**
 * Connection States
 * @static
 * @constant
 * @memberof Xebra
 * @type {object}
 * @property {number} INIT - The connection hasn't been set up yet, it's still waiting for a call to connect (unless auto_connect is set to true)
 * @property {number} CONNECTING - The connection is being established
 * @property {number} CONNECTED - The connection is established and alive
 * @property {number} CONNECTION_FAIL - The connection could NEVER be established
 * @property {number} RECONNECTING - The connection was lost and attempts to reconnect are made (based on reconnect, reconnect_attempts and reconnect_timeout options)
 * @property {number} DISCONNECTED - The connection was lost and all attempts to reconnect failed
 */
const CONNECTION_STATES = XebraCommunicator.CONNECTION_STATES;
const VERSION = XebraCommunicator.XEBRA_VERSION;

export * from "./lib/constants.js";
export {
	CONNECTION_STATES,
	SUPPORTED_OBJECTS,
	VERSION
};
