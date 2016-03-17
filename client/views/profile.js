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
  	expected: function() {
  		var goals = Goals.find({user: Meteor.user().username});
  		var amt = 0;
  		goals.forEach(function(goal){
  			console.log(goal.amount);
  			amt += +(goal.amount);
  		});
  		return amt;
  	},
});

Template.profile.events({
	"click .increase": function() {
		var current = +(Meteor.user().profile.amount);
		var amt = +(Meteor.user().profile.increment);
		var newval = current+amt;
		Meteor.users.update(Meteor.userId(), {$set: {"profile.amount": newval}});
	},
	"click .decrease": function() {
		var current = +(Meteor.user().profile.amount);
		var amt = +(Meteor.user().profile.increment);
		var newval = current-amt;
		Meteor.users.update(Meteor.userId(), {$set: {"profile.amount": newval}});
	}
});