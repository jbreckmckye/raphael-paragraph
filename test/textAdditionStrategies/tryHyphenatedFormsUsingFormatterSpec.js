var rewire = require("rewire");
var tryHyphenatedFormsUsingFormatter = require('../../src/textAdditionStrategies/tryHyphenatedFormsUsingFormatter.js');

describe('tryHyphenatedFormsUsingFormatter', function(){
	var mockTextCanvas = new MockTextCanvas();

	it('Returns false if given a word too short to be hyphenated', function(){
		var mockBoundsTest = returnTrue;
		var mockHyphenationFormatter = noop;

		var word = 'a';
		var wordAddedSuccessfully = tryHyphenatedFormsUsingFormatter(word, mockTextCanvas, mockBoundsTest, mockHyphenationFormatter);
		expect(wordAddedSuccessfully).toBe(false);
	});

	describe('Returns true if one hyphenated form fits', function() {
		var tryHyphenatedFormsUsingFormatter = rewire('../../src/textAdditionStrategies/tryHyphenatedFormsUsingFormatter.js');
		tryHyphenatedFormsUsingFormatter.__set__('getBrokenForms', mockGetBrokenForms);

		var mockHyphenationFormatter = noop;
		var word = 'abc';
		
		it('Returns true if first form fits', function() {
			var mockBoundsTest = returnTrue;
			var wordAddedSuccessfully = tryHyphenatedFormsUsingFormatter(word, mockTextCanvas, mockBoundsTest, mockHyphenationFormatter);
			expect(wordAddedSuccessfully).toBe(true);
		});

		it('Returns true if last form fits', function() {
			var mockBoundsTest = createFunctionPassingOnNthCall(2);
			var wordAddedSuccessfully = tryHyphenatedFormsUsingFormatter(word, mockTextCanvas, mockBoundsTest, mockHyphenationFormatter);
			expect(wordAddedSuccessfully).toBe(true);
		});

		it('Returns false if none fit', function() {
			var mockBoundsTest = returnFalse;
			var wordAddedSuccessfully = tryHyphenatedFormsUsingFormatter(word, mockTextCanvas, mockBoundsTest, mockHyphenationFormatter);
			expect(wordAddedSuccessfully).toBe(false);
		});
	});

	xdescribe('Applies different hyphenated forms through the formatter until one fits', function() {
		// Passes each through formatter
		// Stops calling formatter after fit found
		// Rolls back state between each
		// If all fail, only rolls back one step maximum
	})

});


function MockTextCanvas() {
	this.restoreLastSavedState = function() {};
}

function mockGetBrokenForms() {
	return [ 
		['a','bc'], 
		['ab','c'] 
	];
}

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function noop() {
	// do nil
}

function createFunctionPassingOnNthCall(n) {
	return function() {
		n--;
		return n <= 0;
	}
}
