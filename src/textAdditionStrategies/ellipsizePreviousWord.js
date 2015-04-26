module.exports = ellipsizePreviousWord;

var addSpaceAndTruncatedWord = require('./addSpaceAndTruncatedWord.js');

function ellipsizePreviousWord(word, textCanvas, boundsTest, addedWords) {
	var wordAddedSuccessfully;
	var previousWord = addedWords.pop();
	
	if (previousWord === undefined) {
		wordAddedSuccessfully = false;
	} else {
		textCanvas.dropLastSavedState();
		textCanvas.restoreLastSavedState();
		wordAddedSuccessfully = addSpaceAndTruncatedWord(previousWord, textCanvas, boundsTest);
		if (wordAddedSuccessfully === false) {
			wordAddedSuccessfully = truncatePreviousWordsAndAddEllipsis(word, textCanvas, boundsText, addedWords);
		}
	}

	return wordAddedSuccessfully;
}

ellipsizePreviousWord.truncatesWord = true;