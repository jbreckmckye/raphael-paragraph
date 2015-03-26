module.exports.arrayForEach = function arrayForEach(array, fn) { // Shimmed for IE8
	for (var i = 0; i < array.length; i++) {
		fn(array[i], i, array);
	}
};

function arrayLast(array) {
	return array[array.length - 1];
}