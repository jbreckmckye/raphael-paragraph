module.exports = TextCanvas;

var util = require('./util.js');
var getText = require('./getText');
var TextCanvasState = require('./TextCanvasState');

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

	this.restoreState = function restoreState(state) {
		var lineTexts = state.getLineTexts();
		removeAllLines();
		util.arrayForEach(lineTexts, function(lineText){
			that.addLine();
			that.addTextToLine(lineText);
		});
	};

	this.getBBox = function getBBox() {
		return lines.getBBox();
	};

	this.getState = function getState() {
		return new TextCanvasState(lines);
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