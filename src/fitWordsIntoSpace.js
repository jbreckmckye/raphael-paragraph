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
	var defaultStrategy = addNewlineThenWord;

	var wordHasBeenFitted = false;
	var canvasState = textCanvas.getLineTexts();

	while (strategies.length && wordHasBeenFitted === false) {
		useNextStrategy();
		wordHasBeenFitted = testCanvasBounds();
		revertStateIfFailure();
	}
	if (strategies.length === 0 && wordHasBeenFitted === false) {
		// If we've run out of options
		defaultStrategy(textCanvas, word);
	}

	function useNextStrategy() {
		var strategyInUse = strategies.shift();
		strategyInUse(textCanvas, word);
	}

	function revertStateIfFailure() {
		if (wordHasBeenFitted === false) {
			textCanvas.createLines(canvasState);
		}
	}

	function testCanvasBounds() {
		var canvasBBox = textCanvas.getBBox();
		var canvasWidth = canvasBBox.x2 - canvasBBox.x;
		return (canvasWidth <= width);
	}
	
}


function addSpaceThenWord(textCanvas, word) {
	textCanvas.addTextToLine(' ' + word);
}

function addNewlineThenWord(textCanvas, word) {
	textCanvas.addLine();
	textCanvas.addTextToLine(word);
}





