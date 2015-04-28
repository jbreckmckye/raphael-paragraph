module.exports = getBrokenForms;

function getBrokenForms(word) {
	var form, beforeBreak, afterBreak, breakPoint;
	var forms = [];

	var breakPoints = word.length - 1;
	for (var i = 0; i < breakPoints; i++) {
		breakPoint = i;
		beforeBreak = word.slice(0, breakPoint + 1);
		afterBreak = word.slice(breakPoint + 1)
		form = [beforeBreak, afterBreak];
		forms.push(form);
	}

	return forms;
}