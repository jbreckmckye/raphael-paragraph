module.exports = paragraph;

// Dependencies
var extractWordsFromText = require('./extractWordsFromText.js');
//var TextCanvas = require('./TextCanvas.js');

function paragraph(x, y, text, width, height, lineHeight) {
	var paper = this;
	var words = extractWordsFromText(text);
	//var textCanvas = new TextCanvas(paper, x, y, width, height);
	//addWordsToTextCanvasWithoutBreakingBounds(words, textCanvas);
}

// var wordAdditionStrategies = {
// 	firstWord : [justAddWord],
// 	nthWord : [addSpaceThenWord, addLineBreakThenWord]
// };

// function addWordsToTextCanvasWithoutBreakingBounds(words, textCanvas) {
// 	var remainingWords = words.slice();

// 	while (thereAreStillWords() && thereIsStillSpace()) {
// 		addWordUsingFirstWorkingStrategy();
// 		remainingWords.shift();
// 	}
// }