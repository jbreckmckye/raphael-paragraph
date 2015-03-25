(function(){
	if (typeof Raphael === 'undefined') {
		throw 'Raphael was undefined when the raphael-paragraph plugin was run. Did you include the files in the wrong order?';
	} else if (Raphael.fn.paragraph) {
		throw 'Raphael.fn.paragraph was already defined when the raphael-paragraph plugin was run.';
	} else {
		Raphael.fn.paragraph = paragraph;
	}

	function paragraph() {
		// stub function
	}

	// Hmm... how will I make this testable?


}());