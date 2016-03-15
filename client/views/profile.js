Template.profile.helpers({
	// var userId = Meteor.userId();
	username: function () {
 		return Meteor.user() && Meteor.user().username;
  	},
  	email: function () {
 		return Meteor.user().emails[0].address;
  	},  
  	balance: function () {
 		return Meteor.user().services.amount;
  	}, 
});