Template.profile.helpers({
	// var userId = Meteor.userId();
	username: function () {
 		return Meteor.user() && Meteor.user().username;
  	},
  	email: function () {
 		return Meteor.user().emails[0].address;
  	},  
  	balance: function () {
 		return Meteor.user().profile.amount;
  	},
  	increment: function () {
 		return Meteor.user().profile.increment;
  	}, 
});

Template.profile.events({
	"click .increase": function() {
		var current = +(Meteor.user().profile.amount);
		var amt = +(Meteor.user().profile.increment);
		var newval = current+amt;
		Meteor.users.update(Meteor.userId(), {$set: {"profile.amount": newval}});
		console.log("clicked");
	},
	"click .decrease": function() {
		var current = +(Meteor.user().profile.amount);
		var amt = +(Meteor.user().profile.increment);
		var newval = current-amt;
		Meteor.users.update(Meteor.userId(), {$set: {"profile.amount": newval}});
		console.log("clicked");
	}
});