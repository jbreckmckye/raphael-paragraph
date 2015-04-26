module.exports = getTruncatedFormsLongestFirst;

var util = require('./util.js');

function getTruncatedFormsLongestFirst(characters) {
	var forms = [];
	createLeftToRightSubstrings(characters, forms);
	addEllipsesToForms(forms);
	forms.reverse();
	return forms;
}

function createLeftToRightSubstrings(characters, forms) {
	util.arrayForEach(characters, function(character, index) {
		var form = '';
		for (var i = 0; i <= index; i++) {
			form = form + characters[i];
		}
		forms.push(form);
	});
}

function addEllipsesToForms(forms) {
	util.arrayForEach(forms, function(form, index, forms){
		forms[index] = form + '...';
	});
}