module.exports = TextCanvasState;

var util = require('./util.js');
var getText = require('./getText');

function TextCanvasState(lines) {
	var lineTexts = [];
	util.arrayForEach(lines, function(line){
		var lineText = getText(line);
		lineTexts.push(lineText);
	});

	this.getLineTexts = function getLineTexts() {
		return lineTexts.slice();
	};
}