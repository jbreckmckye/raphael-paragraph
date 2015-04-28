module.exports = breakWithHyphenOnNewLine;

var tryHyphenatedFormsUsingFormatter = require('./tryHyphenatedFormsUsingFormatter.js');

function breakWithHyphenOnNewLine(word, textCanvas, boundsTest) {
	var wordAddedSuccessfully = tryHyphenatedFormsUsingFormatter(word, textCanvas, boundsTest, addBreakThenHyphenatedWord);
	return wordAddedSuccessfully;

	function addBreakThenHyphenatedWord(form) {
		textCanvas.addLine();
		textCanvas.addTextToLine(form[0]);
		textCanvas.addTextToLine('-');
		textCanvas.addLine();
		textCanvas.addTextToLine(form[1]);
	}
}

breakWithHyphenOnNewLine.truncatesWord = true;