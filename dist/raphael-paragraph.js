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
	var extractWordsFromText = __webpack_require__(2);
	var UndoableTextCanvas = __webpack_require__(3);
	var fitWordsIntoSpace = __webpack_require__(4);
	var util = __webpack_require__(5);
	var lastLineFitsBounds = __webpack_require__(6);

	function paragraph(options) {
		var paper = this;
		defaultOptions(options, paper);
		var words = extractWordsFromText(options.text);
		var undoableTextCanvas = new UndoableTextCanvas(paper, options.x, options.y, options.lineHeight, options.textStyle);
		var boundsTest = function() {
			return lastLineFitsBounds(options.x, options.y, undoableTextCanvas, options.maxWidth, options.maxHeight);
		};
		fitWordsIntoSpace(words, options.maxWidth, options.maxHeight, undoableTextCanvas, boundsTest);
		return undoableTextCanvas.getElements();
	}

	function defaultOptions(options, paper) {
		var defaultTextStyle = {
			'font-size' : 13,
			'text-anchor' : 'start'
		};

		options.text = defaultUndefined(options.text, 'Hello, world');
		options.x = defaultUndefined(options.x, 0);
		options.y = defaultUndefined(options.y, 0);
		options.maxWidth = defaultUndefined(options.maxWidth, paper.width);
		options.maxHeight = defaultUndefined(options.maxHeight, paper.height);
		options.textStyle = mergeObjects(options.textStyle, defaultTextStyle);
		options.lineHeight = defaultUndefined(options.lineHeight, options.textStyle['font-size']);
	}

	function defaultUndefined(optionalValue, defaultValue) {
		if (optionalValue === undefined) {
			return defaultValue;
		} else {
			return optionalValue;
		}
	}

	function mergeObjects(obj1, obj2) {
		for (field in obj2) {
			if (obj2.hasOwnProperty(field)) {
				obj1[field] = obj2[field];
			}
		};
		return obj1;
	}

/***/ },
/* 2 */
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
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = UndoableTextCanvas;

	var TextCanvas = __webpack_require__(7);

	function UndoableTextCanvas(paper, x, y, lineHeight, styles) {
		var states = [];
		var undoableTextCanvas = new TextCanvas(paper, x, y, lineHeight, styles);
		var blankState = undoableTextCanvas.getState();

		undoableTextCanvas.saveNewState = function saveState() {
			var state = undoableTextCanvas.getState();
			states.push(state);
		};

		undoableTextCanvas.restoreLastSavedState = function restoreState() {
			var lastState = states[states.length - 1] || blankState;
			undoableTextCanvas.restoreState(lastState);
			return lastState;
		};

		undoableTextCanvas.dropLastSavedState = function dropLastSavedState() {
			return states.pop();
		};

		states.push(blankState);

		return undoableTextCanvas;
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = fitWordsIntoSpace;

	var util = __webpack_require__(5);

	// Text addition strategies
	var addWord = __webpack_require__(8);
	var addSpaceThenWord = __webpack_require__(9);
	var addBreakThenWord = __webpack_require__(10);
	var ellipsizePreviousWord = __webpack_require__(11);
	var addTruncatedWord = __webpack_require__(12);
	var addSpaceAndTruncatedWord = __webpack_require__(13);

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

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports.arrayForEach = function arrayForEach(array, fn) { // Shimmed for IE8
		for (var i = 0; i < array.length; i++) {
			fn(array[i], i, array);
		}
	};

	module.exports.arrayLast = function arrayLast(array) {
		return array[array.length - 1];
	};

	module.exports.curry = function curry(fn) {
		// Lifted from https://medium.com/@kbrainwave/currying-in-javascript-ce6da2d324fe
		var args = Array.prototype.slice.call(arguments, 1);
		return function() {
			return fn.apply(this, args.concat(Array.prototype.slice.call(arguments, 0)));
		};
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = lastLineFitsBounds;

	function lastLineFitsBounds(startX, startY, textCanvas, maxWidth, maxHeight) {
		var lineEnd = textCanvas.getLastLineEnd();
		var width = lineEnd.x - startX;
		var height = lineEnd.y - startY;
		if (width <= maxWidth && height <= maxHeight) {
			return true;
		} else {
			return false;
		}
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = TextCanvas;

	var util = __webpack_require__(5);

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

		this.getLastLineEnd = function getLastLineEnd() {
			var lastLineIndex = lines.length - 1;
			var boundingBox = lines[lastLineIndex].getBBox();
			return {
				x : boundingBox.x2,
				y : boundingBox.y2
			};
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = addWord;

	function addWord(word, textCanvas) {
		textCanvas.addTextToLine(word);
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = addSpaceThenWord;

	function addSpaceThenWord(word, textCanvas) {
		textCanvas.addTextToLine(' ' + word);
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = addBreakThenWord;

	function addBreakThenWord(word, textCanvas) {
		textCanvas.addLine();
		textCanvas.addTextToLine(word);
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = ellipsizePreviousWord;

	var addSpaceAndTruncatedWord = __webpack_require__(13);

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

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = addTruncatedWord;

	var getTruncatedFormsLongestFirst = __webpack_require__(14);
	var util = __webpack_require__(5);

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

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = addSpaceAndTruncatedWord;

	var addTruncatedWord = __webpack_require__(12);

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

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = getTruncatedFormsLongestFirst;

	var util = __webpack_require__(5);

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

/***/ }
/******/ ]);