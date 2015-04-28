module.exports = paragraph;

// Dependencies
var extractWordsFromText = require('./extractWordsFromText.js');
var UndoableTextCanvas = require('./UndoableTextCanvas.js');
var fitWordsIntoSpace = require('./fitWordsIntoSpace.js');
var util = require('./util.js');
var lastLineFitsBounds = require('./lastLineFitsBounds');

function paragraph(options) {
	var paper = this;
	defaultOptions(options, paper);
	var words = extractWordsFromText(options.text);
	var undoableTextCanvas = new UndoableTextCanvas(paper, options.x, options.y, options.lineHeight, options.textStyle);
	var boundsTest = util.curry(lastLineFitsBounds, options.x, options.y, undoableTextCanvas, options.maxWidth, options.maxHeight);
	// var boundsTest = function() {
	// 	return lastLineFitsBounds(options.x, options.y, undoableTextCanvas, options.maxWidth, options.maxHeight);
	// };
	fitWordsIntoSpace(words, options.maxWidth, options.maxHeight, undoableTextCanvas, boundsTest);
	return undoableTextCanvas.getElements();
}

function defaultOptions(options, paper) {
	var defaultTextStyle = {
		'font-size' : 13,
		'text-anchor' : 'start'
	};

	options.text = defaultUndefined(options.text, 'Hello, world');
	options.x = defaultUndefined(options.x, 0);
	options.y = defaultUndefined(options.y, 0);
	options.maxWidth = defaultUndefined(options.maxWidth, paper.width);
	options.maxHeight = defaultUndefined(options.maxHeight, paper.height);
	options.textStyle = mergeObjects(options.textStyle, defaultTextStyle);
	options.lineHeight = defaultUndefined(options.lineHeight, options.textStyle['font-size']);
}

function defaultUndefined(optionalValue, defaultValue) {
	if (optionalValue === undefined) {
		return defaultValue;
	} else {
		return optionalValue;
	}
}

function mergeObjects(obj1, obj2) {
	for (field in obj2) {
		if (obj2.hasOwnProperty(field)) {
			obj1[field] = obj2[field];
		}
	};
	return obj1;
}