"use strict";

var _setPrototypeOf = require("babel-runtime/core-js/object/set-prototype-of");

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = require("babel-runtime/core-js/object/create");

var _create2 = _interopRequireDefault(_create);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _defineProperty = require("babel-runtime/core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; (0, _defineProperty2.default)(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = (0, _getOwnPropertyDescriptor2.default)(object, property); if (desc === undefined) { var parent = (0, _getPrototypeOf2.default)(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _base = require("./base.js");

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @desc <strong>Constructor for internal use only</strong>
 * Representation of a Max object in the Xebra state tree. The `nodeType` property returns the type
 * of the ObjectNode, which corresponds to the Max class of the object it represents. The `getParamTypes`
 * function will return an array of the parameters supported by this object, which usually corresponds
 * to the attributes of the Max object. To listen to parameter changes from Max, subscribe to the
 * {@link ObjectNode.event:param_changed} event.
 * @extends XebraNode
 */
var ObjectNode = function (_XebraNode) {
	_inherits(ObjectNode, _XebraNode);

	/**
  * @param  {Xebra.NodeId} id - The id of the node
  * @param  {string} type - Type identifier of the node
  * @param  {number} creationSeq - The sequence number for the creation of this node
  * @param  {number} patcherId - The id of the parent node
  */
	function ObjectNode(id, type, creationSeq, patcherId) {
		_classCallCheck(this, ObjectNode);

		var _this = _possibleConstructorReturn(this, (ObjectNode.__proto__ || (0, _getPrototypeOf2.default)(ObjectNode)).call(this, id, type, creationSeq));

		_this._onParamChange = function (param) {

			/**
    * Parameter Changed event. Listen to this event to be notified when the value of a parameter changes.
    * @event ObjectNode.param_changed
    * @param {ObjectNode} object     This
    * @param {ParamNode}  param      The parameter node
    */
			_this.emit("param_changed", _this, param);
		};

		_this._onParamSet = function (param) {
			/**
    * Parameter set event. Used internally in order to communicate parameter changes to Max. Use param_changed instead if you'd like
    * to keep track of parameter changes.
    *
    * @event ObjectNode.param_set
    * @param {ObjectNode} object     This
    * @param {ParamNode}  param      The parameter node
    */
			_this.emit("param_set", _this, param);
		};

		_this._patcherId = patcherId;
		_this._isReady = false;
		return _this;
	}

	/**
  * @desc Have all of the parameters for the object been added yet
  * @readonly
  * @private
  * @type {boolean}
  */


	_createClass(ObjectNode, [{
		key: "addParam",


		// End of bound callbacks

		value: function addParam(param) {
			var _this2 = this;

			_get(ObjectNode.prototype.__proto__ || (0, _getPrototypeOf2.default)(ObjectNode.prototype), "addParam", this).call(this, param);

			if (!this._isReady) {
				var paramTypes = this.getParamTypes();
				var isReady = true;
				paramTypes.forEach(function (type) {
					if (!_this2._paramsNameLookup.has(type)) {
						isReady = false;
						return false; // found a missing parameter, so stop
					}
					return true; // keep going
				});

				if (isReady) {
					this._isReady = true;
					this.emit("object_initialized", this);
				}
			}
		}
	}, {
		key: "isReady",
		get: function get() {
			return this._isReady;
		}

		/**
   * @desc Unique id of the parent patcher of the Max object.
   * @readonly
   * @type {Xebra.NodeId}
   */

	}, {
		key: "patcherId",
		get: function get() {
			return this._patcherId;
		}

		// Bound callbacks using fat arrow notation
		/**
   * @private
   * @param {ParamNode}
   * @fires ObjectNode.param_changed
   */


		/**
   * @private
   * @param {ParamNode}
   * @fires ObjectNode.param_set
   */

	}]);

	return ObjectNode;
}(_base2.default);

exports.default = ObjectNode;
module.exports = exports["default"];