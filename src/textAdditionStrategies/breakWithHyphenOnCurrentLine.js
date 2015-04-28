module.exports = breakWithHyphenOnCurrentLine;

var tryHyphenatedFormsUsingFormatter = require('./tryHyphenatedFormsUsingFormatter.js');

function breakWithHyphenOnCurrentLine(word, textCanvas, boundsTest) {
	var wordAddedSuccessfully = tryHyphenatedFormsUsingFormatter(word, textCanvas, boundsTest, addBreakThenHyphenatedWord);
	return wordAddedSuccessfully;

	function addBreakThenHyphenatedWord(form) {
		textCanvas.addTextToLine(' ');
		textCanvas.addTextToLine(form[0]);
		textCanvas.addTextToLine('-');
		textCanvas.addLine();
		textCanvas.addTextToLine(form[1]);
	}
}

breakWithHyphenOnCurrentLine.truncatesWord = true;