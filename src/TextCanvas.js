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

function setText(element, text) {
	element.attr('text', newText);
}

function getText(element) {
	return element.attr('text');
}