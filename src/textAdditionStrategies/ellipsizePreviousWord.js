module.exports = ellipsizePreviousWord;

var addSpaceAndTruncatedWord = require('./addSpaceAndTruncatedWord.js');
var addTruncatedWord = require('./addTruncatedWord.js');

function ellipsizePreviousWord(word, textCanvas, boundsTest, addedWords) {
	var previousWords = addedWords.slice(0); // clone
	var wordsRemoved = 0;
	var wordAddedSuccessfully = rollbackWordsUntilEllipsisFits(word, textCanvas, boundsTest, previousWords, wordsRemoved);
	return wordAddedSuccessfully;
}

ellipsizePreviousWord.truncatesWord = true;

function rollbackWordsUntilEllipsisFits(word, textCanvas, boundsTest, previousWords, wordsRemoved) {
	var wordAddedSuccessfully;

	var previousWord = previousWords.pop();
	wordsRemoved++;

	var noPreviousWords = (previousWord === undefined);
	var previousWordIsFirstWord = (previousWords.length === 0);
	var addPreviousWordWithTruncation = previousWordIsFirstWord ? addTruncatedWord : addSpaceAndTruncatedWord;
	
	if (noPreviousWords) {
		wordAddedSuccessfully = false;
	} else {
		textCanvas.restoreEarlierSavedState(wordsRemoved); // doesn't this assume there's a save per word? This might be wrong in future
		wordAddedSuccessfully = addPreviousWordWithTruncation(previousWord, textCanvas, boundsTest);
		if (wordAddedSuccessfully === false) {
			wordAddedSuccessfully = rollbackWordsUntilEllipsisFits(word, textCanvas, boundsTest, previousWords, wordsRemoved);
		}
	}

	return wordAddedSuccessfully;
}