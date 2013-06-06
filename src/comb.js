var Combo = Backbone.Model.extend({
	defaults:{
		combo: ''
	}
});

var ComboList = Backbone.Collection.extend({
	model: Combo
});

var ComboView = Backbone.View.extend({
	el : $('#ComboView'),
	events:{
		'click button#getNameAndNumber' : 'getNameAndNumber',
		'click button#getNameAndAddress' : 'getNameAndAddress'
	},
	initialize: function(){
		_.bindAll(this, 'render', 'getNameAndNumber' ,'getNameAndAddress');
		
		this.collection = new ComboList();

		this.render();

	},
	render : function(){

		var comboForm = $('#ComboForm').html();
		$(this.el).append(comboForm);

	},
	getCombinations : function(list) {
    var first = list[0];
    var rest = list.slice(1);

    if (first) {
        var output = [];

        if (rest.length > 0) {
            var prod_rest = this.getCombinations(rest);

            for (var i = 0; i < prod_rest.length; i++) {
                for (var j = 0; j < first.length; j++) {
                    output.push([first[j]].concat(prod_rest[i]));
                }
            }
        } else {
            for (var j = 0; j < first.length; j++) {
                output.push([first[j]]);
            }
        }

        return output;
    } else {
        return [];
    }
},
	getNameAndNumber : function(){
	
		var phoneList = [];
		var nameList = [];

		_(resultList.models).each(function(result){
			
			if(result.get('result') !== undefined){
				nameList.push(result.get('result'));
			}

			
		}, this);

		_(phoneView.collection.models).each(function(phone){
			phoneList.push(phone.get('phone'));
		}, this);

		var comboList = this.getCombinations([nameList, phoneList]);
		console.log(comboList);

		var comboStringList = [];

		for(var i=0;i<comboList.length;i++){
			var comboString = comboList[i].join(" ");
			comboStringList.push(comboString);
		}

		for(var i=0;i<comboStringList.length;i++){
			var combo = new Combo();
			combo.set({
				combo : comboStringList[i]
			});
			this.collection.add(combo);
		}

		console.log(this.collection);
		var comboResult = new ComboResultView({
			collection : this.collection
		});

	},
	getNameAndAddress : function(){
		
		var addressList = [];
		var nameList = [];

		_(resultList.models).each(function(result){
			
			if(result.get('result') !== undefined){
				nameList.push(result.get('result'));
			}

			
		}, this);

		_(addressView.collection.models).each(function(address){
			addressList.push(address.get('address'));
		}, this);

		var comboList = this.getCombinations([nameList, addressList]);

		var comboStringList = [];

		for(var i=0;i<comboList.length;i++){
			var comboString = comboList[i].join(" ");
			comboStringList.push(comboString);
		}

		for(var i=0;i<comboStringList.length;i++){
			var combo = new Combo();
			combo.set({
				combo : comboStringList[i]
			});
			this.collection.add(combo);
		}

		console.log(comboStringList);

		var comboResult = new ComboResultView({
			collection : this.collection
		});

	}

})


var ComboResultView = Backbone.View.extend({
	el : $('#ComboResult'),
	initialize : function(){
		_.bindAll(this, 'render');

		this.render();
	}, 
	render : function(){
	
		_(this.collection.models).each(function(combo){ // in case collection is not empty

        	var comboEntryView = new ComboEntryView({
        		model : combo
        	});
        	$(this.el).append(comboEntryView.render().el);

      }, this);
	}
});

var ComboEntryView = Backbone.View.extend({
	template : _.template($('#ComboResultEntry').html()),
	initialize: function(){
		_.bindAll(this, 'render');
	},
	render: function(){
		$(this.el).html(this.template(this.model.toJSON()));
		return this;
	}
});

var comboView = new ComboView();

