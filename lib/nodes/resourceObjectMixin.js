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

var _objectList = require("../lib/objectList.js");

var _resource = require("../lib/resource.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Request and manage remote resources from the Max seach path. A resource includes both metadata,
 * like image size and file type, as well as the file data itself. Only images are currently supported.
 *
 * This Mixin is currently applied to instances of ObjectNode representing
 * fpic, live.tab and live.text.
 *
 * @mixin ResourceObjectMixin
 * @example
 * // An ObjectNode that uses resources will return a nonzero value from getResourceCount
 * const fpicObject;
 * const resourceCount = fpicObject.getResourceCount(); // Will always be one
 *
 * // To get a specific resource, use the getResourceAtIndex function
 * const resource = fpicObject.getResourceAtIndex(0);
 *
 * // ObjectNodes that use resources will manage those resources on their own. If you'd like
 * // to handle the data for that resource as well, then you must register another listener.
 * // The resource doesn't hold on to data from Max once it receives it, so be sure to listen for {@link Resource.event:data_received}
 * // events in order to handle resource data.
 * resource.on("data_received", (filename, data_uri) => {
 * // Do something with the data
 * });
 *
 * // For resources that belong to an ObjectNode, it doesn't make sense to set the filename and
 * // dimensions properties of the resource directly. Rather, you can set the parameters of the
 * // ObjectNode, and it will manage resources itself.
 * fpicObject.setParamValue("pic", "alex.png"); // Will request new resource data.
 */
exports.default = function (objClass) {
	return function (_objClass) {
		_inherits(_class2, _objClass);

		function _class2(id, type, creationSeq, patcherId) {
			_classCallCheck(this, _class2);

			var _this = _possibleConstructorReturn(this, (_class2.__proto__ || (0, _getPrototypeOf2.default)(_class2)).apply(this, arguments));

			_this._onParamChangeForResources = function (param) {
				if (_this._type === _objectList.OBJECTS.FPIC) {
					if (param.type === "pic") {
						_this._resources[0].filename = param.value;
					}
				} else if (_this._type === _objectList.OBJECTS.LIVE_TEXT) {
					if (param.type === "pictures") {
						for (var i = 0; i < param.value.length; i++) {
							_this._resources[i].filename = param.value[i];
						}
					}
				} else if (_this._type === _objectList.OBJECTS.LIVE_TAB) {
					if (param.type === "pictures") {

						// For now, create a whole new array of resources
						_this._resources.forEach(function (r) {
							r.destroy();
						});

						_this._resources = [];

						if (param.value) {
							var enumerableValue = param.value;
							if (!(param.value instanceof Array)) {
								enumerableValue = [param.value];
							}

							enumerableValue.forEach(function (filename) {
								var res = _this._resourceController.createResource(_this.id);
								_this._resources.push(res);
								res.filename = filename;
							});
						}

						/**
       * Resources Changed event. Fired internally whenever an object node has a new array of resources.
       * @event ResourceObjectMixin.resources_changed
       * @param {ObjectNode} object     This
       */
						_this.emit("resources_changed", _this);
					}
				}
			};

			_this._resources = [];
			_this._resourceController = new _resource.ResourceController();
			var resourceCount = 0;

			if (type === _objectList.OBJECTS.FPIC) {
				resourceCount = 1;
			} else if (type === _objectList.OBJECTS.LIVE_TEXT) {
				resourceCount = 2;
			}

			for (var i = 0; i < resourceCount; i++) {
				var resource = _this._resourceController.createResource(_this.id);
				_this._resources.push(resource);
			}
			return _this;
		}

		// Bound callbacks using fat arrow notation

		/**
   * Callback for handling resource related parameter events.
   * @private
   * @memberof ResourceObjectMixin
   * @param {ParamNode}
   */


		_createClass(_class2, [{
			key: "addParam",


			// End of bound callbacks

			/**
    * @ignore
    * @override
    * @memberof ResourceObjectMixin
    * @instance
    */
			value: function addParam(param) {
				_get(_class2.prototype.__proto__ || (0, _getPrototypeOf2.default)(_class2.prototype), "addParam", this).call(this, param);
				param.on("change", this._onParamChangeForResources);
			}

			/**
    * @memberof ResourceObjectMixin
    * @instance
    * @private
    * @return {Object} the ResourceController for this object's Resources
    */

		}, {
			key: "getResourceCount",


			/**
    * @memberof ResourceObjectMixin
    * @instance
    * @return {number} number of available resources
    */
			value: function getResourceCount() {
				return this._resources ? this._resources.length : 0;
			}

			/**
    * @param {number} idx - The resource index
    * @memberof ResourceObjectMixin
    * @instance
    * @throws throws an error if the resource index is out of bounds
    */

		}, {
			key: "getResourceAtIndex",
			value: function getResourceAtIndex(idx) {
				if (idx < 0 || idx >= this._resources.length) throw new Error("Invalid Resource Index. Object has " + this.getResourceCount() + " resources.");
				return this._resources[idx];
			}

			/**
    * @ignore
    * @override
    * @memberof ResourceObjectMixin
    * @instance
    */

		}, {
			key: "destroy",
			value: function destroy() {
				_get(_class2.prototype.__proto__ || (0, _getPrototypeOf2.default)(_class2.prototype), "destroy", this).call(this);
				this._resourceController.removeAllListeners();
				if (this._resources && this._resources.length) {
					this._resources.forEach(function (res) {
						res.destroy();
					});
				}
			}
		}, {
			key: "resourceController",
			get: function get() {
				return this._resourceController;
			}
		}]);

		return _class2;
	}(objClass);
};

module.exports = exports["default"];