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
exports.ResourceController = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; (0, _defineProperty2.default)(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = (0, _getOwnPropertyDescriptor2.default)(object, property); if (desc === undefined) { var parent = (0, _getPrototypeOf2.default)(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _events = require("events");

var _path = require("path");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass; }

var XEBRA_RESOURCE_ID = 0;

/**
 * @desc Represents some data that the remote Max instance has access to. The intended use is to support Max objects
 * like fpic and live.tab, which may want to display images. Can also be used to fetch data from files in Max's search path.
 * Setting `filename` (or setting `dimensions` in the case of .svg files) will query Max for that data in Max's search path.
 * Listen for the {@link Resource.event:data_received} event to receive the data as a data URI string.
 * Only images are currently supported.
 * @class
 * @extends EventEmitter
 * @example
 * // To use a resource without an ObjectNode, first create the resource.
 * const xebraState; // Instance of Xebra.State
 * const resource = xebraState.createResource();
 *
 * // The resource doesn't hold on to data from Max once it receives it, so be sure to listen for {@link Resource.event:data_received}
 * // events in order to handle resource data.
 * resource.on("data_received", (filename, data_uri) => {
 * // Do something with the data
 * });
 *
 * // Setting the filename property will cause the Resource object to fetch the data from Max. filename should be the
 * // name of a file in Max's search path. If Max is able to load the file successfully, it will send the data back
 * // to the Resource object, which will fire a {@link Resource.event:data_received} event with the data and filename.
 * resource.filename = "alex.png";
 *
 * // If the requested file is an .svg file, then Max will render the file before sending the data back to the Resource
 * // object. In this case, the dimensions property of the resource must be set as well as filename.
 * resource.filename = "maxelement.svg";
 * resource.dimensions = {width: 100, height: 50};
 */

var Resource = function (_EventEmitter) {
	_inherits(Resource, _EventEmitter);

	/**
  * @constructor
  * @param  {Xebra.NodeId} [0] parentObjectId - The id of the ObjectNode that owns this resource
  */
	function Resource() {
		var parentObjectId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

		_classCallCheck(this, Resource);

		var _this = _possibleConstructorReturn(this, (Resource.__proto__ || (0, _getPrototypeOf2.default)(Resource)).call(this));

		_this._id = ++XEBRA_RESOURCE_ID;
		_this._width = 1;
		_this._height = 1;
		_this._objectContext = parentObjectId;
		return _this;
	}

	/**
  * Unique identifier associated with each resource.
  * @readonly
  * @type {Xebra.NodeId}
  */


	_createClass(Resource, [{
		key: "on",


		/**
   * @private
   */
		value: function on(event, fn) {
			_get(Resource.prototype.__proto__ || (0, _getPrototypeOf2.default)(Resource.prototype), "on", this).call(this, event, fn);
			if (event === "data_received") this._doFetch();
		}

		/**
   * Be sure to call this when the Resource is no longer needed.
   */

	}, {
		key: "destroy",
		value: function destroy() {
			this.removeAllListeners();
		}

		/**
   * Fetch the resource data
   * @private
   */

	}, {
		key: "_doFetch",
		value: function _doFetch() {
			this.emit("needs_data", this);
		}

		/**
   * Handle incoming resource data
   * @private
   * @param {object} data - The resource data
   */

	}, {
		key: "handleData",
		value: function handleData(data) {
			var filetype = (0, _path.extname)(data.request.name);
			if (filetype.length && filetype[0] === ".") filetype = filetype.substr(1);

			if (filetype === "svg") filetype = "png"; // Max will convert rendered svg surfaces to png for us
			var data_uri_string = "data:image/" + filetype + ";base64," + data.data;

			/**
    * @event Resource.data_received
    * @param {string} name - name of the resource
    * @param {string} datauri - data-uri representation of the resource
    */
			this.emit("data_received", data.request.name, data_uri_string);
		}
	}, {
		key: "id",
		get: function get() {
			return this._id;
		}

		/**
   * Name of a file in Max's search path. Setting this will query Max for data from the corresponding file. Listen to
   * the {@link Resource.event:data_received} event for the data in the form of a data-uri string.
   * @type {string}
   */

	}, {
		key: "filename",
		get: function get() {
			return this._filename;
		},
		set: function set(fn) {
			this._filename = fn;
			this._doFetch();
		}

		/**
   * Id of the ObjectNode that owns the resource. If the resource is not bound to an ObjectNode, returns null.
   * Max can use the object id to augment the search path with the parent patcher of the object, if the
   * object id is supplied
   * @type {Xebra.NodeId}
   */

	}, {
		key: "objectContext",
		get: function get() {
			return this._objectContext;
		}

		/**
   * Whether the resource is a SVG image or not
   * @readonly
   * @type {boolean}
   */

	}, {
		key: "isSVG",
		get: function get() {
			return this._filename ? (0, _path.extname)(this._filename) === ".svg" : false;
		}

		/**
   * @typedef {object} ResourceDimensions
   * @property {number} height The height
   * @property {number} width The width
   */

		/**
   * Dimensions of the resource. These are <strong>not</strong> updated automatically, and <strong>cannot</strong> be
   * used to determine the dimensions of a raster image in Max's filepath. Instead, use the data URI returned with the
   * {@link Resource.event:data_received} event to determine size. Setting these dimensions will trigger a new data
   * fetch, if the resource is an .svg image. Max will be used to render the image and a .png data-uri will be returned.
   * @type {ResourceDimensions}
   */

	}, {
		key: "dimensions",
		get: function get() {
			return {
				width: this._width,
				height: this._height
			};
		},
		set: function set(dim) {
			if (this._width !== dim.width || this._height !== dim.height) {
				this._width = dim.width;
				this._height = dim.height;
				if (this.isSVG) this._doFetch();
			}
		}
	}]);

	return Resource;
}(_events.EventEmitter);

exports.default = Resource;

var ResourceController = function (_EventEmitter2) {
	_inherits(ResourceController, _EventEmitter2);

	function ResourceController() {
		_classCallCheck(this, ResourceController);

		var _this2 = _possibleConstructorReturn(this, (ResourceController.__proto__ || (0, _getPrototypeOf2.default)(ResourceController)).call(this));

		_this2._fetchResourceData = function (resource) {
			_this2.emit("get_resource_info", resource);
		};

		return _this2;
	}

	_createClass(ResourceController, [{
		key: "createResource",
		value: function createResource() {
			var parentObjectId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			var resource = new Resource(parentObjectId);
			resource.on("needs_data", this._fetchResourceData);
			return resource;
		}
	}]);

	return ResourceController;
}(_events.EventEmitter);

exports.ResourceController = ResourceController;