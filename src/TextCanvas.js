module.exports = TextCanvas;

var LineSet = require('./LineSet.js');
var util = require('./util.js');

function TextCanvas(paper, x, y, width, height, lineHeight) {
	height = height ? height : Infinity;

	var rightmostX = x + width; // What about RTL?
	var bottommostY = y + height;

	var lineSet = new LineSet(paper, x, y, lineHeight);
	var lineSetStates = [];

	this.addTextToLine = lineSet.addTextToLine;

	this.addNewLine = lineSet.addNewLine;

	this.areBoundsBroken = function areBoundsBroken() {
		var boundingBox = lineSet.getBBox();
		return (boundingBox.x2 > rightmostX || boundingBox.y2 > bottommostY);
	};

	this.saveState = function saveState() {
		var lineSetCurrentState = lineSet.getLineTexts();
		lineSetStates.push(lineSetCurrentState);
	};

	this.rollbackState = function rollbackState() {
		var lastState = util.arrayLast(lineSetStates);
		lineSet.createLines(lastState);
	};

	this.addNewLine();
	this.saveState();
}

function LineSet(paper, x, y, lineHeight) {
	var that = this;
	var lines = paper.set();
	var nextLineY = y;

	function removeAllLines() {
		lines.remove();
		nextLineY = y;
	};

	this.addLine = function addLine() {
		var newLine = paper.text(x, nextLineY, '');
		lines.push(newLine);
		nextLineY += lineHeight;
	};

	this.addTextToLine = function addTextToLine(text) { // should we include a /n guard here?
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



function arrayForEach(array, fn) { // Shimmed for IE8
	for (var i = 0; i < array.length; i++) {
		fn(array[i], i, array);
	}
}

function arrayLast(array) {
	return array[array.length - 1];
}

function setText(element, text) {
	element.attr('text', newText);
}

function getText(element) {
	return element.attr('text');
}