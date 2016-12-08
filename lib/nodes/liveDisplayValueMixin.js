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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _constants = require("../lib/constants.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass; }

function stringForLiveValue(liveValue, unitStyle) {
	if (liveValue === undefined || unitStyle === undefined) return "";

	var outVal = null;

	switch (unitStyle) {
		case _constants.LIVE_UNIT_STYLES.LIVE_UNIT_INT:
			outVal = "" + Math.round(liveValue);
			break;
		case _constants.LIVE_UNIT_STYLES.LIVE_UNIT_FLOAT:
			outVal = liveValue.toFixed(2);
			break;
		case _constants.LIVE_UNIT_STYLES.LIVE_UNIT_TIME:
			if (liveValue >= 10000) {
				outVal = (liveValue / 1000).toFixed(1) + " s";
			} else if (liveValue >= 1000) {
				outVal = (liveValue / 1000).toFixed(2) + " s";
			} else if (liveValue >= 100) {
				outVal = Math.round(liveValue) + " ms";
			} else if (liveValue >= 10) {
				outVal = liveValue.toFixed(1) + " ms";
			} else {
				outVal = liveValue.toFixed(2) + " ms";
			}
			break;
		case _constants.LIVE_UNIT_STYLES.LIVE_UNIT_HZ:
			if (liveValue >= 10000) {
				outVal = (liveValue / 1000).toFixed(1) + " kHz";
			} else if (liveValue >= 1000) {
				outVal = (liveValue / 1000).toFixed(2) + " kHz";
			} else if (liveValue >= 100) {
				outVal = Math.round(liveValue) + " Hz";
			} else if (liveValue >= 10) {
				outVal = liveValue.toFixed(1) + " Hz";
			} else {
				outVal = liveValue.toFixed(2) + " Hz";
			}
			break;
		case _constants.LIVE_UNIT_STYLES.LIVE_UNIT_DB:
			if (Math.abs(liveValue) >= 10) {
				outVal = Math.round(liveValue) + " dB";
			} else {
				outVal = liveValue.toFixed(1) + " dB";
			}
			break;
		case _constants.LIVE_UNIT_STYLES.LIVE_UNIT_PERCENT:
			if (Math.abs(liveValue) >= 100) {
				outVal = Math.round(liveValue) + " " + " %";
			} else if (Math.abs(liveValue) >= 10) {
				outVal = liveValue.toFixed(1) + " %";
			} else {
				outVal = liveValue.toFixed(2) + " %";
			}
			break;
		case _constants.LIVE_UNIT_STYLES.LIVE_UNIT_PAN:
			if (liveValue === 0) {
				outVal = "C";
			} else if (liveValue > 0) {
				outVal = Math.round(liveValue) + "R";
			} else {
				outVal = Math.round(liveValue) + "L";
			}
			break;
		case _constants.LIVE_UNIT_STYLES.LIVE_UNIT_SEMITONES:
			{
				var val = Math.round(liveValue);
				if (val === 0) {
					outVal = "0 st";
				} else if (val > 0) {
					outVal = "+" + val + " st";
				} else {
					outVal = val + " st";
				}
				break;
			}case _constants.LIVE_UNIT_STYLES.LIVE_UNIT_MIDI:
			{
				var _val = Math.round(liveValue);
				var dRes = Math.floor(_val / 12);
				var mRes = _val - dRes * 12;
				var notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
				outVal = "" + notes[mRes] + (dRes - 2);
				if (_val > 127) outVal = "+";
				if (_val < 0) outVal = "-";
				break;
			}
		case _constants.LIVE_UNIT_STYLES.LIVE_UNIT_CUSTOM:
		case _constants.LIVE_UNIT_STYLES.LIVE_UNIT_NATIVE:
			outVal = liveValue.toFixed(2);
			break;
		default:
			outVal = "";
	}
	return outVal;
}

/**
 * Adds a virtual, readonly "displayvalue" parameter to the object in order to
 * simplify reading the different display and unit styles of certain live objects. For example,
 * if the value of the "distance" parameter is 0.5, then depending on the configuration of the
 * object, the "displayvalue" parameter could be "400 Hz" or "C3#". This mixin is currently
 * added to ObjectNodes representing live.dial, live.numbox and live.slider objects.
 *
 * @mixin LiveDisplayValueMixin
 * @example
 * // dialNode is the ObjectNode for the live.dial
 * dialNode.setParamValue("_parameter_range", [10, 20]);
 * dialNode.setParamValue("_parameter_exponent", 1);
 * dialNode.setParamValue("distance", 0.5);
 * dialNode.setParamValue("_parameter_unitstyle", "Pan");
 * dialNode.getParamValue("displayvalue"); // returns "15R"
 *
 * dialNode.setParamValue("_parameter_unitstyle", "Semitones");
 * dialNode.getParamValue("displayvalue"); // returns "+ 15 st"
 *
 * @see Xebra.LIVE_UNIT_STYLES
 */

exports.default = function (objClass) {
	return function (_objClass) {
		_inherits(_class, _objClass);

		function _class() {
			_classCallCheck(this, _class);

			return _possibleConstructorReturn(this, (_class.__proto__ || (0, _getPrototypeOf2.default)(_class)).apply(this, arguments));
		}

		_createClass(_class, [{
			key: "getParamValue",

			/**
    * Get the value for the parameter specified by the given parameter type identifier.
    * @param  {string} type Parameter type identifier
    * @return {Xebra.ParamValueType}
    * @ignore
    * @override
    * @memberof LiveDisplayValueMixin
    * @instance
   */
			value: function getParamValue(type) {
				if (type === "displayvalue") {
					var val = this.getParamValue("value");
					var unitStyle = this.getParamValue("_parameter_unitstyle");
					return stringForLiveValue(val, unitStyle);
				}
				return _get(_class.prototype.__proto__ || (0, _getPrototypeOf2.default)(_class.prototype), "getParamValue", this).call(this, type);
			}

			/**
     * Adds the virtual displayvalue parameter to the paramTypes array.
   	 * @ignore
   	 * @override
   	 * @memberof LiveDisplayValueMixin
   	 * @instance
    */

		}, {
			key: "getParamTypes",
			value: function getParamTypes() {
				return _get(_class.prototype.__proto__ || (0, _getPrototypeOf2.default)(_class.prototype), "getParamTypes", this).call(this).concat("displayvalue");
			}

			/**
     * Adds the virtual displayvalue parameter to the optionalParamTypes array.
   	 * @ignore
   	 * @override
   	 * @memberof LiveDisplayValueMixin
   	 * @instance
    */

		}, {
			key: "getOptionalParamTypes",
			value: function getOptionalParamTypes() {
				return _get(_class.prototype.__proto__ || (0, _getPrototypeOf2.default)(_class.prototype), "getOptionalParamTypes", this).call(this).concat("displayvalue");
			}
		}]);

		return _class;
	}(objClass);
};

module.exports = exports["default"];