module.exports = paragraph;

// Dependencies
var extractWordsFromText = require('./extractWordsFromText.js');
var TextCanvas = require('./TextCanvas.js');

function paragraph(x, y, text, width, height, lineHeight) {
	var paper = this;
	var words = extractWordsFromText(text);
}