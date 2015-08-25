module.exports = ParagraphConfiguration;

// Dependencies
var util = require('./util.js');

var defaultTextStyle = {
	'font-size' : 13,
	'text-anchor' : 'start'
};

function ParagraphConfiguration(options, paper) {
	this.text = util.defaultUndefined(options.text, 'Hello, world');
	this.textStyle = util.mergeObjectsIntoNew([defaultTextStyle, options.textStyle]);
	this.lineHeight = util.defaultUndefined(options.lineHeight, this.textStyle['font-size']);
	this.x = util.defaultUndefined(options.x, 0);
	this.y = util.defaultUndefined(options.y, (this.lineHeight / 2));
	var paperDimensions = getPaperDimensions(paper);
	this.maxWidth = util.defaultUndefined(options.maxWidth, (paperDimensions.width - this.x));
	this.maxHeight = util.defaultUndefined(options.maxHeight, (paperDimensions.height - this.y));
	this.hyphenationEnabled - util.defaultUndefined(options.hyphenationEnabled, true);
}

function getPaperDimensions(paper) {
	var boundingRectangle = paper.canvas.getBoundingClientRect();
	return {
		// IE < 8 doesn't provide width / height fields, so we need to shim them
		width : boundingRectangle.width || (boundingRectangle.right - boundingRectangle.left),
		height : boundingRectangle.height || (boundingRectangle.bottom - boundingRectangle.top)
	};
}