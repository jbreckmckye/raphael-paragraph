module.exports = tryHyphenatedFormsUsingFormatter;

var getBrokenForms = require('.././getBrokenForms.js');
var util = require('.././util.js');

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
				rollbackIfUnsuccessful();
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