describe('tryHyphenatedFormsUsingFormatter', function(){

	var tryHyphenatedFormsUsingFormatter = require('../../src/textAdditionStrategies/tryHyphenatedFormsUsingFormatter.js');

	var mockTextCanvas = {};
	var mockBoundsTest = function() {};
	var mockHyphenationFormatter = function() {};

	it('Returns false if given a word too short to be hyphenated', function(){
		var word = 'a';
		var wordAddedSuccessfully = tryHyphenatedFormsUsingFormatter(word, mockTextCanvas, mockBoundsTest, mockHyphenationFormatter);
		expect(wordAddedSuccessfully).toBe(false);
	});

});