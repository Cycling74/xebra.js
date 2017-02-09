export const OBJECTS = Object.freeze({
	BUTTON : "button",
	COMMENT : "comment",
	DIAL : "dial",
	FLONUM : "flonum",
	FPIC : "fpic",
	GAIN : "gain~",
	KSLIDER : "kslider",
	LIVE_BUTTON : "live.button",
	LIVE_DIAL : "live.dial",
	LIVE_GRID : "live.grid",
	LIVE_NUMBOX : "live.numbox",
	LIVE_SLIDER : "live.slider",
	LIVE_TAB : "live.tab",
	LIVE_TEXT : "live.text",
	LIVE_TOGGLE : "live.toggle",
	MESSAGE : "message",
	METER : "meter~",
	MIRA_CHANNEL : "mira.channel",
	MIRA_FRAME : "mira.frame",
	MIRA_MOTION : "mira.motion",
	MIRA_MULTITOUCH : "mira.multitouch",
	MULTISLIDER : "multislider",
	NUMBER : "number",
	PATCHER : "jpatcher",
	PATCHERVIEW : "patcherview",
	PANEL : "panel",
	RSLIDER : "rslider",
	SLIDER : "slider",
	SWATCH : "swatch",
	TOGGLE : "toggle",
	UMENU : "umenu"
});

export const MANDATORY_OBJECTS = Object.freeze({
	[OBJECTS.PATCHER] : [
		"editing_bgcolor",
		"locked_bgcolor"
	],
	[OBJECTS.PATCHERVIEW] : [
		"name",
		"presentation",
		"locked"
	],
	[OBJECTS.MIRA_CHANNEL] : [
		"name"
	],
	[OBJECTS.MIRA_FRAME] : [
		"color",
		"patching_rect",
		"presentation_rect",
		"presentation",
		"tabname",
		"taborder"
	],
	[OBJECTS.MIRA_MOTION] : []
});

export const DEFAULT_PARAMS = ["patching_rect", "presentation_rect", "zorder", "presentation", "hidden", "ignoreclick", "varname"];

export const OBJECT_PARAMETERS = Object.freeze({

	// Standard Objects
	[OBJECTS.BUTTON] : DEFAULT_PARAMS.concat([
		"bgcolor",
		"blinkcolor",
		"outlinecolor",
		"value"
	]),
	[OBJECTS.COMMENT] : DEFAULT_PARAMS.concat([
		"textfield",
		"fontsize",
		"textjustification",
		"fontname",
		"fontface",
		"bgcolor",
		"textcolor",
		"bubble",
		"bubblepoint",
		"bubbleside",
		"bubbletextmargin"
	]),
	[OBJECTS.DIAL] : DEFAULT_PARAMS.concat([
		"distance",
		"floatoutput",
		"mode",
		"size",
		"min",
		"mult",
		"degrees",
		"thickness",
		"bgcolor",
		"needlecolor",
		"outlinecolor"
	]),
	[OBJECTS.FLONUM] : DEFAULT_PARAMS.concat([
		"value",
		"fontsize",
		"fontname",
		"fontface",
		"bgcolor",
		"textcolor",
		"tricolor",
		"triscale",
		"numdecimalplaces",
		"htricolor"
	]),
	[OBJECTS.FPIC] : DEFAULT_PARAMS.concat([
		"alpha",
		"destrect",
		"autofit",
		"xoffset",
		"yoffset",
		"pic"
	]),
	[OBJECTS.GAIN] : DEFAULT_PARAMS.concat([
		"value",
		"size",
		"orientation",
		"bgcolor",
		"stripecolor",
		"knobcolor",
		"distance"
	]),
	[OBJECTS.KSLIDER] : DEFAULT_PARAMS.concat([
		"value",
		"blackkeycolor",
		"hkeycolor",
		"mode",
		"offset",
		"range",
		"selectioncolor",
		"whitekeycolor",
		"rawsend"
	]),
	[OBJECTS.LIVE_BUTTON] : DEFAULT_PARAMS.concat([
		"active",
		"bgcolor",
		"bgoncolor",
		"activebgcolor",
		"activebgoncolor",
		"bordercolor",
		"focusbordercolor",
		"value"
	]),
	[OBJECTS.LIVE_DIAL] : DEFAULT_PARAMS.concat([
		"fontname",
		"fontsize",
		"fontface",
		"active",
		"activedialcolor",
		"activeneedlecolor",
		"appearance",
		"bordercolor",
		"dialcolor",
		"focusbordercolor",
		"needlecolor",
		"panelcolor",
		"showname",
		"shownumber",
		"textcolor",
		"triangle",
		"tribordercolor",
		"tricolor",
		"distance",
		"_parameter_shortname",
		"_parameter_unitstyle",
		"_parameter_range",
		"_parameter_exponent",
		"value"
	]),
	[OBJECTS.LIVE_GRID] : DEFAULT_PARAMS.concat([
		"amountcolor",
		"bgstepcolor",
		"bgstepcolor2",
		"bordercolor",
		"bordercolor2",
		"columns",
		"direction",
		"direction_height",
		"directioncolor",
		"displayamount",
		"freezecolor",
		"hbgcolor",
		"link",
		"marker_horizontal",
		"marker_vertical",
		"matrixmode",
		"mode",
		"rounded",
		"rows",
		"spacing",
		"stepcolor",
		"distance",
		"touchy",
		"directions",
		"setcell",
		"currentstep",
		"constraint"
	]),
	[OBJECTS.LIVE_NUMBOX] : DEFAULT_PARAMS.concat([
		"activebgcolor",
		"active",
		"activeslidercolor",
		"activetricolor",
		"activetricolor2",
		"appearance",
		"bordercolor",
		"focusbordercolor",
		"textcolor",
		"tricolor",
		"tricolor2",
		"value",
		"fontname",
		"fontface",
		"fontsize",
		"_parameter_range",
		"_parameter_unitstyle",
		"_parameter_exponent"
	]),
	[OBJECTS.LIVE_SLIDER] : DEFAULT_PARAMS.concat([
		"fontname",
		"fontsize",
		"fontface",
		"orientation",
		"showname",
		"shownumber",
		"slidercolor",
		"textcolor",
		"tribordercolor",
		"trioncolor",
		"tricolor",
		"_parameter_range",
		"_parameter_shortname",
		"_parameter_unitstyle",
		"_parameter_exponent",
		"value",
		"distance"
	]),
	[OBJECTS.LIVE_TAB] : DEFAULT_PARAMS.concat([
		"active",
		"activebgcolor",
		"activebgoncolor",
		"bgcolor",
		"bgoncolor",
		"blinktime",
		"bordercolor",
		"button",
		"focusbordercolor",
		"mode",
		"multiline",
		"num_lines_patching",
		"num_lines_presentation",
		"pictures",
		"rounded",
		"spacing_x",
		"spacing_y",
		"textcolor",
		"textoncolor",
		"fontname",
		"fontsize",
		"fontface",
		"_parameter_range",
		"value",
		"usepicture"
	]),
	[OBJECTS.LIVE_TEXT] : DEFAULT_PARAMS.concat([
		"activebgcolor",
		"active",
		"bgcolor",
		"activebgoncolor",
		"bgoncolor",
		"bordercolor",
		"textcolor",
		"activetextoncolor",
		"activetextcolor",
		"text",
		"texton",
		"value",
		"fontsize",
		"fontname",
		"fontface",
		"pictures",
		"usepicture"
	]),
	[OBJECTS.LIVE_TOGGLE] : DEFAULT_PARAMS.concat([
		"bgcolor",
		"activebgcolor",
		"bgoncolor",
		"activebgoncolor",
		"bordercolor",
		"focusbordercolor",
		"value",
		"rounded",
		"active"
	]),
	[OBJECTS.MESSAGE] : DEFAULT_PARAMS.concat([
		"textfield",
		"fontsize",
		"textjustification",
		"fontname",
		"fontface",
		"bgcolor",
		"bgfillcolor_color",
		"bgfillcolor_type",
		"bgfillcolor_pt1",
		"bgfillcolor_pt2",
		"bgfillcolor_color1",
		"bgfillcolor_color2",
		"bgfillcolor_color",
		"bgfillcolor_proportion",
		"bgfillcolor_angle",
		"textcolor",
		"value"
	]),
	[OBJECTS.METER] : DEFAULT_PARAMS.concat([
		"bgcolor",
		"offcolor",
		"ntepidleds",
		"nwarmleds",
		"nhotleds",
		"numleds",
		"dbperled",
		"coldcolor",
		"tepidcolor",
		"warmcolor",
		"hotcolor",
		"overloadcolor",
		"level"
	]),
	[OBJECTS.MIRA_MULTITOUCH] : DEFAULT_PARAMS.concat([
		"color",
		"hsegments",
		"vsegments",
		"region",
		"pinch",
		"pinch_enabled",
		"rotate",
		"rotate_enabled",
		"tap",
		"tap_enabled",
		"tap_touch_count",
		"tap_tap_count",
		"swipe",
		"swipe_enabled",
		"swipe_touch_count",
		"remote_gestures",
		"remote_circles",
		"moved_touch",
		"up_down_cancelled_touch"
	]),
	[OBJECTS.MULTISLIDER] : DEFAULT_PARAMS.concat([
		"distance",
		"ghostbar",
		"setstyle",
		"candycane",
		"size",
		"setminmax",
		"orientation",
		"thickness",
		"bgcolor",
		"slidercolor",
		"candicane2",
		"candicane3",
		"candicane4",
		"candicane5",
		"candicane6",
		"candicane7",
		"candicane8",
		"peakcolor",
		"drawpeaks",
		"signed",
		"spacing"
	]),
	[OBJECTS.NUMBER] : DEFAULT_PARAMS.concat([
		"value",
		"fontsize",
		"fontname",
		"fontface",
		"bgcolor",
		"textcolor",
		"tricolor",
		"triscale",
		"numdecimalplaces",
		"htricolor"
	]),
	[OBJECTS.PANEL] : DEFAULT_PARAMS.concat([
		"bgcolor",
		"bgfillcolor_color",
		"bgfillcolor_type",
		"bgfillcolor_pt1",
		"bgfillcolor_pt2",
		"bgfillcolor_color1",
		"bgfillcolor_color2",
		"bgfillcolor_color",
		"bgfillcolor_proportion",
		"bgfillcolor_angle",
		"bordercolor",
		"border",
		"rounded",
		"shape",
		"horizontal_direction",
		"vertical_direction",
		"arrow_orientation"
	]),
	[OBJECTS.RSLIDER] : DEFAULT_PARAMS.concat([
		"distance",
		"size",
		"min",
		"mult",
		"orientation",
		"drawline",
		"bgcolor",
		"bordercolor",
		"fgcolor"
	]),
	[OBJECTS.SLIDER] : DEFAULT_PARAMS.concat([
		"bgcolor",
		"distance",
		"elementcolor",
		"floatoutput",
		"knobcolor",
		"knobshape",
		"min",
		"mult",
		"orientation",
		"size",
		"thickness"
	]),
	[OBJECTS.SWATCH] : DEFAULT_PARAMS.concat([
		"distance",
		"value",
		"compatibility",
		"saturation"
	]),
	[OBJECTS.TOGGLE] : DEFAULT_PARAMS.concat([
		"bgcolor",
		"checkedcolor",
		"uncheckedcolor",
		"thickness",
		"value"
	]),
	[OBJECTS.UMENU] : DEFAULT_PARAMS.concat([
		"arrow",
		"applycolors",
		"bgcolor",
		"bgfillcolor_type",
		"bgfillcolor_color1",
		"bgfillcolor_color2",
		"bgfillcolor_pt1",
		"bgfillcolor_pt2",
		"bgfillcolor_color",
		"bgfillcolor_proportion",
		"bgfillcolor_angle",
		"color",
		"elementcolor",
		"fontname",
		"fontsize",
		"fontface",
		"items",
		"menumode",
		"textcolor",
		"textjustification",
		"truncate",
		"underline",
		"value"
	])
});

export const OPTIONAL_OBJECT_PARAMETERS = Object.freeze({
	[OBJECTS.LIVE_TAB] : ["pictures"]
});
