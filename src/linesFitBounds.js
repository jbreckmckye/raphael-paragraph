module.exports = linesFitBounds;

function linesFitBounds(startX, startY, textCanvas, maxWidth, maxHeight) {
	var lineBox = textCanvas.getBBox();
	var width = lineBox.x2 - lineBox.x;
	var height = lineBox.y2 - lineBox.y;
	if (width <= maxWidth && height <= maxHeight) {
		return true;
	} else {
		return false;
	}
}