module.exports = paragraph;

// Dependencies
var extractWordsFromText = require('./extractWordsFromText.js');

function paragraph(x, y, text, width, height, lineHeight) {
	var paper = this;
	var words = extractWordsFromText(text);
}