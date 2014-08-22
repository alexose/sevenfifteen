$(document).ready(function(){

var Generator = function(){
    this.init();
    return this;
};

Generator.prototype.init = function(){

    this.container = $('#main');
    this.matches   = [];
    this.index     = {};

    this
        .initSieve()
        .initTemplater()
        .initButtons();

    return this;
};

// Connect to Sieve
Generator.prototype.initSieve = function(){

    var server = 'ws://sieve.alexose.com:8082/',
        ws     = new WebSocket(server);

    ws.onmessage = function(event){

        var str = event.data;

        if (!str){
            return;
        }

        data = JSON.parse(str).data;

        if (data){
            this.display(data);
        }

    }.bind(this);

    this.ws = ws;

    return this;
};

Generator.prototype.display = function(){
};

// Set up input box
Generator.prototype.initTemplater = function(){


    this.preview = $(this.templates.preview)
        .appendTo(this.container);

    this.templater = $(this.templates.input)
        .keyup(this.handler.bind(this))
        .text('<x> bottles of beer on the wall')
        .prependTo(this.container)
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

    var str = JSON.stringify(obj);
    this.ws.send(str);

};

// Handle keyup event
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

// Generate all permutations
Generator.prototype.update = function(evt){

    var titles = [],
        arrays = [],
        template = this.templater.text();

    for (var prop in this.index){
        if (this.index.hasOwnProperty(prop)){
            arrays.push(
                this.index[prop]
                    .find('textarea')
                    .val()
                    .split(',')
            );

            titles.push(prop);
        }
    }

    var permutation = permutations(obj);

    function permutations(titles, arrays){
        var obj = {};

        (function recurse(arr){
            for (var i in arr){
                var subarray = arr[i],
                    title = titles[i],
                    temp = [];

            }
        })(arrays);
    }

    console.log(combinations);
    this.preview.text();
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
                .keyup(this.update.bind(this))
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
    submit:   '<div class="fake-submit">Search Google</div>',
    preview:   '<span class="preview" />'
};

new Generator();

});

// Via http://stackoverflow.com/questions/4331092
function allPossibleCases(arr) {
  if (arr.length == 1) {
    return arr[0];
  } else {
    var result = [];
    var allCasesOfRest = allPossibleCases(arr.slice(1));  // recur with the rest of array
    for (var i = 0; i < allCasesOfRest.length; i++) {
      for (var j = 0; j < arr[0].length; j++) {
        result.push(arr[0][j] + allCasesOfRest[i]);
      }
    }
    return result;
  }

}
