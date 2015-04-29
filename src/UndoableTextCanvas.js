module.exports = UndoableTextCanvas;

var TextCanvas = require('./TextCanvas.js');

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