module.exports = addSpaceThenWord;

function addSpaceThenWord(word, textCanvas) {
	textCanvas.addTextToLine(' ' + word);
}