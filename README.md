Xebra
=============

Xebra connects Max to the browser, and the browser to Max.

Adding a mira.frame object to a Max patcher creates an open websocket that exposes the contents of the Max patcher. Xebra connects to that socket and maps changes in the Max patcher to JavaScript events.

## Setup

Getting started with Xebra is quite simple. Just grab one of the pre-built versions from here:

* Minified Version
* Unminified Version

// TODO: add download PermaLinks

Alternatively you can install Xebra using npm

	npm install xebra

## Basic Usage Example

From a web browser, start a websocket connection to Max by creating a new Xebra.State object.

```
var xebraState = new Xebra.State({
	hostname: "127.0.0.1",
	port: 8086,
	supported_objects: Xebra.SUPPORTED_OBJECTS
});
xebraState.connect();
```

The value of `hostname` can be something other than `127.0.0.1`, provided the browser can open a websocket connection to that IP address. The port should always be 8086, unless Max displays a different port number in the console after creating a mira.frame object. The `supported_objects` property specifies which objects Xebra should listen to. The `Xebra` namespace value `SUPPORTED_OBJECTS` contains all of the objects currently supported by Xebra.

After connecting, Xebra will fire `object_added`, `object_changed` and `object_removed` events as objects are added, changed and removed. To print an object, whenever it is added or removed, you could write something like:

```
xebraState.on("object_added", function(object) {
	console.log("Added new object", object);
});

xebraState.on("object_removed", function(object) {
	console.log("Removed an object", object);
});
```

`object_changed` events include a `param` argument, which specifies the changed parameter and gives you access to its value.

```
xebraState.on("object_changed", function(object, param) {
	console.log("Parameter", param.type, "changed to", param.value, "for object", object);
});
```

As well as receiving parameter update events, it is also possible to update the state of objects in Max. To set the current value of a slider object, for example:

```
var sliderObj;
sliderObj.setParamValue("distance", 72);
```
will set the value of the `slider` object associated with `sliderObj` to `72`.

For more examples, tutorials etc please check the examples folder and the tutorials in the documentation.
// TODO: make PermaLink to these actually

## Contribute

You like the Xebra project and would like to contribute? Perfect! Please use the GitHub issue tracker in case you experience any bugs or get in touch for your feature requests or potential features you'd like to add. Please make sure to read our Contributing Guide before submitting any changes.
// TODO: PermaLink to guide here

## How To Build

Note that most users won't need to do this and should rather use the pre-built versions or make use of xebra as a npm dependecy. However if you are developing xebra you might need to build.

Xebra is written in ES6. Based on that the build process can either mean generating the ES5 versions to the `lib` folder or generating the bundled `xebra.js` and `xebra.min.js`files in the `dist` folder.

To do the former simply run a

	npm run lib

To generate the bundled versions please run

	npm run build

## Generate the Documentation

The documentation for this module is written and build using JSDoc style syntax and helpers.

If you would like to rebuild the documentation please run

	npm run docs

Otherwise you can find the current docs conveniently hosted here:
// TODO add doc PermaLink

## License

TODO: Add PermaLink to LICENSE file here once we have a persistent URL on GitHub
