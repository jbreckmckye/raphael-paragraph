module.exports = extractWordsFromText;

function extractWordsFromText(paragraphText) {
	var words = paragraphText.match(/\S+/g);
	if (words === null) {
		return [];
	} else {
		return words;
	}
}