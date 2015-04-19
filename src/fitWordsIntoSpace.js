module.exports = fitWordsIntoSpace;

var util = require('./util.js');

function fitWordsIntoSpace(words, width, textCanvas) {
	addFirstWord();
	addNthWordsUsingStrategies();

	function addFirstWord() {
		textCanvas.addLine();
		textCanvas.addTextToLine(words[0]);
	}

	function addNthWordsUsingStrategies() {
		words.shift();
		util.arrayForEach(words, function(word){
			addWordToCanvasUsingFirstFittingStrategy(word, textCanvas, width);
		});
	}

}

function addWordToCanvasUsingFirstFittingStrategy(word, textCanvas, width) {
	var strategies = [addSpaceThenWord, addNewlineThenWord];
	var defaultStrategy = addSpaceThenWord;

	var wordHasBeenFitted = false;
	var canvasState = textCanvas.getLineTexts();

	while (strategies.length && wordHasBeenFitted === false) {
		useNextStrategy();
		wordHasBeenFitted = testCanvasBounds();
		revertStateIfFailure();
	}
	if (strategies.length === 0 && wordHasBeenFitted === false) {
		// If we've run out of options
		defaultStrategy();
	}

	function useNextStategy() {
		var strategyInUse = strategies.shift();
		strategyInUse(textCanvas, word);
	}

	function revertStateIfFailure() {
		if (wordHasBeenFitted === false) {
			textCanvas.createLines(canvasState);
		}
	}
	
}


function addSpaceThenWord(textCanvas, word) {
	textCanvas.addTextToLine(' ' + word);
}

function addNewlineThenWord(textCanvas, word) {
	textCanvas.addLine();
	textCanvas.addTextToLine(word);
}





