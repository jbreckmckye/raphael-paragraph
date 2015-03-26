module.exports = extractWordsFromText;

function extractWordsFromText(paragraphText) {
	var whitespaceOrLineBreak = new RegExp('\s');
	return paragraphText.split(whitespaceOrLineBreak);
}