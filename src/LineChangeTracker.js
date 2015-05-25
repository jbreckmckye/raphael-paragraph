module.exports = LineChangeTracker;

var util = require('./util.js');

function LineChangeTracker(initialLineCount) {
	initialLineCount = initialLineCount || 0;
	var lineChangedFlags = [];

	for (var i = 0; i < initialLineCount; i++) {
		lineChangedFlags.push(false);
	}
	
	this.lastLineEdited = function lastLineEdited() {
		var lastLineIndex = lineChangedFlags.length - 1;
		lineChangedFlags[lastLineIndex] = true;
	};

	this.newLineAdded = function newLineAdded() {
		lineChangedFlags.push(true);
	};

	this.getChangedLines = function getChangedLines() {
		var changedLineIndices = [];
		util.arrayForEach(lineChangedFlags, function(flag, index){
			if (flag) {
				changedLineIndices.push(index);
			}
		});
		return changedLineIndices;
	};
}