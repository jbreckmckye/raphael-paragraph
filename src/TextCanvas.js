module.exports = TextCanvas;

var util = require('./util.js');
var getText = require('./getText');
var TextCanvasState = require('./TextCanvasState');
var TextAdditionTracker = require('./TextAdditionTracker');

function TextCanvas(paper, x, y, lineHeight, styles) {
	var that = this;
	var lines = paper.set();
	var nextLineY = y;
	var textAdditionTracker = new TextAdditionTracker();

	this.addLine = function addLine() {
		var newLine = paper.text(x, nextLineY, '');
		newLine.attr(styles);
		lines.push(newLine);
		nextLineY += lineHeight;
		textAdditionTracker.newLineAdded();
	};

	this.addTextToLine = function addTextToLine(text) {
		var currentLine = util.arrayLast(lines);
		var currentText = getText(currentLine);
		var newText = currentText + text;
		setText(currentLine, newText);
		textAdditionTracker.lastLineEdited();
	};

	this.restoreState = function restoreState(state) {
		var newLineCount = state.getLineCount();
		textAdditionTracker = new TextAdditionTracker(newLineCount);

		var currentState = this.getState();
		var currentLines = currentState.getLineTexts();
		var targetLines = state.getLineTexts();

		removeSurplusCurrentLines();
		mutateCurrentLinesToMatchTargets();
		addNewTargetLines();

		function removeSurplusCurrentLines() {
			var surplusCurrentLines = currentLines.length - targetLines.length;
			if (surplusCurrentLines >= 1) {
				for (var i = 0; i < surplusCurrentLines; i++) {
					deleteLastLine();
				}
			}
		}

		function mutateCurrentLinesToMatchTargets() {
			util.arrayForEach(lines, function(lineElement, index) {
				var targetText = targetLines[index];
				setText(lineElement, targetText);
			});
		}

		function addNewTargetLines() {
			var extraLinesToAdd = targetLines.length - currentLines.length;
			var newLineText;
			if (extraLinesToAdd >= 1) {
				for (var i = 0; i < extraLinesToAdd; i++) {
					newLineText = targetLines[currentLines.length];
					that.addLine();
					that.addTextToLine(newLineText);
				}
			}
		}

		function deleteLastLine() {
			var currentLine = util.arrayLast(lines);
			currentLine.remove(); // remove from canvas
			lines.pop(); // remove from set
			nextLineY -= lineHeight;			
		};

	};


	this.getChangedLinesBBox = function getChangedLinesBBox() {
		var changedLines = paper.set();
		var changedLineIndices = textAdditionTracker.getChangedLines();
		util.arrayForEach(changedLineIndices, function(index){
			changedLines.push(lines[index]);
		});
		return changedLines.getBBox();
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