module.exports = addBreakThenWord;

function addBreakThenWord(word, textCanvas) {
	textCanvas.addLine();
	textCanvas.addTextToLine(word);
}