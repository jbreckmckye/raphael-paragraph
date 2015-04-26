module.exports = lastLineFitsBounds;

function lastLineFitsBounds(startX, startY, textCanvas, maxWidth, maxHeight) {
	var lineEnd = textCanvas.getLastLineEnd();
	var width = lineEnd.x - startX;
	var height = lineEnd.y - startY;
	if (width <= maxWidth && height <= maxHeight) {
		return true;
	} else {
		return false;
	}
}