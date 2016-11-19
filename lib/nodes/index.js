"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ParamNode = exports.ObjectNode = exports.PatcherNode = exports.FrameNode = exports.getInstanceForObjectType = undefined;

var _objectList = require("../lib/objectList.js");

var _frame = require("./frame.js");

var _frame2 = _interopRequireDefault(_frame);

var _patcher = require("./patcher.js");

var _patcher2 = _interopRequireDefault(_patcher);

var _objectNode = require("./objectNode.js");

var _objectNode2 = _interopRequireDefault(_objectNode);

var _paramNode = require("./paramNode.js");

var _paramNode2 = _interopRequireDefault(_paramNode);

var _liveDisplayValueMixin = require("./liveDisplayValueMixin.js");

var _liveDisplayValueMixin2 = _interopRequireDefault(_liveDisplayValueMixin);

var _liveScalingObjectMixin = require("./liveScalingObjectMixin.js");

var _liveScalingObjectMixin2 = _interopRequireDefault(_liveScalingObjectMixin);

var _resourceObjectMixin = require("./resourceObjectMixin.js");

var _resourceObjectMixin2 = _interopRequireDefault(_resourceObjectMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LIVE_DISPLAY_VALUE_OBJECT_TYPES = [_objectList.OBJECTS.LIVE_DIAL, _objectList.OBJECTS.LIVE_NUMBOX, _objectList.OBJECTS.LIVE_SLIDER];
var LIVE_SCALING_OBJECT_TYPES = [_objectList.OBJECTS.LIVE_DIAL, _objectList.OBJECTS.LIVE_SLIDER];
var RESOURCE_OBJECT_TYPES = [_objectList.OBJECTS.FPIC, _objectList.OBJECTS.LIVE_TAB, _objectList.OBJECTS.LIVE_TEXT];

function getInstanceForObjectType(id, type, creationSeq, parentId) {
	// Patchers
	if (type === _objectList.OBJECTS.PATCHER) {
		return new _patcher2.default(id, type, creationSeq, parentId);
	}
	// Mira Frames
	else if (type === _objectList.OBJECTS.MIRA_FRAME) {
			return new _frame2.default(id, type, creationSeq, parentId);
		}

	var ObjClass = _objectNode2.default;

	// Certain objects, for example fpic, can have resources (only images for now)
	// Changes in certain parameters can trigger a resource request (these relationships are object-dependent)
	// Let it be known, this hard-coding causes us great pain
	if (RESOURCE_OBJECT_TYPES.indexOf(type) > -1) ObjClass = (0, _resourceObjectMixin2.default)(ObjClass);
	if (LIVE_SCALING_OBJECT_TYPES.indexOf(type) > -1) ObjClass = (0, _liveScalingObjectMixin2.default)(ObjClass);
	if (LIVE_DISPLAY_VALUE_OBJECT_TYPES.indexOf(type) > -1) ObjClass = (0, _liveDisplayValueMixin2.default)(ObjClass);

	return new ObjClass(id, type, creationSeq, parentId);
}

exports.getInstanceForObjectType = getInstanceForObjectType;
exports.FrameNode = _frame2.default;
exports.PatcherNode = _patcher2.default;
exports.ObjectNode = _objectNode2.default;
exports.ParamNode = _paramNode2.default;