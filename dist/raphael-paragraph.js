/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	if (typeof Raphael === 'undefined') {
		throw 'Raphael was undefined when the raphael-paragraph plugin was run. Did you include the files in the wrong order?';
	} else if (Raphael.fn.paragraph) {
		throw 'Raphael.fn.paragraph was already defined when the raphael-paragraph plugin was run.';
	} else {
		Raphael.fn.paragraph = __webpack_require__(1);
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = paragraph;

	// Dependencies
	var ParagraphConfiguration = __webpack_require__(2);
	var extractWordsFromText = __webpack_require__(3);
	var UndoableTextCanvas = __webpack_require__(4);
	var fitWordsIntoSpace = __webpack_require__(5);
	var util = __webpack_require__(6);
	var linesFitBounds = __webpack_require__(7);

	function paragraph(setOptions) {
		var paper = this;
		var config = new ParagraphConfiguration(setOptions, paper);
		var words = extractWordsFromText(config.text);
		var undoableTextCanvas = new UndoableTextCanvas(paper, config.x, config.y, config.lineHeight, config.textStyle);
		var boundsTest = util.curry(linesFitBounds, config.x, config.y, undoableTextCanvas, config.maxWidth, config.maxHeight);
		fitWordsIntoSpace(words, config.maxWidth, config.maxHeight, undoableTextCanvas, boundsTest);
		return undoableTextCanvas.getElements();
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = ParagraphConfiguration;

	// Dependencies
	var util = __webpack_require__(6);

	var defaultTextStyle = {
		'font-size' : 13,
		'text-anchor' : 'start'
	};

	function ParagraphConfiguration(options, paper) {
		this.text = util.defaultUndefined(options.text, 'Hello, world');
		this.textStyle = util.mergeObjectsIntoNew([defaultTextStyle, options.textStyle]);
		this.lineHeight = util.defaultUndefined(options.lineHeight, this.textStyle['font-size']);
		this.x = util.defaultUndefined(options.x, 0);
		this.y = util.defaultUndefined(options.y, (this.lineHeight / 2));
		this.maxWidth = util.defaultUndefined(options.maxWidth, (paper.width - this.x));
		this.maxHeight = util.defaultUndefined(options.maxHeight, (paper.height - this.y));
		
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = extractWordsFromText;

	function extractWordsFromText(paragraphText) {
		var words = paragraphText.match(/\S+/g);
		if (words === null) {
			return [];
		} else {
			return words;
		}
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = UndoableTextCanvas;

	var TextCanvas = __webpack_require__(16);

	function UndoableTextCanvas(paper, x, y, lineHeight, styles) {
		var states = [];
		var undoableTextCanvas = new TextCanvas(paper, x, y, lineHeight, styles);
		var blankState = undoableTextCanvas.getState();

		undoableTextCanvas.saveNewState = function saveState(key) {
			var state = undoableTextCanvas.getState();
			states.push(state);
		};

		undoableTextCanvas.restoreLastSavedState = function restoreState() {
			var lastState = states[states.length - 1] || blankState;
			undoableTextCanvas.restoreState(lastState);
			return lastState;
		};

		undoableTextCanvas.restoreEarlierSavedState = function restoreEarlierSavedState(howManySavesAgo) {
			var index = (states.length - 1) - howManySavesAgo;
			var requestedState = states[index];
			undoableTextCanvas.restoreState(requestedState);
		};

		undoableTextCanvas.dropLastSavedState = function dropLastSavedState() {
			states.pop();
		};

		states.push(blankState);

		return undoableTextCanvas;
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = fitWordsIntoSpace;

	var util = __webpack_require__(6);

	// Text addition strategies
	var addWord = __webpack_require__(8);
	var addTruncatedWord = __webpack_require__(9);
	var addSpaceThenWord = __webpack_require__(10);
	var addBreakThenWord = __webpack_require__(11);
	var breakWithHyphenOnCurrentLine = __webpack_require__(12);
	var breakWithHyphenOnNewLine = __webpack_require__(13);
	var addSpaceAndTruncatedWord = __webpack_require__(14);
	var ellipsizePreviousWord = __webpack_require__(15);

	function fitWordsIntoSpace(words, maxWidth, maxHeight, undoableTextCanvas, boundsTest) {
		var outOfSpace = false;

		util.arrayForEach(words, function addWordsUntilOutOfSpace(word, wordIndex, words){
			if (outOfSpace === false) {
				outOfSpace = addWordUsingStrategies(word, wordIndex, words);			
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
				wordStrategies = [addSpaceThenWord, addBreakThenWord, breakWithHyphenOnCurrentLine, breakWithHyphenOnNewLine, addSpaceAndTruncatedWord, ellipsizePreviousWord];
				fallbackWordStrategy = addBreakThenWord;
			}

			var strategyUsed = tryWordStrategies(wordStrategies, fallbackWordStrategy, word, addedWords, boundsTest, undoableTextCanvas);
			var outOfSpace = (strategyUsed.truncatesWord === true);
			return outOfSpace;
		}
	}

	function tryWordStrategies(strategies, fallbackWordStrategy, word, addedWords, boundsTest, undoableTextCanvas) {
		var successfulStrategy = null;
		var wordAddedSuccessfully = false;

		tryEachStrategyUntilOneMakesWordFitSpace();
		useFallbackIfNoStrategySucceeds();

		return successfulStrategy;

		function tryEachStrategyUntilOneMakesWordFitSpace() {
			// Save initial state, so we can rollback whenever a strategy fails
			undoableTextCanvas.saveNewState();
			// Try each strategy and assign successful strategy once a word fits
			util.arrayForEach(strategies, function(strategy){
				if (wordAddedSuccessfully === false) {			
					wordAddedSuccessfully = strategy(word, undoableTextCanvas, boundsTest, addedWords);
					testBoundsIfStrategyDoesNotTestItself();
					setSuccessfulStrategyIfWordFits(strategy);
					undoStrategyIfUnsuccessful();
				}
			});
		}

		function useFallbackIfNoStrategySucceeds() {
			if (wordAddedSuccessfully === false) {
				fallbackWordStrategy(word, undoableTextCanvas, boundsTest, addedWords);
				successfulStrategy = fallbackWordStrategy;
			}
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

		function setSuccessfulStrategyIfWordFits(strategy) {
			if (wordAddedSuccessfully === true) {
				successfulStrategy = strategy;
			}		
		}	
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports.arrayForEach = arrayForEach;

	module.exports.arrayLast = function arrayLast(array) {
		return array[array.length - 1];
	};

	module.exports.curry = function curry(fn) {
		// Lifted from https://medium.com/@kbrainwave/currying-in-javascript-ce6da2d324fe
		var args = Array.prototype.slice.call(arguments, 1);
		return function() {
			return fn.apply(this, args.concat(Array.prototype.slice.call(arguments, 0)));
		};
	};

	module.exports.mergeObjectsIntoNew = function mergeObjectsIntoNew(objects) {
		var mergedObject = {};
		arrayForEach(objects, function(objectToMerge){
			decorateFirstObjectWithFieldsFromSecond(mergedObject, objectToMerge);
		})

		return mergedObject;

		function decorateFirstObjectWithFieldsFromSecond(obj1, obj2) {
			for (field in obj2) {
				if (obj2.hasOwnProperty(field)) {
					obj1[field] = obj2[field];
				}
			};
			return obj1;
		}	
	};

	module.exports.defaultUndefined = function defaultUndefined(optionalValue, defaultValue) {
		if (optionalValue === undefined) {
			return defaultValue;
		} else {
			return optionalValue;
		}
	};

	function arrayForEach(array, fn) { // Shimmed for IE8
		for (var i = 0; i < array.length; i++) {
			fn(array[i], i, array);
		}
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = linesFitBounds;

	function linesFitBounds(startX, startY, textCanvas, maxWidth, maxHeight) {
		var lineBox = textCanvas.getBBox();
		var width = lineBox.x2 - lineBox.x;
		var height = lineBox.y2 - lineBox.y;
		if (width <= maxWidth && height <= maxHeight) {
			return true;
		} else {
			return false;
		}
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = addWord;

	function addWord(word, textCanvas) {
		textCanvas.addTextToLine(word);
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = addTruncatedWord;

	var getTruncatedFormsLongestFirst = __webpack_require__(17);
	var util = __webpack_require__(6);

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

	addTruncatedWord.truncatesWord = true;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = addSpaceThenWord;

	function addSpaceThenWord(word, textCanvas) {
		textCanvas.addTextToLine(' ' + word);
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = addBreakThenWord;

	function addBreakThenWord(word, textCanvas) {
		textCanvas.addLine();
		textCanvas.addTextToLine(word);
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = breakWithHyphenOnCurrentLine;

	var tryHyphenatedFormsUsingFormatter = __webpack_require__(18);

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

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = breakWithHyphenOnNewLine;

	var tryHyphenatedFormsUsingFormatter = __webpack_require__(18);

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

	breakWithHyphenOnNewLine.truncatesWord = true;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = addSpaceAndTruncatedWord;

	var addTruncatedWord = __webpack_require__(9);

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

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = ellipsizePreviousWord;

	var addSpaceAndTruncatedWord = __webpack_require__(14);
	var addTruncatedWord = __webpack_require__(9);

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

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = TextCanvas;

	var util = __webpack_require__(6);

	function TextCanvas(paper, x, y, lineHeight, styles) {
		var that = this;
		var lines = paper.set();
		var nextLineY = y;

		this.addLine = function addLine() {
			var newLine = paper.text(x, nextLineY, '');
			newLine.attr(styles);
			lines.push(newLine);
			nextLineY += lineHeight;
		};

		this.addTextToLine = function addTextToLine(text) {
			var currentLine = util.arrayLast(lines);
			var currentText = getText(currentLine);
			var newText = currentText + text;
			setText(currentLine, newText);
		};

		this.restoreState = function createLines(lineTexts) {
			removeAllLines();
			util.arrayForEach(lineTexts, function(lineText){
				that.addLine();
				that.addTextToLine(lineText);
			});
		};

		this.getBBox = function getBBox() {
			return lines.getBBox();
		};

		this.getState = function getLineTexts() {
			var texts = [];
			lines.forEach(function(line){
				var lineText = getText(line);
				texts.push(lineText);
			});
			return texts;
		};

		this.getElements = function getElements() {
			return lines;
		};

		function removeAllLines() {
			lines.remove();
			// .remove() leaves handles to the elements within the set, so we reinitialize it
			lines = paper.set(); 
			nextLineY = y;
		};

		this.addLine(); // initialize with a first line available
	}

	function setText(element, newText) {
		element.attr('text', newText);
	}

	function getText(element) {
		return element.attr('text');
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = getTruncatedFormsLongestFirst;

	var util = __webpack_require__(6);

	function getTruncatedFormsLongestFirst(characters) {
		var forms = [];
		createLeftToRightSubstrings(characters, forms);
		addEllipsesToForms(forms);
		forms.reverse();
		return forms;
	}

	function createLeftToRightSubstrings(characters, forms) {
		util.arrayForEach(characters, function(character, index) {
			var form = '';
			for (var i = 0; i <= index; i++) {
				form = form + characters[i];
			}
			forms.push(form);
		});
	}

	function addEllipsesToForms(forms) {
		util.arrayForEach(forms, function(form, index, forms){
			forms[index] = form + '...';
		});
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = tryHyphenatedFormsUsingFormatter;

	var getBrokenForms = __webpack_require__(19);
	var util = __webpack_require__(6);

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

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = getBrokenForms;

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

/***/ }
/******/ ]);