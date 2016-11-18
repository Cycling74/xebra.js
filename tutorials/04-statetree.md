## Enumerating Objects

After objects have been created, you can iterate over the objects currently in Xebra.State by iterating through the children of each patcher. This code snippet will print out the entire state currently contained in Xebra.State.

```
var patchers = xebraState.getPatchers();
patchers.forEach( function(patcher) {
	console.log("Patcher", patcher.name);
	var objects = patchers.getObjects();
	objects.forEach( function(object) {
		console.log("\tObject", object.id, object.type);
		var paramTypes = object.getParamTypes();
		paramTypes.forEach( function(paramType) {
			console.log("\t\t", paramType, ":", object.getParamValue(paramType));
		});
	});
	console.log("\n");
});
```