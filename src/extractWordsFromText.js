module.exports = extractWordsFromText;

function extractWordsFromText(paragraphText) {
	var whitespaceOrLineBreak = new RegExp('[\r?\n\s]');
	return paragraphText.split(whitespaceOrLineBreak);
}