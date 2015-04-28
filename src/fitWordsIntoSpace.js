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
		var previouslyAddedWords = words.slice(0, wordIndex);
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

		var outOfSpace = tryWordStrategies(wordStrategies, fallbackWordStrategy, word, previouslyAddedWords, boundsTest, undoableTextCanvas);
		return outOfSpace;
	}
}

function tryWordStrategies(strategies, fallbackWordStrategy, word, previouslyAddedWords, boundsTest, undoableTextCanvas) {
	var outOfSpace = false;
	var wordAddedSuccessfully = false;

	// Save baseline state
	undoableTextCanvas.saveNewState();

	util.arrayForEach(strategies, function(strategy){
		if (wordAddedSuccessfully === false) {			
			wordAddedSuccessfully = strategy(word, undoableTextCanvas, boundsTest, previouslyAddedWords);
			outOfSpace = strategy.truncatesWord === true;
			testBoundsIfStrategyDoesNotTestItself();
			undoStrategyIfUnsuccessful();
		}
	});

	if (wordAddedSuccessfully === false) {
		fallbackWordStrategy(word, undoableTextCanvas, boundsTest, previouslyAddedWords);
		outOfSpace = true;
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

	return outOfSpace;
}