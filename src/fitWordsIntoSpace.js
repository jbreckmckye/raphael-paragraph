module.exports = fitWordsIntoSpace;

var util = require('./util.js');

// Text addition strategies
var addWord = require('./textAdditionStrategies/addWord.js');
var addTruncatedWord = require('./textAdditionStrategies/addTruncatedWord.js');
var addSpaceThenWord = require('./textAdditionStrategies/addSpaceThenWord.js');
var addBreakThenWord = require('./textAdditionStrategies/addBreakThenWord.js');
var breakWithHyphenOnCurrentLine = require('./textAdditionStrategies/breakWithHyphenOnCurrentLine.js');
var breakWithHyphenOnNewLine = require('./textAdditionStrategies/breakWithHyphenOnNewLine.js');
var addSpaceAndTruncatedWord = require('./textAdditionStrategies/addSpaceAndTruncatedWord.js');
var ellipsizePreviousWord = require('./textAdditionStrategies/ellipsizePreviousWord.js');

function fitWordsIntoSpace(words, maxWidth, maxHeight, undoableTextCanvas, boundsTest) {
	var outOfSpace = false;

	util.arrayForEach(words, function addWordsUntilOutOfSpace(word, wordIndex, words){
		if (outOfSpace === false) {
			outOfSpace = addWordUsingStrategies(word, wordIndex, words);			
		}
	});

	function addWordUsingStrategies(word, wordIndex, words) {
		var addedWords = words.slice(0, wordIndex);
		var wordStrategies = [];
		var fallbackWordStrategy;

		var isFirstWord = (wordIndex === 0);
		if (isFirstWord) {
			wordStrategies = [addWord, addTruncatedWord];
			fallbackWordStrategy = addWord;
		} else {
			wordStrategies = [addSpaceThenWord, addBreakThenWord, breakWithHyphenOnCurrentLine, breakWithHyphenOnNewLine, addSpaceAndTruncatedWord, ellipsizePreviousWord];
			fallbackWordStrategy = addBreakThenWord;
		}

		var strategyUsed = tryWordStrategies(wordStrategies, fallbackWordStrategy, word, addedWords, boundsTest, undoableTextCanvas);
		var outOfSpace = (strategyUsed.truncatesWord === true);
		return outOfSpace;
	}
}

function tryWordStrategies(strategies, fallbackWordStrategy, word, addedWords, boundsTest, undoableTextCanvas) {
	var successfulStrategy = null;
	var wordAddedSuccessfully = false;

	tryEachStrategyUntilOneMakesWordFitSpace();
	useFallbackIfNoStrategySucceeds();

	return successfulStrategy;

	function tryEachStrategyUntilOneMakesWordFitSpace() {
		// Save initial state, so we can rollback whenever a strategy fails
		undoableTextCanvas.saveNewState();
		// Try each strategy and assign successful strategy once a word fits
		util.arrayForEach(strategies, function(strategy){
			if (wordAddedSuccessfully === false) {			
				wordAddedSuccessfully = strategy(word, undoableTextCanvas, boundsTest, addedWords);
				testBoundsIfStrategyDoesNotTestItself();
				setSuccessfulStrategyIfWordFits(strategy);
				undoStrategyIfUnsuccessful();
			}
		});
	}

	function useFallbackIfNoStrategySucceeds() {
		if (wordAddedSuccessfully === false) {
			fallbackWordStrategy(word, undoableTextCanvas, boundsTest, addedWords);
			successfulStrategy = fallbackWordStrategy;
		}
	}	

	function testBoundsIfStrategyDoesNotTestItself() {
		if (wordAddedSuccessfully === undefined) {
			wordAddedSuccessfully = boundsTest();
		}
	}

	function undoStrategyIfUnsuccessful() {
		if (wordAddedSuccessfully === false) {
			undoableTextCanvas.restoreLastSavedState();
		}
	}

	function saveStateIfSuccessful() {
		undoableTextCanvas.saveNewState();
	}

	function setSuccessfulStrategyIfWordFits(strategy) {
		if (wordAddedSuccessfully === true) {
			successfulStrategy = strategy;
		}		
	}	
}