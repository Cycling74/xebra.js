"use strict";

var _freeze = require("babel-runtime/core-js/object/freeze");

var _freeze2 = _interopRequireDefault(_freeze);

var _from = require("babel-runtime/core-js/array/from");

var _from2 = _interopRequireDefault(_from);

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _events = require("events");

var _objectList = require("../lib/objectList.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @desc <strong>Constructor for internal use only</strong>
 * Base class for Max nodes in the Xebra state tree. Through Xebra, Max exposes patchers, mira.frame objects,
 * other Max objects and assignable parameters for each object. Each of these is represented by a different
 * XebraNode subclass.
 * @class
 */
var XebraNode = function (_EventEmitter) {
	_inherits(XebraNode, _EventEmitter);

	/**
  * @param  {number} id          The id of the node
  * @param  {string} type        Type identifier of the node
  * @param  {number} creationSeq The sequence number for the creation of this node
  */
	function XebraNode(id, type, creationSeq) {
		_classCallCheck(this, XebraNode);

		var _this = _possibleConstructorReturn(this, (XebraNode.__proto__ || (0, _getPrototypeOf2.default)(XebraNode)).call(this));

		_this._id = id;
		_this._type = type;
		_this._creationSeq = creationSeq;
		_this._children = new _map2.default();
		_this._paramsNameLookup = new _map2.default();
		return _this;
	}

	/**
  * Destroys the node by destroying all child nodes and removing all attached listeners
  * @ignore
  */


	_createClass(XebraNode, [{
		key: "destroy",
		value: function destroy() {
			/**
    * Object Destroyed event
    * @alias XebraNode.destroy
    * @event XebraNode.destroy
    * @param {XebraNode} object     The destroyed object
    */
			this.emit("destroy", this);

			this.removeAllListeners();
		}

		/**
   * The creation sequence number associated with this node. An increasing integer unique to each node
   * @member {number}
   */

	}, {
		key: "_getParamForType",


		/**
   * @private
   */
		value: function _getParamForType(type) {
			var id = this._paramsNameLookup.get(type);
			return this.getChild(id);
		}

		/**
   * Callback when a parameter value is changed due to a modification in Max
   * @abstract
   * @method
   * @private
   */

	}, {
		key: "_onParamChange",
		value: function _onParamChange() {
			throw new Error("Missing subclass implementation for _onParamChange");
		}

		/**
   * Callback when a parameter value was set by the client
   * @abstract
   * @method
   * @private
   */

	}, {
		key: "_onParamSet",
		value: function _onParamSet() {
			throw new Error("Missing subclass implementation for _onParamSet");
		}

		/**
   * Add child
   * @ignore
   * @param {Xebra.NodeId} id - The id of the child to be added
   * @param {XebraNode} node - The child to add
   */

	}, {
		key: "addChild",
		value: function addChild(id, node) {
			this._children.set(id, node);
		}

		/**
   * Execute callback function for each child of the node
   * @ignore
   * @param {function} callback - The callback to execute
   * @param {object} context - The context of the callback
   */

	}, {
		key: "forEachChild",
		value: function forEachChild(callback, context) {
			this._children.forEach(callback, context);
		}

		/**
   * Get the child with the given id
   * @ignore
   * @param {Xebra.NodeId}
   * @return {XebraNode|null}
   */

	}, {
		key: "getChild",
		value: function getChild(id) {
			return this._children.get(id) || null;
		}

		/**
   * Get all children of the node
   * @ignore
   * @return {XebraNode[]}
   */

	}, {
		key: "getChildren",
		value: function getChildren() {
			return (0, _from2.default)(this._children.values());
		}

		/**
   * Check whether the given id is a direct child
   * @ignore
   * @param {Xebra.NodeId} id - The id of the potential child
   * @return {boolean}
   */

	}, {
		key: "hasChild",
		value: function hasChild(id) {
			return this._children.has(id);
		}

		/**
   * Remove the direct child connection to the node with the given id
   * @ignore
   * @param {Xebra.NodeId} id - The id of the child to remove the connection to
   */

	}, {
		key: "removeChild",
		value: function removeChild(id) {
			var child = this.getChild(id);
			if (child) this._children.delete(id);
			return child;
		}

		/**
   * Adds a Parameter node to this node's children. Also adds the node as a listener for the Parameter node,
   * so local and remote changes to that node will trigger {@link State.object_changed} events.
   * @ignore
   * @listens ParamNode#change
   * @listens ParamNode#set
   * @param {ParamNode} param The parameter to add
   */

	}, {
		key: "addParam",
		value: function addParam(param) {
			this._paramsNameLookup.set(param.type, param.id);

			param.on("change", this._onParamChange);
			param.on("set", this._onParamSet);

			this.addChild(param.id, param);
		}

		/**
   * Returns a list of the names of all available parameters
   * @return {string[]}
   */

	}, {
		key: "getParamTypes",
		value: function getParamTypes() {
			return (0, _freeze2.default)(_objectList.OBJECT_PARAMETERS[this.type] || []);
		}

		/**
   * Get the value for the parameter with the name <i>type</i>
   * @param  {String} type - Parameter type identifier
   * @return {Xebra.ParamValueType} returns the value(s) of the given parameter type or null
   */

	}, {
		key: "getParamValue",
		value: function getParamValue(type) {
			var param = this._getParamForType(type);
			if (param) return param.value;
			return null;
		}

		/**
   * Set the value for the parameter with the name <i>type</i> to the given value
   * @param {String} type - Parameter type identifier
   * @param {Object} value - Parameter value
   */

	}, {
		key: "setParamValue",
		value: function setParamValue(type, value) {
			var param = this._getParamForType(type);
			if (param) param.value = value;
		}
	}, {
		key: "creationSequence",
		get: function get() {
			return this._creationSeq;
		}

		/**
   * Unique id associated with each XebraNode
   * @readonly
   * @member {Xebra.NodeId}
   */

	}, {
		key: "id",
		get: function get() {
			return this._id;
		}

		/**
   * @desc Have all of the parameters for the object been added yet
   * @readonly
   * @private
   * @type {boolean}
   */

	}, {
		key: "isReady",
		get: function get() {
			return true;
		}

		/**
   * Type associated with this node. For Objects, Frames and Patchers, this will correspond to the class name
   * of the Max object. For parameters, this will be the name of the associated parameter. Parameters usually
   * correspond to the name of a Max object's attribute.
   * @member {string}
   */

	}, {
		key: "type",
		get: function get() {
			return this._type;
		}
	}]);

	return XebraNode;
}(_events.EventEmitter);

exports.default = XebraNode;
module.exports = exports["default"];