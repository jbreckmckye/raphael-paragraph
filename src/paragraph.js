module.exports = paragraph;

// Dependencies
var extractWordsFromText = require('./extractWordsFromText.js');
var TextCanvas = require('./TextCanvas.js');
var fitWordsIntoSpace = require('./fitWordsIntoSpace.js');

function paragraph(x, y, text, width, lineHeight, fontSize) {
	var paper = this;
	var words = extractWordsFromText(text);
	var textCanvas = new TextCanvas(paper, x, y, lineHeight, fontSize);
	fitWordsIntoSpace(words, width, textCanvas)
}