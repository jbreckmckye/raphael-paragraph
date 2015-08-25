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
	this.maxWidth = util.defaultUndefined(options.maxWidth, (getPaperWidth(paper) - this.x));
	this.maxHeight = util.defaultUndefined(options.maxHeight, (getPaperHeight(paper) - this.y));
	this.hyphenationEnabled - util.defaultUndefined(options.hyphenationEnabled, true);
}

function getPaperWidth(paper) {
	var vectorImageElement = paper.canvas;
	return vectorImageElement.clientWidth;
}

function getPaperHeight(paper) {
	var vectorImageElement = paper.canvas;
	return vectorImageElement.clientHeight;
}