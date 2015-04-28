module.exports.arrayForEach = function arrayForEach(array, fn) { // Shimmed for IE8
	for (var i = 0; i < array.length; i++) {
		fn(array[i], i, array);
	}
};

module.exports.arrayLast = function arrayLast(array) {
	return array[array.length - 1];
};

module.exports.curry = function curry(fn) {
	// Lifted from https://medium.com/@kbrainwave/currying-in-javascript-ce6da2d324fe
	var args = Array.prototype.slice.call(arguments, 1);
	return function() {
		return fn.apply(this, args.concat(Array.prototype.slice.call(arguments, 0)));
	};
};