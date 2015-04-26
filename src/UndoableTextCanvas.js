module.exports = UndoableTextCanvas;

var TextCanvas = require('./TextCanvas.js');

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