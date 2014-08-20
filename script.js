$(document).ready(function(){

var Generator = function(){
	this.init();
	return this;
};

Generator.prototype.init = function(){

	this.container = $('body');

	this
		.initTemplater();

	return this;
};

// Set up input box
Generator.prototype.initTemplater = function(){

	$(this.templates.input)
		.keyup(this.handler.bind(this))
		.appendTo(this.container);

	return this;
};

// Handle keydown event
// TODO: http://stackoverflow.com/questions/14508707/updating-an-inputs-value-without-losing-cursor-position
Generator.prototype.handler = function(evt){

	var input     = evt.target,
		$input    = $(input),
		text      = $input.text(),
		regex     = new RegExp('{{(.+?)}}', 'g'),
		matches   = text.match(regex),
		selection = window.getSelection(),
		range     = selection.getRangeAt(0);

	console.log(range);
	for (var i in matches){
		var match = matches[i];

		text = text.replace(match, '<span class="highlight">' + match + '</span>');
	}

	$input.html(text);
	console.log(range);
	window.getSelection().addRange(range);

};

Generator.prototype.templates = {
	input : '<div class="fake-input" contentEditable />',

};

new Generator();

});
