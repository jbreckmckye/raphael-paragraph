module.exports = addTruncatedWord;

var getTruncatedFormsLongestFirst = require('.././getTruncatedFormsLongestFirst.js');
var util = require('.././util.js');

function addTruncatedWord(word, textCanvas, boundsTest) {	
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
			textCanvas.restoreLastSavedState();
		}
	}
}