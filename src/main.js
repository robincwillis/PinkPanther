//Models
var Result = Backbone.Model.extend({
	defaults:{
	result: ''
	}
});

var Name = Backbone.Model.extend({
	defaults:{
		firstName: '',
		middleName: '',
		lastName: '',
		honorific: '',
		suffix: '',
		keyword1: '',
		keyword2: ''
	}
});

//Collections

var NameList = Backbone.Collection.extend({
	model: Name
});

var ResultList = Backbone.Collection.extend({
	model: NameResult
});

var resultList = new ResultList();

//Views

var NameView = Backbone.View.extend({
	el: $('#NameView'), 
	events:{
		'click button#addName' : 'addName',
		'click button#getNameResults' : 'getResults',
		//'click button#clearNameResults' : 'clearResults'

	},
	initialize: function(){
		_.bindAll(this, 'render','addName', 'addNameEntry', 'getResults', 'clearResults');

		this.collection = new NameList();
		this.collection.bind('add', this.addNameEntry);

		this.counter = 0;
		this.render();
	},
	render:function(){

		var nameForm = $("#NameForm").html();
		$(this.el).append(nameForm);

		_(this.collection.models).each(function(name){ // in case collection is not empty
	        self.addNameEntry(name);
	      }, this);

	},

	addName: function(){

		var name = new Name();
		name.set({
			firstName: 		$('input[name="firstName"]').val(),
			middleName : 	$('input[name="middleName"]').val(),
			lastName: 		$('input[name="lastName"]').val(),
			honorific : 	$('select[name="honorific"]').val(),
			suffix : 		$('select[name="suffix"]').val(),
			keyword1 : 		$('input[name="keyword1"]').val(),
			keyword2 : 		$('input[name="keyword2"]').val()
		});
		this.collection.add(name);
	},

	addNameEntry: function(name){

		var nameEntryView = new NameEntryView({
			model : name
		});
		$('#NameEntries').append(nameEntryView.render().el);

	}, 

	getCombinations: function(result, base, sets){
		
		if(sets.length === 0) {
			
        	result.push(base);
        	return;
	    }
	    sets = sets.slice();

	    var choices = sets.shift();
	    
	    for (var i = 0; i < choices.length; i += 1) {
	        var b2 = base.slice();
	        b2.push(choices[i]);
	        this.getCombinations(result, b2, sets);
	    }
	    return result;
	},

	getAllCombinations : function(a, min){
		var fn = function(n, src, got, all) {
	        if (n == 0) {
	            if (got.length > 0) {
	                all[all.length] = got;
	            }
	            return;
	        }
	        for (var j = 0; j < src.length; j++) {
	            fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
	        }
	        return;
	    }
	    var all = [];
	    for (var i = min; i < a.length; i++) {
	        fn(i, a, [], all);
	    }
	    all.push(a);
	    return all;
	},
	getResults2: function(){

	

		var nameInput = [];

		this.collection.each(function(name){
			if(name.get("honorific") !== ""){
			//	nameInput.push(name.get("honorific"));
			}
			if(name.get("firstName") !== ""){
				nameInput.push(name.get("firstName"));
			}
			if(name.get("middleName") !== ""){
				nameInput.push(name.get("middleName"));
			}
			if(name.get("lastName") !== ""){
				nameInput.push(name.get("lastName"));
			}
			if(name.get("suffix") !== ""){
			//	nameInput.push(name.get("suffix"));
			}
		});
		console.log(nameInput.length);
		nameInput = _.uniq(nameInput);
		console.log(nameInput.length);
		var aResult = this.getAllCombinations(nameInput, 1);
		console.log(aResult);
	},
	getResults: function(){

	 var honorificArray = [];
	 var firstNameArray = [];
	 var middleNameArray = [];
	 var lastNameArray = [];
	 var suffixArray = [];
	 var keyword1Array = [];
	 var keyword2Array = [];

	this.collection.each(function(name){

		honorificArray.push(name.get("honorific"));
		firstNameArray.push(name.get("firstName"));
		middleNameArray.push(name.get("middleName"));
		lastNameArray.push(name.get("lastName"));
		suffixArray.push(name.get("suffix"));

		if(name.get("keyword1") !== ""){
			keyword1Array.push(name.get("keyword1"));	
		}
		if(name.get("keyword2") !== ""){
			keyword2Array.push(name.get("keyword2"));	
		}
	
	});

		if(firstNameArray.length > 0){
			firstNameArray.push("");
		}
		if(middleNameArray.length > 0){
			middleNameArray.push("");
		}
		if(lastNameArray.length > 0){
			lastNameArray.push("");
		}
		if(honorificArray.length > 0){
			honorificArray.push("");
		}
		if(suffixArray.length > 0){
			suffixArray.push("");
		}

		var nameInput = [];
		nameInput.push(honorificArray);
		nameInput.push(firstNameArray);
		nameInput.push(middleNameArray);
		nameInput.push(lastNameArray);
		nameInput.push(suffixArray);
		var nResult = this.getCombinations([],[],nameInput);
		
		var nJoined = [];

		for(i=0;i<nResult.length;i++){
			var s =  nResult[i].join(" ");
			s = '"'+s+'"';
			if(s !== " "){
				nJoined.push(s);
			}
			
		}

		nJoined = _.uniq(nJoined);
		
	 if(keyword1Array.length > 0 || keyword2Array.length > 0){
		
		var keywordInput = [];
		keywordInput.push(keyword1Array);
		keywordInput.push(keyword2Array);
		var kResult = this.getCombinations([],[],keywordInput);
		var kJoined = [];
		
		//joining names into string
		
		for(i=0;i<kResult.length;i++){
			
			kResult[i] = '"'+kResult[i]+'"';

			var s = kResult[i].join(" ");
			
			kJoined.push(s);
		}

		var combName = [];


		 	for(var j=0;j<kJoined.length; j++){
				
		 		var curKey = kJoined[j];
				
		 		for(var i=0;i<nJoined.length; i++){
					var name = nJoined[i];
					name = name + " " + curKey;
					combName.push(name);

		 		}
			
	 		}
			
 			for(var j=0;j<keywordInput.length; j++){
				var curKey = keywordInput[j];
				
				//console.log(curKey);
				//curKey = '"'+curKey+'"';

		 		for(var i=0;i<nJoined.length; i++){
					var name = nJoined[i];
					name = name + " " + curKey;
					combName.push(name);

		 		}
	 		}
		}

		nJoined = nJoined.concat(combName);

		var finalResult = _.uniq(nJoined, false)
	
		

		for(i=0;i<finalResult.length;i++){

			var result = new Result();
			result.set({result:finalResult[i]})
			resultList.add(result)
		}

		var resultView = new ResultView({
			collection: resultList
		});
	}
});

var NameEntryView = Backbone.View.extend({

	
	template : _.template($('#NameEntry').html()),

	initialize: function(){
		_.bindAll(this, 'render');
	},
	render: function(){

		$(this.el).html(this.template(this.model.toJSON()));
		return this;
	}

});

var ResultView = Backbone.View.extend({
	el: $('#NameResult'),
	events:{
		'click #clearNameResults' : 'remove'
	},
	initialize: function(){
		

		_.bindAll(this, 'render', 'remove', 'unrender');
	
		this.render();
	},
	render : function(){

		

		_(this.collection.models).each(function(result){
			
			var resultEntryView = new ResultEntryView({
				model : result
			});
			$('#NameResult').append(resultEntryView.render().el);
		}, this);
	},
	remove : function(){

		var model;

		while (model = this.collection.pop()) {
		  model.destroy();
		}
		this.unrender();
	},

	unrender : function(){

		$(this.el).remove();
	}

});

var ResultEntryView = Backbone.View.extend({
	template : _.template($('#ResultEntry').html()),
	
	initialize: function(){
		_.bindAll(this, 'render', 'copyToClipboard');
	},
	render: function(){
		$(this.el).html(this.template(this.model.toJSON()));
		return this;

	}, 
	copyToClipboard: function(text){

	}
});

var nameView = new NameView();
