module.exports = fitWordsIntoSpace;

var util = require('./util.js');

// Text addition strategies
var addWord = require('./textAdditionStrategies/addWord.js');
var addSpaceThenWord = require('./textAdditionStrategies/addSpaceThenWord.js');
var addBreakThenWord = require('./textAdditionStrategies/addBreakThenWord.js');
var ellipsizePreviousWord = require('./textAdditionStrategies/ellipsizePreviousWord.js');
var addTruncatedWord = require('./textAdditionStrategies/addTruncatedWord.js');
var addSpaceAndTruncatedWord = require('./textAdditionStrategies/addSpaceAndTruncatedWord.js');

function fitWordsIntoSpace(words, maxWidth, maxHeight, undoableTextCanvas, boundsTest) {
	var outOfSpace = false;

	util.arrayForEach(words, function(word, wordIndex, words){
		if (outOfSpace === false) {
			outOfSpace = addWordUsingStrategies(word, wordIndex, words);
			undoableTextCanvas.saveNewState();
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
			wordStrategies = [addSpaceThenWord, addBreakThenWord, breakWithHyphenOnCurrentLine, breakWithHyphenOnNewLine, ellipsizePreviousWord];
			fallbackWordStrategy = addBreakThenWord;
		}

		var outOfSpace = tryWordStrategies(wordStrategies, fallbackWordStrategy, word, addedWords, boundsTest, undoableTextCanvas);
		return outOfSpace;
	}
}

function tryWordStrategies(strategies, fallbackWordStrategy, word, addedWords, boundsTest, undoableTextCanvas) {
	var outOfSpace = false;
	var wordAddedSuccessfully = false;

	util.arrayForEach(strategies, function(strategy){
		if (wordAddedSuccessfully === false) {			
			wordAddedSuccessfully = strategy(word, undoableTextCanvas, boundsTest, addedWords);
			outOfSpace = strategy.truncatesWord === true;
			testBoundsIfStrategyDoesNotTestItself();
			undoStrategyIfUnsuccessful();
		}
	});

	if (wordAddedSuccessfully === false) {
		fallbackWordStrategy(word, undoableTextCanvas, boundsTest, addedWords);
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

breakWithHyphenOnCurrentLine.truncatesWord = true;

function tryHyphenatedFormsUsingFormatter(word, textCanvas, boundsTest, hyphenationFormatter) {
	var wordAddedSuccessfully = false;
	if (word.length < 2) {
		wordAddedSuccessfully = false;
	} else {
		var hyphenatedForms = getBrokenForms(word);
		util.arrayForEach(hyphenatedForms, function(form){
			if (wordAddedSuccessfully === false) {
				hyphenationFormatter(form);
				wordAddedSuccessfully = boundsTest();
				rollbackIfUnsuccessful(); // this is a bit boilerplatey, could do with refactor
			}
		});
	}

	return wordAddedSuccessfully;

	function rollbackIfUnsuccessful() {
		if (wordAddedSuccessfully === false) {
			textCanvas.restoreLastSavedState();
		}
	}
}


function getBrokenForms(word) {
	var form, beforeBreak, afterBreak, breakPoint;
	var forms = [];

	var breakPoints = word.length - 1;
	for (var i = 0; i < breakPoints; i++) {
		breakPoint = i;
		beforeBreak = word.slice(0, breakPoint + 1);
		afterBreak = word.slice(breakPoint + 1)
		form = [beforeBreak, afterBreak];
		forms.push(form);
	}

	return forms;
}