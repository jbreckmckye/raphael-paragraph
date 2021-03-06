module.exports = paragraph;

// Dependencies
var ParagraphConfiguration = require('./ParagraphConfiguration.js');
var extractWordsFromText = require('./extractWordsFromText.js');
var UndoableTextCanvas = require('./UndoableTextCanvas.js');
var fitWordsIntoSpace = require('./fitWordsIntoSpace.js');
var util = require('./util.js');
var linesFitBounds = require('./linesFitBounds');

function paragraph(setOptions) {
	var paper = this;
	var config = new ParagraphConfiguration(setOptions, paper);
	var words = extractWordsFromText(config.text);
	var undoableTextCanvas = new UndoableTextCanvas(paper, config.x, config.y, config.lineHeight, config.textStyle);
	var boundsTest = util.curry(linesFitBounds, config.x, config.y, undoableTextCanvas, config.maxWidth, config.maxHeight);
	fitWordsIntoSpace(words, config.maxWidth, config.maxHeight, undoableTextCanvas, boundsTest, config.hyphenationEnabled);
	return undoableTextCanvas.getElements();
}