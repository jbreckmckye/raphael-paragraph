module.exports = UndoableTextCanvas;

var TextCanvas = require('./TextCanvas.js');

function UndoableTextCanvas(paper, x, y, lineHeight, styles) {
	var states = [];
	var undoableTextCanvas = new TextCanvas(paper, x, y, lineHeight, styles);
	var blankState = undoableTextCanvas.getLineTexts();

	undoableTextCanvas.createUndoPoint = function createUndoPoint() {
		var state = undoableTextCanvas.getLineTexts();
		states.push(state);
	};

	undoableTextCanvas.undo = function undo() {
		var lastState = states.pop() || blankState;
		undoableTextCanvas.createLines(lastState);
		return lastState;
	};

	undoableTextCanvas.createUndoPoint(); // initialize as blank set

	return undoableTextCanvas;
}