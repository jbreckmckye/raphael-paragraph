module.exports.arrayForEach = arrayForEach;

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

module.exports.mergeObjectsIntoNew = function mergeObjectsIntoNew(objects) {
	var mergedObject = {};
	arrayForEach(objects, function(objectToMerge){
		decorateFirstObjectWithFieldsFromSecond(mergedObject, objectToMerge);
	})

	return mergedObject;

	function decorateFirstObjectWithFieldsFromSecond(obj1, obj2) {
		for (field in obj2) {
			if (obj2.hasOwnProperty(field)) {
				obj1[field] = obj2[field];
			}
		};
		return obj1;
	}	
};

module.exports.defaultUndefined = function defaultUndefined(optionalValue, defaultValue) {
	if (optionalValue === undefined) {
		return defaultValue;
	} else {
		return optionalValue;
	}
};

function arrayForEach(array, fn) { // Shimmed for IE8
	for (var i = 0; i < array.length; i++) {
		fn(array[i], i, array);
	}
};