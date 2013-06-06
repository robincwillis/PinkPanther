var states = [
    {label: "Alabama",value: "AL"},
    {label: "Alaska",value: "AK"},
    {label: "American Samoa",value: "AS"},
    {label: "Arizona",value: "AZ"},
    {label: "Arkansas",value: "AR"},
    {label: "California",value: "CA"},
    {label: "Colorado",value: "CO"},
    {label: "Connecticut",value: "CT"},
    {label: "Delaware",value: "DE"},
    {label: "District Of Columbia",value: "DC"},
    {label: "Federated States Of Micronesia",value: "FM"},
    {label: "Florida",value: "FL"},
    {label: "Georgia",value: "GA"},
    {label: "Guam",value: "GU"},
    {label: "Hawaii",value: "HI"},
    {label: "Idaho",value: "ID"},
    {label: "Illinois",value: "IL"},
    {label: "Indiana",value: "IN"},
    {label: "Iowa",value: "IA"},
    {label: "Kansas",value: "KS"},
    {label: "Kentucky",value: "KY"},
    {label: "Louisiana",value: "LA"},
    {label: "Maine",value: "ME"},
    {label: "Marshall Islands",value: "MH"},
    {label: "Maryland",value: "MD"},
    {label: "Massachusetts",value: "MA"},
    {label: "Michigan",value: "MI"},
    {label: "Minnesota",value: "MN"},
    {label: "Mississippi",value: "MS"},
    {label: "Missouri",value: "MO"},
    {label: "Montana",value: "MT"},
    {label: "Nebraska",value: "NE"},
    {label: "Nevada",value: "NV"},
    {label: "New Hampshire",value: "NH"},
    {label: "New Jersey",value: "NJ"},
    {label: "New Mexico",value: "NM"},
    {label: "New York",value: "NY"},
    {label: "North Carolina",value: "NC"},
    {label: "North Dakota",value: "ND"},
    {label: "Northern Mariana Islands",value: "MP"},
    {label: "Ohio",value: "OH"},
    {label: "Oklahoma",value: "OK"},
    {label: "Oregon",value: "OR"},
    {label: "Palau",value: "PW"},
    {label: "Pennsylvania",value: "PA"},
    {label: "Puerto Rico",value: "PR"},
    {label: "Rhode Island",value: "RI"},
    {label: "South Carolina",value: "SC"},
    {label: "South Dakota",value: "SD"},
    {label: "Tennessee",value: "TN"},
    {label: "Texas",value: "TX"},
    {label: "Utah",value: "UT"},
    {label: "Vermont",value: "VT"},
    {label: "Virgin Islands",value: "VI"},
    {label: "Virginia",value: "VA"},
    {label: "Washington",value: "WA"},
    {label: "West Virginia",value: "WV"},
    {label: "Wisconsin",value: "WI"},
    {label: "Wyoming",value: "WY" }
]

var directions = [
	{label:"N", value: "North"},
	{label:"E", value: "East"},
	{label:"S", value: "South"},
	{label:"W", value: "West"}
]

var types = [
	{value:"Boulevard",label: "Blvd"},
	{value:"Street",label: "St"},
	{value:"Drive",label: "Dr"},
	{value:"Road",label: "Rd"},
	{value:"Place",label: "Pl"},
	{value:"Square",label: "Sq"},
	{value:"Parkway",label: "Pkwy"}
]



 var Address = Backbone.Model.extend({
 	defaults:{
 		address: ''
 	}
 });

var AddressList = Backbone.Collection.extend({
	model: Address
});

 var AddressView = Backbone.View.extend({
 	el: $('#AddressView'),
 	events: {
 		'click button#getAddressResults' : 'getResults'
 	},
 	initialize: function(){
 		_.bindAll(this, 'render', 'getResults');

 		this.collection = new AddressList();
 		this.usState = {value:'',label:''};
 		this.render();
 	},
 	render: function(){

 		var addressForm = $('#AddressForm').html();
 		$(this.el).append(addressForm);
 		var a = this.usState;

 		 $( "#state" ).autocomplete({
		      source: states,
		      autoFocus: true,
		      select: function( event, ui ) {
		      	a.label = ui.item.label
		      	a.value = ui.item.value
		      	console.log(a.label+" "+a.value);
		      }
		  });
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
 	getResults: function(){
 		

 		var dir1 = $('select[name="direction"]').val();
		var dir2 = '';
 		_.each(directions, function(direction){

 			if(direction.label === dir1){
 				dir2 = direction.value;
 			}	
 		});
	
 		var add = $('input[name="address"]').val();
 		var str = $('input[name="street"]').val();
        var cty = $('intput[name="city"]').val();
 		var typ1 = $('select[name="type"]').val();
 		var typ2 = '';
 		_.each(types, function(type){
 			if(type.label === typ1){
 				typ2 = type.value;
 			}	
 		});
 		
 		var st1 = this.usState.label;
 		var st2 = this.usState.value
 		
 		var addressInput = [];
 		if(add !== ""){
 			addressInput.push([add,add]);
 		}
 		if(dir1 !== ""){
 			addressInput.push([dir1,dir2]);	
 		}
 		if(str !== ""){
 			addressInput.push([str,str]);
 		}
        if(cty !== ""){
            addressInput.push([cty,cty]);
        }
        
 		if(typ1 !== ""){
 			addressInput.push([typ1,typ2]);
 		}
 		if(st1 !== ""){
 			addressInput.push([st1,st2]);
 		}

		

 		var aResult = this.getCombinations([],[],addressInput);

 		var aResultString = [];

 		for(var i=0;i<aResult.length;i++){
 			var resultString = aResult[i].join(" ");
 			resultString = '"'+resultString+'"';
 			aResultString.push(resultString);
 		}

 		var finalResult = _.uniq(aResultString, false);


 		for(var i=0;i<finalResult.length;i++){
 			var address = new Address();

 			address.set({
 				address : finalResult[i]
 			});
 			
 			this.collection.add(address);
 		}
 		var addressResultList = new AddressResultView({
 			collection : this.collection
 		});

 	}
 })

 var AddressResultView = Backbone.View.extend({
 	el: $('#AddressResult'),
 	initialize : function(){
 		_.bindAll(this, 'render');
 		this.render();
 	},
 	render : function(){

 		_(this.collection.models).each(function(address){
 			
 			addressResultEntry = new AddressResultEntry({
 				model : address
 			});
 			$(this.el).append(addressResultEntry.render().el);

 		}, this);
 	}
 });

 var AddressResultEntry = Backbone.View.extend({
 	template : _.template($('#AddressResultEntry').html()),
 	initialize: function(){
		_.bindAll(this, 'render');
	},
	render: function(){
		$(this.el).html(this.template(this.model.toJSON()));
		return this;
	}
 });

 var addressView = new AddressView();

// var client = new XMLHttpRequest();
//   client.open("GET", "http://zip.elevenbasetwo.com/v2/US/48867", true);
//   client.onreadystatechange = function() {
//     if(client.readyState == 4) {
//     alert(client.responseText);
//     };
//   };
    

//   client.send();