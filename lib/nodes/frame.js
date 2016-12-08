"use strict";

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
 * FrameNode instances represent mira.frame objects in a Max patcher. Using the FrameNode object,
 * it is possible to see which Max objects intersect a given mira.frame object, in both Patching
 * as well as Presentation Modes.
 * @class
 * @extends ObjectNode
 * @extends XebraNode
 */
var FrameNode = function (_ObjectNode) {
	_inherits(FrameNode, _ObjectNode);

	/**
  * @param  {number} id - The id of the node
  * @param  {string} type - Type identifier of the node
  * @param  {number} creationSeq - The sequence number for the creation of this node
  * @param  {number} patcherId - The id of the parent node
  */
	function FrameNode(id, type, creationSeq, patcherId) {
		_classCallCheck(this, FrameNode);

		var _this = _possibleConstructorReturn(this, (FrameNode.__proto__ || (0, _getPrototypeOf2.default)(FrameNode)).call(this, id, type, creationSeq, patcherId));

		_this._onObjectInitialized = function (obj) {
			_this.emit("object_added", obj);
		};

		_this._onObjectChange = function (obj, param) {
			if (_this.getChild(obj.id)) _this.emit("object_changed", obj, param);
		};

		_this._onObjectDestroy = function (obj) {
			_this.removeObject(obj.id);
		};

		_this._objects = new _set2.default();
		_this._viewMode = _constants.VIEW_MODES.LINKED;
		_this._patcherViewMode = _constants.VIEW_MODES.PATCHING;
		return _this;
	}

	/**
  * The view mode of the FrameNode. In Patching mode, object positions and visibility will be
  * calculated relative to the patching_rect of the mira.frame object. In Presentation mode,
  * the presentation_rect will be used. Linked mode will defer to Max. If Max is in Presentation
  * mode, Xebra will use Presentation mode, and if Max is in Patching mode, Xebra will use
  * Patching mode as well.
  * @type {number}
  * @see Xebra.VIEW_MODES
  */


	_createClass(FrameNode, [{
		key: "addObject",


		// End of bound callbacks

		/**
   * Add the given object to the frame.
   * @ignore
   * @param {ObjectNode} obj
   * @listens ObjectNode.param_changed
   * @listens ObjectNode.destroy
   * @fires XebraState.object_added
   */
		value: function addObject(obj) {
			this._objects.add(obj.id);
			this.addChild(obj.id, obj);

			obj.on("param_changed", this._onObjectChange);
			obj.on("destroy", this._onObjectDestroy);

			if (obj.isReady) {
				this.emit("object_added", obj);
			} else {
				obj.once("initialized", this._onObjectInitialized);
			}
		}

		/**
   * Check whether the frame contains the object identified by the given id.
   * @param  {Xebra.NodeId} id - The id of the object
   * @return {boolean}
   */

	}, {
		key: "containsObject",
		value: function containsObject(id) {
			return this.hasChild(id);
		}

		/**
   * Boundary check whether the given rect is visible within the frame.
   * @param  {Xebra.PatchingRect} rect - The rectangle to check
   * @return {boolean} whether the rect is contained or not
   */

	}, {
		key: "containsRect",
		value: function containsRect(rect) {
			var frameRect = this.viewMode === _constants.VIEW_MODES.PATCHING ? this.getParamValue("patching_rect") : this.getParamValue("presentation_rect");

			if (!frameRect) return false; // don't have the rect yet

			if (rect[0] < frameRect[0] + frameRect[2] && // x
			rect[0] + rect[2] >= frameRect[0] && rect[1] < frameRect[1] + frameRect[3] && // y
			rect[1] + rect[3] >= frameRect[1]) {
				return true;
			}

			return false;
		}

		/**
   * Get the object with the given id.
   * @param  {Xebra.NodeId} id - The id of the object
   * @return {ObjectNode|null} The object (if contained) or null
   */

	}, {
		key: "getObject",
		value: function getObject(id) {
			return this.getChild(id);
		}

		/**
   * Get a list of all objects contained in the frame.
   * @return {ObjectNode[]} An array of all contained objects
   */

	}, {
		key: "getObjects",
		value: function getObjects() {
			var _this2 = this;

			var objects = [];

			this._objects.forEach(function (id) {
				objects.push(_this2.getChild(id));
			}, this);

			return objects;
		}

		/**
   * Returns the frame of the object relative the the frame, in the current view mode, or null if the object is not in the frame.
   * @return {Xebra.PatchingRect|null} Relative object frame.
   */

	}, {
		key: "getRelativeRect",
		value: function getRelativeRect(object) {
			if (!this.containsObject(object.id)) return null;
			var viewMode = this.viewMode;
			var objectRect = object.getParamValue(viewMode === _constants.VIEW_MODES.PATCHING ? "patching_rect" : "presentation_rect");
			var thisRect = this.getParamValue(viewMode === _constants.VIEW_MODES.PATCHING ? "patching_rect" : "presentation_rect");
			return [objectRect[0] - thisRect[0], objectRect[1] - thisRect[1], objectRect[2], objectRect[3]];
		}

		/**
   * Check whether the current view mode is linked.
   * @return {boolean} Whether the frame defers to Max for it's viewMode or not
   */

	}, {
		key: "isViewModeLinked",
		value: function isViewModeLinked() {
			return this._viewMode === _constants.VIEW_MODES.LINKED;
		}

		/**
   * Remove the object with the given id from the frame.
   * @ignore
   * @fires XebraState.object_removed
   * @param  {Xebra.NodeId} id - The id of the object to remove
   */

	}, {
		key: "removeObject",
		value: function removeObject(id) {
			var obj = this.removeChild(id);

			if (obj) {

				this._objects.delete(id);

				// make sure to clean up attached event listeners
				obj.removeListener("param_changed", this._onObjectChange);
				obj.removeListener("destroy", this._onObjectDestroy);
				obj.removeListener("initialized", this._onObjectInitialized);

				if (obj.isReady) this.emit("object_removed", obj);
			}
		}
	}, {
		key: "viewMode",
		get: function get() {
			if (this._viewMode === _constants.VIEW_MODES.LINKED) return this._patcherViewMode;
			return this._viewMode;
		},
		set: function set(mode) {
			this._viewMode = mode;
			this.emit("viewmode_change", this, mode);
		}

		/**
   * Sets the view mode of the containing patcher.
   * @private
   * @type {number}
   */

	}, {
		key: "patcherViewMode",
		get: function get() {
			return this._patcherViewMode;
		},
		set: function set(mode) {
			this._patcherViewMode = mode;
			if (this.isViewModeLinked()) this.emit("viewmode_change", this, mode);
		}

		// Bound callbacks using fat arrow notation

		/**
   * @private
   * @fires XebraState.object_added
   * @param {ObjectNode} obj - The new object
   */


		/**
   * @private
   * @fires XebraState.object_changed
   * @param {ObjectNode} obj - The changed object
   * @param {ParamNode} param - The changed parameter
   */


		/**
   * Callback when a contained object got destroyed
   * @private
   * @param {ObjectNode} obj - The destroyed object
   */

	}]);

	return FrameNode;
}(_objectNode2.default);

exports.default = FrameNode;
module.exports = exports["default"];