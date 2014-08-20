$(document).ready(function(){

var Generator = function(){
	this.init();
	return this;
};

Generator.prototype.init = function(){

	this.container = $('body');
	this.matches   = [];
	this.index     = {};

	this
		.initTemplater()
		.initButtons();

	return this;
};

// Set up input box
Generator.prototype.initTemplater = function(){

	this.templater = $(this.templates.input)
		.keyup(this.handler.bind(this))
		.text('<x> bottles of beer on the wall')
		.appendTo(this.container)
		.trigger('keyup');

	return this;
};

Generator.prototype.initButtons = function(){

	this.templater
		.after(
			$(this.templates.submit)
				.click(handle.bind(this))
		);

	function handle(evt){
		evt.preventDefault();

		var obj = {};
		for (var prop in this.index){
			if (this.index.hasOwnProperty(prop)){
				obj[prop] = this.index[prop]
					.find('textarea')
					.val()
					.split(',');
			}
		}

		this.submit({data : obj});
	}

	return this;
};

Generator.prototype.defaults = {
	google: "https://www.google.com/search?q=",
	sieve:  "http://sieve.alexose.com?callback=?"
};

Generator.prototype.submit = function(obj){

	var term = this.templater.text()
		.replace(/ /g, '+') // replace spaces with pluses
		.replace('<', '{{') // replace carats with handlebars-esque delimiters
		.replace('>', '}}');

	obj.url = this.defaults.google + term;
	obj.selector = '$("body div#resultStats").text()';
	obj.engine = 'jquery';

	var json = btoa(JSON.stringify(obj));

	$.ajax({
		url : this.defaults.sieve,
		data : {json : json},
		dataType : "jsonp",
		success : function(result){
			console.log(result);
		}
	});
};

// Handle keydown event
// TODO: http://stackoverflow.com/questions/14508707/updating-an-inputs-value-without-losing-cursor-position
Generator.prototype.handler = function(evt){

	var input     = evt.target,
		$input    = $(input),
		text      = $input.text(),
		regex     = new RegExp('<(.+?)>', 'g'),
		matches   = text.match(regex) || [];

	var enter  = [],
		exit   = [],
		update = [];

	matches = matches.map(strip);

	matches.forEach(function(match){
		if ($.inArray(match, this.matches) === -1){
			enter.push(match);
		} else {
			update.push(match);
		}
	}.bind(this));

	this.matches.forEach(function(match){
		if ($.inArray(match, matches) === -1){
			exit.push(match);
		}
	});

	this.add(enter);
	this.hide(exit);

	this.matches = matches;

	function strip(str){
		return str.substr(1,str.length-2);
	}
};

// Add or show textareas
Generator.prototype.add = function(arr){

	arr.forEach(function(str){
		var el = this.index[str];
		if (!el){
			el = this.index[str] = $(
					this.templates.textarea
						.replace('{{title}}', str)
				)
				.hide()
				.appendTo(this.container);
		}

		el.fadeIn();

	}.bind(this));
};

// Hide textareas
Generator.prototype.hide = function(arr){

	arr.forEach(function(str){
		this.index[str].fadeOut();
	}.bind(this));
};

Generator.prototype.templates = {
	input:    '<div class="fake-input" contentEditable />',
	textarea: '<div class="dynamic-textarea"><h3>{{title}}</h3><textarea></textarea></div>',
	submit:   '<div class="fake-submit">Search Google</div>'
};

new Generator();

});
