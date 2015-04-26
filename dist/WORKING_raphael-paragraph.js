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
	var TextCanvas = __webpack_require__(3);
	var fitWordsIntoSpace = __webpack_require__(4);

	function paragraph(x, y, text, width, lineHeight, fontSize) {
		var paper = this;
		var words = extractWordsFromText(text);
		var textCanvas = new TextCanvas(paper, x, y, lineHeight, fontSize);
		fitWordsIntoSpace(words, width, textCanvas)
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

	module.exports = TextCanvas;

	var util = __webpack_require__(5);

	function TextCanvas(paper, x, y, lineHeight, fontSize) {
		var that = this;
		var lines = paper.set();
		var nextLineY = y;

		function removeAllLines() {
			// It seems I need both of these - I need to investigate this!
			//lines.remove();
			lines.clear();
			nextLineY = y;
		};

		this.addLine = function addLine() {
			var newLine = paper.text(x, nextLineY, '');
			newLine.attr('font-size', fontSize);
			lines.push(newLine);
			nextLineY += lineHeight;
		};

		this.addTextToLine = function addTextToLine(text) {
			var currentLine = util.arrayLast(lines);
			var currentText = getText(currentLine);
			var newText = currentText + text;
			setText(currentLine, newText);
		};

		this.createLines = function createLines(lineTexts) {
			removeAllLines();
			util.arrayForEach(lineTexts, function(lineText){
				that.addLine();
				that.addTextToLine(lineText);
			});
		};

		this.getBBox = function getBBox() {
			return lines.getBBox();
		};

		this.getLineTexts = function getLineTexts() {
			var texts = [];
			lines.forEach(function(line){
				var lineText = getText(line);
				texts.push(lineText);
			});
			return texts;
		};
	}

	function setText(element, newText) {
		element.attr('text', newText);
	}

	function getText(element) {
		return element.attr('text');
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = fitWordsIntoSpace;

	var util = __webpack_require__(5);

	function fitWordsIntoSpace(words, width, textCanvas) {
		addFirstWord();
		addNthWordsUsingStrategies();

		function addFirstWord() {
			textCanvas.addLine();
			textCanvas.addTextToLine(words[0]);
		}

		function addNthWordsUsingStrategies() {
			words.shift();
			util.arrayForEach(words, function(word){
				addWordToCanvasUsingFirstFittingStrategy(word, textCanvas, width);
			});
		}

	}

	function addWordToCanvasUsingFirstFittingStrategy(word, textCanvas, width) {
		var strategies = [addSpaceThenWord, addNewlineThenWord];
		var defaultStrategy = addNewlineThenWord;

		var wordHasBeenFitted = false;
		var canvasState = textCanvas.getLineTexts();

		while (strategies.length && wordHasBeenFitted === false) {
			useNextStrategy();
			wordHasBeenFitted = testCanvasBounds();
			revertStateIfFailure();
		}
		if (strategies.length === 0 && wordHasBeenFitted === false) {
			// If we've run out of options
			defaultStrategy(textCanvas, word);
		}

		function useNextStrategy() {
			var strategyInUse = strategies.shift();
			strategyInUse(textCanvas, word);
		}

		function revertStateIfFailure() {
			if (wordHasBeenFitted === false) {
				textCanvas.createLines(canvasState);
			}
		}

		function testCanvasBounds() {
			var canvasBBox = textCanvas.getBBox();
			var canvasWidth = canvasBBox.x2 - canvasBBox.x;
			return (canvasWidth <= width);
		}
		
	}


	function addSpaceThenWord(textCanvas, word) {
		textCanvas.addTextToLine(' ' + word);
	}

	function addNewlineThenWord(textCanvas, word) {
		textCanvas.addLine();
		textCanvas.addTextToLine(word);
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

/***/ }
/******/ ]);