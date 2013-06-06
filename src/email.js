

var Email = Backbone.Model.extend({
	defaults:{
		email: ''
	}
});

var EmailList = Backbone.Collection.extend({
	model: Email
});


var EmailView = Backbone.View.extend({
	el : $('#EmailView'),
	events:{
		'click button#getEmailResults' : 'getEmailResults'
	},

	initialize : function(){
		_.bindAll(this, 'render', 'getEmailResults');

		this.collection = new EmailList();

		this.render();

	},
	render : function(){

		var emailForm = $("#EmailForm").html();

		$(this.el).append(emailForm);

	},
	getEmailResults : function(){
		var email = $('input[name="email"]').val();

		var none = 		email+'@';
		var gmail = 	email+'@gmail.com';
		var aol = 		email+'@aol.com';
		var yahoo = 	email+'@yahoo.com';
		var hotmail = 	email+'@hotmail.com';
		var me = 		email+'@me.com';
		var fox = 		email+'@fox.com';
		var msn = 		email+'@msn.com';
		var comcast = 	email+'@comcast.net';
		var verizon = 	email+'@verizon.net';

		emailArray = [];

		emailArray.push(email);
		emailArray.push(none);
		emailArray.push(gmail);
		emailArray.push(aol);
		emailArray.push(yahoo);
		emailArray.push(hotmail);
		emailArray.push(me);
		emailArray.push(fox);
		emailArray.push(msn);
		emailArray.push(comcast);
		emailArray.push(verizon);

		for(var i=0; i<emailArray.length;i++){
			var email = new Email();
			email.set({
				email : emailArray[i]
			});

			this.collection.add(email);

		}

		var emailResultList = new EmailResultListView({
			collection :  this.collection
		});
	}
});

var emailView = new EmailView();

var EmailResultListView = Backbone.View.extend({
	el : $('#EmailResult'),
	initialize : function(){
		_.bindAll(this, 'render');

		this.render();
	}, 
	render : function(){
		_(this.collection.models).each(function(email){ // in case collection is not empty

        	var emailResultView = new EmailResultView({
        		model : email
        	});
        	$(this.el).append(emailResultView.render().el);

      }, this);

	}


});

var EmailResultView = Backbone.View.extend({

	template : _.template($('#EmailResultEntry').html()),
	initialize: function(){
		_.bindAll(this, 'render');
	},
	render: function(){
		$(this.el).html(this.template(this.model.toJSON()));
		return this;
	}

});

