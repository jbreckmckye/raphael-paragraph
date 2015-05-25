module.exports = linesFitBounds;

function linesFitBounds(startX, startY, textCanvas, maxWidth, maxHeight) {
	var lineBox = textCanvas.getChangedLinesBBox();
	var width = lineBox.x2 - startX;
	var height = lineBox.y2 - startY;
	if (width <= maxWidth && height <= maxHeight) {
		return true;
	} else {
		return false;
	}
}