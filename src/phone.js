var Phone = Backbone.Model.extend({
	defaults:{
		phone: ''
	}
});

var PhoneList = Backbone.Collection.extend({
	model: Phone
});

var PhoneView = Backbone.View.extend({
	el : $('#PhoneView'),
	events:{
		'click button#getPhoneResults' : 'getResults'
	},
	initialize : function(){
		_.bindAll(this, 'render', 'getResults');
		this.collection = new PhoneList();
		this.render();
	},
	render : function(){

		var phoneForm = $('#PhoneForm').html();
		$(this.el).append(phoneForm);
	},

	getResults : function(){

		var a = $('input[name="area-code"]').val();
		var b = $('input[name="phone-a"]').val();
		var c = $('input[name="phone-b"]').val();

		var p1 = "("+a+") "+b+"-"+c;
		var p2 = a+b+c;
		var p3 = a+" "+b+" "+c;
		var p4 = a+"-"+b+"-"+c;
		var p5 = a+"."+b+"."+c;
		var p6 = "("+a+") "+b+c;

		var pArray = [p1,p2,p3,p4,p5,p6];

		for(var i=0;i<pArray.length;i++){
			var phone = new Phone();
			phone.set({
				phone : pArray[i]
			});

			this.collection.add(phone);
		}

		var phoneResultList = new PhoneListView({
			collection : this.collection
		});
	}
});

var PhoneListView = Backbone.View.extend({
	el : $('#PhoneResult'),
	initialize : function(){
		_.bindAll(this, 'render');
		this.render();
	},
	render : function(){
		_(this.collection.models).each(function(phone){ // in case collection is not empty

        	var phoneResultView = new PhoneEntryView({
        		model : phone
        	});
        	$(this.el).append(phoneResultView.render().el);

      	}, this);

	}
});

var PhoneEntryView = Backbone.View.extend({
	template : _.template($('#PhoneResultEntry').html()),
	initialize: function(){
		_.bindAll(this, 'render');
	},
	render: function(){
		$(this.el).html(this.template(this.model.toJSON()));
		return this;
	}
});

var phoneView = new PhoneView();