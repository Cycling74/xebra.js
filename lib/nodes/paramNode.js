"use strict";

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

var _base = require("./base.js");

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * Unfortunately Max doesn't set the values for gradient related parameters
 * properly when an object is created and the values are set to defaults.
 * That's why we set some default values here
 * see #10136
 */

var PARAM_DEFAULT_VALUES = {
	bgfillcolor_pt1: [0.5, 0.05],
	bgfillcolor_pt2: [0.5, 0.95]
};

/**
 * @private
 */
function _getDefaultParamValue(type, value) {
	if ((!value || value.constructor === Array && !value.length) && PARAM_DEFAULT_VALUES.hasOwnProperty(type)) {
		return PARAM_DEFAULT_VALUES[type];
	}
	return value;
}

/*
 * Communication between xebra-state and Max uses a modified form of OSC,
 * which passes values along with types (h for integer, d for float, etc.).
 * Javascript doesn't differentiate between integers and floats. So,
 * xebra-state needs to store the types of each parameter when Max
 * updates the value of that parameter. There are some special parameters,
 * however, that are not initialized by Max. These types must be known
 * beforehand and are hardcoded.
 */
var HARDCODED_TYPES = {
	moved_touch: ["h", "h", "h", "h", "h", "h", "d", "d"],
	up_down_cancelled_touch: ["h", "h", "h", "h", "h", "h", "d", "d"],
	pinch: ["h", "h", "h", "d", "d", "h"],
	region: ["h", "h", "h", "h", "h", "h"],
	rotate: ["h", "h", "h", "d", "d", "h"],
	swipe: ["h", "h", "h", "h", "h"],
	tap: ["h", "h", "h", "d", "d", "h"],
	rawsend: ["h", "h"],
	rotationrate: ["h", "h", "d", "d", "d", "d"],
	gravity: ["h", "h", "d", "d", "d", "d"],
	accel: ["h", "h", "d", "d", "d", "d"],
	orientation: ["h", "h", "d", "d", "d", "d"],
	rawaccel: ["h", "h", "d", "d", "d", "d"],
	touchy: ["s", "s", "h", "h"]
};

function _getHardcodedOSCTypes(type) {
	if (HARDCODED_TYPES.hasOwnProperty(type)) return HARDCODED_TYPES[type];
	return null;
}

/**
 * @class
 * @desc <strong>Constructor for internal use only</strong>
 * Representation of a Max object parameter. Usually, a parameter is simply a Max
 * attribute. Setting the value of the parameter will update the Max object attribute with
 * the same name. Some parameters do not map to attributes, for example the "distance"
 * parameter of a slider object, which controls the value of the slider.
 * @extends XebraNode
 */

var ParamNode = function (_XebraNode) {
	_inherits(ParamNode, _XebraNode);

	/**
  * @param  {Number} id - The id of the node
  * @param  {String} type - Type identifier of the node
  * @param  {Number} creationSeq - The sequence number for the creation of this node
  */
	function ParamNode(id, type, creationSeq) {
		_classCallCheck(this, ParamNode);

		var _this = _possibleConstructorReturn(this, (ParamNode.__proto__ || (0, _getPrototypeOf2.default)(ParamNode)).call(this, id, type, creationSeq));

		_this._onParamChange = function (param) {
			_this.emit("change", _this);
		};

		_this._onParamSet = function (param) {
			_this.emit("set", _this);
		};

		_this._sequence = 0;
		_this._currentRemoteSequence = 0;
		_this._value = _getDefaultParamValue(type, null);

		// Not beautiful but given the way we have to mirror all OSC types across Max and the client
		// we hardcode the types for params that don't receive an initial value here
		_this._types = _getHardcodedOSCTypes(type);
		return _this;
	}

	/**
  * The sequence number associated with the most recent modification. Whenever the value of the
  * parameter is updated in Max or some other remote endpoint, this sequence number will increase.
  * @type {number}
  */


	_createClass(ParamNode, [{
		key: "_storeValue",

		// End of bound callbacks

		/**
   * @private
   */
		value: function _storeValue(value) {
			var val = _getDefaultParamValue(this.type, value);

			if (val && val.length === 1) {
				this._value = val[0];
			} else {
				this._value = val;
			}
		}

		/**
   * getter for the OSC value types
   * @ignore
   * @readonly
   * @type {string[]}
   */

	}, {
		key: "init",


		/**
   * Inits the node with the given value
   * @ignore
   * @param  {Xebra.ParamValueType} value [description]
   */
		value: function init(value) {
			this._storeValue(value);
		}

		/**
   * Modifies the value of the parameter. This is used in order to apply remote modifications. Use the param.value getter/setter if you want to read/change the value.
   * @ignore
   * @param  {Xebra.ParamValueType} value - The new value
   * @param  {string[]} value - The OSC types
   * @param  {number} remoteSequence - The remote sequence number
   * @fires ParamNode.change
   */

	}, {
		key: "modify",
		value: function modify(value, types, remoteSequence) {
			if (this._currentRemoteSequence && this._currentRemoteSequence >= remoteSequence) return;

			this._currentRemoteSequence = remoteSequence;
			this._storeValue(value);

			// don't overwrite types for certain value
			if (!HARDCODED_TYPES.hasOwnProperty(this.type)) {
				this._types = types;
			}

			/**
    * Parameter change event
    * @event ParamNode.change
    * @param {ParamNode} param this
    */
			this.emit("change", this);
		}
	}, {
		key: "remoteSequence",
		get: function get() {
			return this._currentRemoteSequence;
		}

		// Bound callbacks using fat arrow notation

		/**
   * @private
   * @param {ParamNode} param - The changed parameter
   */


		/**
   * @private
   * @param {ParamNode} param - The changed parameter
   */

	}, {
		key: "types",
		get: function get() {
			return this._types;
		}

		/**
   * The client modification sequence number
   * @ignore
   * @readonly
   * @type {number}
   */

	}, {
		key: "sequence",
		get: function get() {
			return this._sequence;
		}

		/**
   * The current value of this parameter. Setting the value will trigger an update in Max, if connected.
   * This will not cause an ObjectNode.param_changed event to fire, however, since this is only fired
   * on changes that come from Max.
   * @type {Xebra.ParamValueType}
   * @fires ParamNode#set
   */

	}, {
		key: "value",
		get: function get() {
			// handle enums
			if (this.getParamValue("style") === "enumindex") {
				var values = this.getParamValue("enumvals");
				if (!values) return null;
				return values[this._value];
			}
			return this._value;
		},
		set: function set(value) {
			this._storeValue(value);
			this._sequence++;
			/**
    * Parameter set event
    * @event ParamNode#set
    * @ignore
    * @param {ParamNode} param this
    */
			this.emit("set", this);
		}
	}]);

	return ParamNode;
}(_base2.default);

exports.default = ParamNode;
module.exports = exports["default"];