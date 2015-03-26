module.exports = LineSet;

var util = require('./util.js');

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