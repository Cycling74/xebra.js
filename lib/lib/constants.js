"use strict";

var _freeze = require("babel-runtime/core-js/object/freeze");

var _freeze2 = _interopRequireDefault(_freeze);

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Motion Types supported by Xebra. Use these as type identifiers when calling sendMotionData on Xebra.State.
 * @static
 * @constant
 * @memberof Xebra
 * @type {object}
 * @property {string} ACCEL - Acceleration, minus any acceleration due to gravity
 * @property {string} GRAVITY - Acceleration due to gravity
 * @property {string} ORIENTATION - Roll, pitch and yaw
 * @property {string} RAWACCEL - Raw acceleration, including both user acceleration as well as gravity
 * @property {string} ROTATIONRATE - Raw gyroscope readings: x, y and z rotation rates
 */
var MOTION_TYPES = (0, _freeze2.default)({
  ROTATIONRATE: "rotationrate",
  GRAVITY: "gravity",
  ACCEL: "accel",
  ORIENTATION: "orientation",
  RAWACCEL: "rawaccel"
});

/**
 * Unit Styles of live.* objects.
 * @static
 * @constant
 * @memberof Xebra
 * @type {object}
 * @property {string} LIVE_UNIT_INT - Integer Unit Style
 * @property {string} LIVE_UNIT_FLOAT - Float Unit Style
 * @property {string} LIVE_UNIT_TIME - Time Unit Style
 * @property {string} LIVE_UNIT_HZ - Hertz Unit Style
 * @property {string} LIVE_UNIT_DB - deciBel Unit Style
 * @property {string} LIVE_UNIT_PERCENT - Percent (%) Unit Style
 * @property {string} LIVE_UNIT_PAN - Pan Unit Style
 * @property {string} LIVE_UNIT_SEMITONES - Semitones Unit Stlye
 * @property {string} LIVE_UNIT_MIDI - MIDI Notes Unit Style
 * @property {string} LIVE_UNIT_CUSTOM - Custom Unit Style
 * @property {string} LIVE_UNIT_NATIVE - Native Unit Style
 */
var LIVE_UNIT_STYLES = (0, _freeze2.default)({
  LIVE_UNIT_INT: "Int",
  LIVE_UNIT_FLOAT: "Float",
  LIVE_UNIT_TIME: "Time",
  LIVE_UNIT_HZ: "Hertz",
  LIVE_UNIT_DB: "deciBel",
  LIVE_UNIT_PERCENT: "%",
  LIVE_UNIT_PAN: "Pan",
  LIVE_UNIT_SEMITONES: "Semitones",
  LIVE_UNIT_MIDI: "MIDI",
  LIVE_UNIT_CUSTOM: "Custom",
  LIVE_UNIT_NATIVE: "Native"
});

/**
 * Available View Modes of XebraState.
 * @static
 * @constant
 * @memberof Xebra
 * @type {object}
 * @property {number} LINKED - Calculate visibility and position using the same view mode as Max
 * @property {number} PRESENTATION - Calculate visibility and position always using Presentation Mode
 * @property {number} PATCHING - Calculate visibility and position always using Patching Mode
 */
var VIEW_MODES = (0, _freeze2.default)({
  LINKED: 1,
  PRESENTATION: 2,
  PATCHING: 4
});

exports.LIVE_UNIT_STYLES = LIVE_UNIT_STYLES;
exports.MOTION_TYPES = MOTION_TYPES;
exports.VIEW_MODES = VIEW_MODES;