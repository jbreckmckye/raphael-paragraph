module.exports = addSpaceAndTruncatedWord;

var addTruncatedWord = require('./addTruncatedWord.js');

function addSpaceAndTruncatedWord(word, textCanvas, boundsTest) {
	textCanvas.addTextToLine(' ');
	textCanvas.saveNewState(); // set baseline as having the space
	var wordAddedSuccessfully = addTruncatedWord(word, textCanvas, boundsTest);
	if (wordAddedSuccessfully === false) {
		// If failed, remove the space
		textCanvas.dropLastSavedState();
		textCanvas.restoreLastSavedState();
	}
	return wordAddedSuccessfully;
}

addSpaceAndTruncatedWord.truncatesWord = true;