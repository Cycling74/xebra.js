## Sending Arbitrary Messages

It's not currently possible to send arbitrary messages to Max. However, you can accomplish something like sending arbitrary messages by using a message object. Suppose, for example, that you have a Max patcher with a message box and a print object in it, with the message box connected to the print object. Suppose as well that the message box has the varname output. Also, make sure there's a mira.frame object in the patcher, so that the patcher is exposed to xebra.js.

In this case, you could use code like the following to print an arbitrary message in Max:

```
var xebraState; // connected to Max
var patcher = xebraState.getPatchers()[0]; // get the first patcher
var printObj = patcher.getObjectByScriptingName("output");
printObj.setParamValue("textfield", "Hello from the internet");
printObj.setParamValue("value", 1);
```
