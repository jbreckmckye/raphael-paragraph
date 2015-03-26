describe('extractWordsFromText', function(){

	var extractWordsFromText = require('../src/extractWordsFromText.js');

	it('Pulls space-separated words from a paragraph string', function(){
		var spaceSeparatedWords = "Space separated words";
		var extractedWords = extractWordsFromText(spaceSeparatedWords);
		expect(extractedWords).toEqual(['Space', 'separated', 'words']);
	});

	it('Pulls line-break-separated words from a paragraph string', function(){
		var lineBreakSeparatedWords = 'Linebreak\nseparated\nwords';
		var extractedWords = extractWordsFromText(lineBreakSeparatedWords);
		expect(extractedWords).toEqual(['Linebreak', 'separated', 'words']);
	});

	it('Treats duplicate spaces as a single separator', function(){
		var duplicateSpaces = "Has  duplicate   spaces";
		var extractedWords = extractWordsFromText(duplicateSpaces);
		expect(extractedWords).toEqual(['Has', 'duplicate', 'spaces']);
	});

	it('Treats duplicate line-breaks as a single separator', function(){
		var duplicateBreaks = "Has\n\nduplicate\n\n\nlinebreaks";
		var extractedWords = extractWordsFromText(duplicateBreaks);
		expect(extractedWords).toEqual(['Has', 'duplicate', 'linebreaks']);
	});

	it('Ignores trailing and leading spaces', function(){
		var untrimmedSpaces = " Needs trimming ";
		var extractedWords = extractWordsFromText(untrimmedSpaces);
		expect(extractedWords).toEqual(['Needs', 'trimming']);
	});

	it('Treats mixed spaces and line-breaks as a single separator', function(){
		var mixedSeparators = "Has\n mixed\n \nspaces \n and linebreaks"
		var extractedWords = extractWordsFromText(mixedSeparators);
		expect(extractedWords).toEqual(['Has', 'mixed', 'spaces', 'and', 'linebreaks']);
	});

	it('Returns empty array if given an empty string', function(){
		var wordsFromEmptyString = extractWordsFromText('');
		expect(wordsFromEmptyString).toEqual([]);
	});
});