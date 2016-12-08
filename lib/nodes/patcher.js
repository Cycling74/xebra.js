"use strict";

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

var _set = require("babel-runtime/core-js/set");

var _set2 = _interopRequireDefault(_set);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _setPrototypeOf = require("babel-runtime/core-js/object/set-prototype-of");

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = require("babel-runtime/core-js/object/create");

var _create2 = _interopRequireDefault(_create);

var _defineProperty = require("babel-runtime/core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; (0, _defineProperty2.default)(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require("../lib/constants.js");

var _objectNode = require("./objectNode.js");

var _objectNode2 = _interopRequireDefault(_objectNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @desc <strong>Constructor for internal use only</strong>
 * Represent a single Max patcher. Use `getFrames` and `getObjects` to iterate over instances of {@link FrameNode}
 * and {@link ObjectNode}, respectively. The very handy `getObjectByScriptingName` function can be used to
 * get the {@link ObjectNode} instance bound to a Max object with the given `varname` attribute.
 * @class
 * @extends ObjectNode
 * @extends XebraNode
 */
var PatcherNode = function (_ObjectNode) {
	_inherits(PatcherNode, _ObjectNode);

	/**
  * @param  {number} id - The id of the node
  * @param  {string} type - Type identifier of the node
  * @param  {number} creationSeq - The sequence number for the creation of this node
  * @param  {number} parentId - The id of the parent node
  */
	function PatcherNode(id, type, creationSeq, parentId) {
		_classCallCheck(this, PatcherNode);

		var _this = _possibleConstructorReturn(this, (PatcherNode.__proto__ || (0, _getPrototypeOf2.default)(PatcherNode)).call(this, id, type, creationSeq, parentId));

		_this._onFrameChange = function (frame, param) {
			// position changed? We might have to figure out if this object needs
			// to be added to frame instances
			if (frame.viewMode === _constants.VIEW_MODES.PATCHING && param.type === "patching_rect" || frame.viewMode === _constants.VIEW_MODES.PRESENTATION && param.type === "presentation_rect") {
				_this._assignObjectsToFrame(frame);
			}

			/**
    * @event PatcherNode.frame_changed
    * @param {FrameNode} frame - The changed frame
    * @param {ParamNode} param - The parameter node
    */
			if (frame.isReady) _this.emit("frame_changed", frame, param);
		};

		_this._onFrameInitialized = function (frame) {
			_this.emit("frame_added", frame);
		};

		_this._onFrameViewModeChange = function (frame) {
			_this._assignObjectsToFrame(frame);
		};

		_this._onObjectInitialized = function (object) {
			_this._assignObjectToFrames(object);
			_this.emit("object_added", object);
		};

		_this._onObjectChange = function (obj, param) {
			// position changed? We might have to figure out if this object needs
			// to be added to frame instances
			//
			if (param.type === "presentation" || param.type === "patching_rect" || param.type === "presentation_rect") {
				_this._assignObjectToFrames(obj);
			}

			// varname changed? We have to update maps to/from the varname
			if (param.type === "varname") {
				_this._removeScriptingNameLookup(obj.id);
				_this._storeScriptingNameLookup(obj.id, param.value);
			}

			/**
    * @event PatcherNode.object_changed
    * @param {ObjectNode} object 	The changed object
    * @param {ParamNode}		param   The changed parameter
    */
			if (obj.isReady) _this.emit("object_changed", obj, param);
		};

		_this._onObjectDestroy = function (obj) {
			_this.removeObject(obj.id);
		};

		_this._onViewChange = function (view, param) {
			if (param.type === "presentation") _this._updateViewMode();
			_this.emit("param_changed", _this, param);
		};

		_this._onViewDestroy = function (view) {
			view.removeListener("param_changed", _this._onViewChange);
			view.removeListener("destroy", _this._onViewDestroy);
			_this._view = null;
		};

		_this._frames = new _set2.default();
		_this._objects = new _set2.default();

		_this._idsByScriptingName = new _map2.default();
		_this._scriptingNamesById = new _map2.default();

		_this._view = null;
		return _this;
	}

	// Bound callbacks using fat arrow notation
	/**
  * @private
  * @param {FrameNode} frame - the changed frame
  * @param {ParamNode} param - the changed parameter
  * @fires XebraState.frame_changed
  */


	/**
  * @private
  * @param {FrameNode} frame - the initialized frame
  */


	/**
  * @private
  * @param {FrameNode} frame - The changed frame
  */


	_createClass(PatcherNode, [{
		key: "_removeScriptingNameLookup",


		/**
   * @private
   * @param {Xebra.NodeId} objectId - The id of the object
   */
		value: function _removeScriptingNameLookup(objectId) {
			var scriptName = this._scriptingNamesById.get(objectId);
			if (!scriptName) return;

			this._idsByScriptingName.delete(scriptName);
			this._scriptingNamesById.delete(objectId);
		}

		/**
   * @private
   * @param {Xebra.NodeId} objectId - The id of the object
   * @param {string} scriptingName - The scriptingName of the object
   */

	}, {
		key: "_storeScriptingNameLookup",
		value: function _storeScriptingNameLookup(objectId, scriptingName) {
			this._idsByScriptingName.set(scriptingName, objectId);
			this._scriptingNamesById.set(objectId, scriptingName);
		}

		/**
   * @private
   * @param {ObjectNode} obj - The new object
   * @fires PatcherNode.object_added
   */


		/**
   * @private
   * @param {ObjectNode} obj - The changed object
   * @param {ParamNode} param - The changed parameter
   * @fires PatcherNode.object_changed
   */

		/**
   * @private
   * @param {ObjectNode} obj - The destroyed object
   */


		/**
   * @private
   * @param {ObjectNode} view - The PatcherView object node
   * @param {ParamNode} param - the changed parameter
   */


		/**
   * @private
   * @param {ObjectNode} view - The PatcherView object node
   */

	}, {
		key: "_viewModeToRectParam",


		/**
   * @private
   */
		value: function _viewModeToRectParam(mode) {
			return mode === _constants.VIEW_MODES.PATCHING ? "patching_rect" : "presentation_rect";
		}

		/**
   * Assigns an object to the contained frames based on its rect position.
   * @private
   * @param {ObjectNode} obj - the object to assign
   */

	}, {
		key: "_assignObjectToFrames",
		value: function _assignObjectToFrames(obj) {
			var _this2 = this;

			this._frames.forEach(function (frameId) {

				var frame = _this2.getChild(frameId);
				var objRect = obj.getParamValue(_this2._viewModeToRectParam(frame.viewMode));
				var containsObject = frame.containsObject(obj.id);

				if (!objRect && !containsObject) return;

				// if we got no rect for the object or all vals are 0 (indicates not present in that view mode)
				// make sure to remove the obj from the frame if it has been there.
				if (containsObject && (!objRect || frame.viewMode === _constants.VIEW_MODES.PRESENTATION && !obj.getParamValue("presentation"))) {
					frame.removeObject(obj.id);
				} else {
					var containsRect = frame.containsRect(objRect);

					if (containsObject && !containsRect) {
						frame.removeObject(obj.id);
					} else if (!containsObject && containsRect) {
						frame.addObject(obj);
					}
				}
			}, this);
		}

		/**
   * Assigns the contained objects to the given frame based on the rect.
   * @private
   * @param {FrameNode} frame - the frame to assign objects to
   */

	}, {
		key: "_assignObjectsToFrame",
		value: function _assignObjectsToFrame(frame) {
			var _this3 = this;

			var rectParamName = this._viewModeToRectParam(frame.viewMode);

			this._objects.forEach(function (objId) {

				var obj = _this3.getChild(objId);

				var objRect = obj.getParamValue(rectParamName);
				var containsObject = frame.containsObject(obj.id);

				if (!objRect && !containsObject) return;

				// if we got no rect for the object or all vals are 0 (indicates not present in that view mode)
				// make sure to remove the obj from the frame if it has been there.
				if (containsObject && (!objRect || frame.viewMode === _constants.VIEW_MODES.PRESENTATION && !obj.getParamValue("presentation"))) {
					frame.removeObject(obj.id);
				} else {
					var containsRect = frame.containsRect(objRect);

					if (containsObject && !containsRect) {
						frame.removeObject(obj.id);
					} else if (!containsObject && containsRect) {
						frame.addObject(obj);
					}
				}
			}, this);
		}

		/**
   * @private
   */

	}, {
		key: "_updateViewMode",
		value: function _updateViewMode() {
			var _this4 = this;

			var mode = this.viewMode;

			this._frames.forEach(function (frameId) {

				var frame = _this4.getChild(frameId);
				frame.patcherViewMode = mode;
			}, this);
		}

		/**
   * Adds a frame to the patcher.
   * @ignore
   * @param {FrameNode} frame
   * @fires XebraState.frame_added
   * @listens ObjectNode.param_changed
   */

	}, {
		key: "addFrame",
		value: function addFrame(frame) {
			// we add the frame to the frames list but don't directly assign objects. This
			// is due to the design of the protocol delivering objects without an initial state so we
			// don't have the "patching_rect" from the beginning on. Ouch! Luckily this will be emitted
			// as an "param_changed" event so the assignment will happen there as we need to redo it whenever
			// the frame is moved anyway.

			frame.patcherViewMode = this.viewMode; // set the patcher's view mode

			this.addChild(frame.id, frame);
			this._frames.add(frame.id);

			frame.on("param_changed", this._onFrameChange);
			frame.on("viewmode_change", this._onFrameViewModeChange);

			if (frame.isReady) {
				this.emit("frame_added", frame);
			} else {
				frame.once("initialized", this._onFrameInitialized);
			}
		}

		/**
   * Adds an object to the patcher.
   * @ignore
   * @param {ObjectNode} obj
   * @listens ObjectNode.param_changed
   * @listens ObjectNode.destroy
   * @fires XebraState.object_added
   */

	}, {
		key: "addObject",
		value: function addObject(obj) {
			this.addChild(obj.id, obj);

			if (obj.type === "patcherview") {
				this._view = obj;
				obj.on("param_changed", this._onViewChange);
				obj.on("destroy", this._onViewDestroy);
			} else {
				this._objects.add(obj.id);
				obj.on("param_changed", this._onObjectChange);
				obj.on("destroy", this._onObjectDestroy);

				if (obj.isReady) {
					this.emit("object_added", obj);
					this._assignObjectToFrames(obj);
				} else {
					obj.once("initialized", this._onObjectInitialized);
				}
			}
		}

		/**
   * Get the frame with the given id.
   * @param  {Xebra.NodeId} id
   * @return {Frame|null}
   */

	}, {
		key: "getFrame",
		value: function getFrame(id) {
			return this.getChild(id);
		}

		/**
   * Get a list of frames that are present in this patch.
   * @return {FrameNode[]}
   */

	}, {
		key: "getFrames",
		value: function getFrames() {
			var _this5 = this;

			var frames = [];

			this._frames.forEach(function (id) {
				frames.push(_this5.getChild(id));
			}, this);

			return frames;
		}

		/**
   * Get the object with the given id.
   * @param  {Xebra.NodeId} id
   * @return {ObjectNode|null}
   */

	}, {
		key: "getObject",
		value: function getObject(id) {
			return this.getChild(id);
		}

		/**
   * Get the object with the given scripting name.
   * @param  {String} scripting_name
   * @return {ObjectNode|null}
   */

	}, {
		key: "getObjectByScriptingName",
		value: function getObjectByScriptingName(scriptingName) {
			if (this._idsByScriptingName.has(scriptingName)) return this.getChild(this._idsByScriptingName.get(scriptingName));
			return null;
		}

		/**
   * Get a list of objects that are present in this patch.
   * @return {ObjectNode[]}
   */

	}, {
		key: "getObjects",
		value: function getObjects() {
			var _this6 = this;

			var objects = [];

			this._objects.forEach(function (id) {
				objects.push(_this6.getChild(id));
			}, this);

			return objects;
		}

		/**
   * Remove the frame identified by the given id from the patch.
   * @ignore
   * @param  {Xebra.NodeId} id
   * @fires XebraState.frame_removed
   */

	}, {
		key: "removeFrame",
		value: function removeFrame(id) {
			var frame = this.removeChild(id);

			if (frame) {

				this._frames.delete(id);

				// make sure to clean up attached event listeners
				frame.removeListener("param_changed", this._onFrameChange);
				frame.removeListener("viewmode_change", this._onFrameViewModeChange);
				frame.removeListener("initialized", this._onFrameInitialized);

				if (frame.isReady) this.emit("frame_removed", frame);
			}
		}

		/**
   * Remove the object identified by the given id from the patch.
   * @ignore
   * @fires XebraState.object_removed
   * @param  {Xebra.NodeId} id
   */

	}, {
		key: "removeObject",
		value: function removeObject(id) {
			var obj = this.removeChild(id);

			if (obj) {

				this._objects.delete(id);
				this._removeScriptingNameLookup(id);

				// make sure to clean up attached event listeners
				obj.removeListener("param_changed", this._onObjectChange);
				obj.removeListener("destroy", this._onObjectDestroy);
				obj.removeListener("initialized", this._onObjectInitialized);

				if (obj.isReady) this.emit("object_removed", obj);
			}
		}
	}, {
		key: "name",


		// End of bound callbacks

		/**
   * Name of the patcher (same as the filename for saved patchers).
   * @type {string}
   */
		get: function get() {
			return this._view ? this._view.getParamValue("name") : "";
		}

		/**
   * Returns whether the Max patcher is currently in Presentation or Patching display.
   * @type {number}
   * @see Xebra.VIEW_MODES
   */

	}, {
		key: "viewMode",
		get: function get() {
			if (!this._view) return _constants.VIEW_MODES.PATCHING;
			return this._view.getParamValue("presentation") ? _constants.VIEW_MODES.PRESENTATION : _constants.VIEW_MODES.PATCHING;
		}
	}]);

	return PatcherNode;
}(_objectNode2.default);

exports.default = PatcherNode;
module.exports = exports["default"];