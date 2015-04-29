module.exports = ParagraphConfiguration;

// Dependencies
var util = require('./util.js');

var defaultTextStyle = {
	'font-size' : 13,
	'text-anchor' : 'start'
};

function ParagraphConfiguration(options) {
	this.text = util.defaultUndefined(options.text, 'Hello, world');
	this.x = util.defaultUndefined(options.x, 0);
	this.y = util.defaultUndefined(options.y, 0);
	this.maxWidth = util.defaultUndefined(options.maxWidth, paper.width);
	this.maxHeight = util.defaultUndefined(options.maxHeight, paper.height);
	this.textStyle = util.mergeObjectsIntoNew([defaultTextStyle, options.textStyle]);
	this.lineHeight = util.defaultUndefined(options.lineHeight, options.textStyle['font-size']);
}