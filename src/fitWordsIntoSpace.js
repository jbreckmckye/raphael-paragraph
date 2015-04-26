module.exports = fitWordsIntoSpace;

var util = require('./util.js');

// Text addition strategies
var addWord = require('./textAdditionStrategies/addWord.js');
var addSpaceThenWord = require('./textAdditionStrategies/addSpaceThenWord.js');
var addBreakThenWord = require('./textAdditionStrategies/addBreakThenWord.js');

// function fitWordsIntoSpace(words, maxWidth, maxHeight, textCanvas) {
// 	var spaceLimitReached = false;

// 	util.arrayForEach(words, function(word, wordIndex){
// 		var isFirstWord = wordIndex === 0;
// 		if (isFirstWord) {
// 			addFirstWord(word);
// 		} else {
// 			addNthWord(word);
// 		}
// 	});

// 	function addFirstWord(word) {
// 		var initialCanvas = textCanvas.getLineText();
// 		var lineEndCoordinates = {};

// 		addWord();
// 		lineEndCoordinates = textCanvas.getLastLineEnd();
// 		if (lineEndCoordinates.y > maxHeight) {
// 			undo();
// 		} else if (lineEndCoordinates.x > maxWidth) {
// 			undo();

// 		}

// 		function undo() {
// 			textCanvas.createLines(initialCanvas);
// 		}

// 	}
// }


function fitWordsIntoSpace(words, maxWidth, maxHeight, undoableTextCanvas, boundsTest) {
	
	var previousWordsDidNotFit = false;

	util.arrayForEach(words, function(word, wordIndex, words){
		if (previousWordsDidNotFit === false) {
			var wordAddedSuccessfully = addWordUsingStrategies(word, wordIndex, words);
			previousWordsDidNotFit = !wordAddedSuccessfully;
			undoableTextCanvas.createUndoPoint();
		}
	});

	function addWordUsingStrategies(word, wordIndex, words) {
		var addedWords = words.slice(0, wordIndex - 1);
		var wordStrategies = [];
		var fallbackWordStrategy;

		var isFirstWord = (wordIndex === 0);
		if (isFirstWord) {
			wordStrategies = [addWord, addTruncatedWord];
			fallbackWordStrategy = addWord;
		} else {
			wordStrategies = [addSpaceThenWord, addBreakThenWord, truncatePreviousWordsAndAddEllipsis];
			fallbackWordStrategy = addBreakThenWord;
		}

		var spaceLimitReached = tryWordStrategies(wordStrategies, fallbackWordStrategy, word, addedWords, boundsTest, undoableTextCanvas);
		return spaceLimitReached;
	}

}


function tryWordStrategies(strategies, fallbackWordStrategy, word, addedWords, boundsTest, undoableTextCanvas) {
	var wordAddedSuccessfully = false;

	util.arrayForEach(strategies, function(strategy){
		if (wordAddedSuccessfully === false) {			
			wordAddedSuccessfully = strategy(word, undoableTextCanvas, boundsTest, addedWords);
			testBoundsIfStrategyDoesNotTestItself();
			undoStrategyIfUnsuccessful();
		}
	});

	if (wordAddedSuccessfully === false) {
		fallbackWordStrategy(word, undoableTextCanvas, boundsTest, addedWords);
	}

	function testBoundsIfStrategyDoesNotTestItself() {
		if (wordAddedSuccessfully === undefined) {
			wordAddedSuccessfully = boundsTest();
		}
	}

	function undoStrategyIfUnsuccessful() {
		if (wordAddedSuccessfully === false) {
			undoableTextCanvas.undo();
		}
	}

	return wordAddedSuccessfully;
}

function addTruncatedWord(word, textCanvas, boundsTest) {
	var getTruncatedFormsLongestFirst = require('./getTruncatedFormsLongestFirst');
	var wordAddedSuccessfully = false;

	var characters = word.split('');
	var formsToTryLongestFirst = getTruncatedFormsLongestFirst(characters);

	util.arrayForEach(formsToTryLongestFirst, function(form){
		if (wordAddedSuccessfully === false) {
			tryForm(form);
			wordAddedSuccessfully = boundsTest();
			undoFormIfUnsuccessful();
		}
	});

	return wordAddedSuccessfully;

	function tryForm(form) {
		textCanvas.addTextToLine(form);
	}

	function undoFormIfUnsuccessful() {
		if (wordAddedSuccessfully === false) {
			textCanvas.undo();
		}
	}
}

function addSpaceAndTruncatedWord(word, textCanvas, boundsTest) {
	textCanvas.addTextToLine(' ');
	var wordAddedSuccessfully = addTruncatedWord(word, textCanvas, boundsTest);
	return wordAddedSuccessfully;
}

function truncatePreviousWordsAndAddEllipsis(word, textCanvas, boundsTest, addedWords) {
	var wordAddedSuccessfully;
	var previousWord = addedWords.pop();
	
	if (previousWord === undefined) {
		wordAddedSuccessfully = false;
	} else {
		textCanvas.undo();
		wordAddedSuccessfully = addSpaceAndTruncatedWord(previousWord, textCanvas, boundsTest);
		if (wordAddedSuccessfully === false) {
			wordAddedSuccessfully = truncatePreviousWordsAndAddEllipsis(word, textCanvas, boundsText, addedWords);
		}
	}

	return wordAddedSuccessfully;
}


// var firstWordStrategies = {
// 	attempt : addWord,
// 	failY : giveUp,
// 	failX : {
// 		attempt : addTruncatedWord,
// 		fail : giveUp
// 	}
// };

// var nthWordStrategies = {
// 	use : addSpaceThenWord,
// 	failY : giveUp,
// 	failX : {
// 		attempt : addBreakThenWord,
// 		failX : {

// 		}
// 		failY : {
// 			attempt : addTruncatedWord,
// 			failX : {
// 				attempt: truncateLastWord
// 			},
// 			failY : giveUp
// 		}

// 	}
// };


// function fitWordsIntoSpace(words, width, textCanvas) {
// 	addFirstWord();
// 	addNthWordsUsingStrategies();

// 	function addFirstWord() {
// 		textCanvas.addLine();
// 		textCanvas.addTextToLine(words[0]);
// 	}

// 	function addNthWordsUsingStrategies() {
// 		words.shift();
// 		util.arrayForEach(words, function(word){
// 			addWordToCanvasUsingFirstFittingStrategy(word, textCanvas, width);
// 		});
// 	}

// }

// function addWordToCanvasUsingFirstFittingStrategy(word, textCanvas, width) {
// 	var strategies = [addSpaceThenWord, addNewlineThenWord];
// 	var defaultStrategy = addNewlineThenWord;

// 	var wordHasBeenFitted = false;
// 	var canvasState = textCanvas.getLineTexts();

// 	while (strategies.length && wordHasBeenFitted === false) {
// 		useNextStrategy();
// 		wordHasBeenFitted = testCanvasBounds();
// 		revertStateIfFailure();
// 	}
// 	if (strategies.length === 0 && wordHasBeenFitted === false) {
// 		// If we've run out of options
// 		defaultStrategy(textCanvas, word);
// 	}

// 	function useNextStrategy() {
// 		var strategyInUse = strategies.shift();
// 		strategyInUse(textCanvas, word);
// 	}

// 	function revertStateIfFailure() {
// 		if (wordHasBeenFitted === false) {
// 			textCanvas.createLines(canvasState);
// 		}
// 	}

// 	function testCanvasBounds() {
// 		var canvasBBox = textCanvas.getBBox();
// 		var canvasWidth = canvasBBox.x2 - canvasBBox.x;
// 		return (canvasWidth <= width);
// 	}
	
// }


// function addSpaceThenWord(textCanvas, word) {
// 	textCanvas.addTextToLine(' ' + word);
// }

// function addNewlineThenWord(textCanvas, word) {
// 	textCanvas.addLine();
// 	textCanvas.addTextToLine(word);
// }





