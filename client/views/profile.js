Template.profile.helpers({
	// var userId = Meteor.userId();
  username: function () {
    if(!Meteor.user() || !Meteor.user().profile || Meteor.user().profile.account_status < 3)
            document.location.href = '/registration'; 
 		return Meteor.user() && Meteor.user().username;
  	},
  	email: function () {
 		return Meteor.user().emails[0].address;
  	},  
    gender: function() {
      return Meteor.user().profile.gender;
    },
    age: function() {
      return Meteor.user().profile.age;
    },
  	balance: function () {
 		 var amt = Meteor.user().profile.amount;
     return parseFloat(Math.round(amt * 100) / 100).toFixed(2);
  	},
  	monthlyAmt: function() {
      var amt = Meteor.user().profile.monthly_require;
      return parseFloat(Math.round(amt * 100) / 100).toFixed(2);
    },
    targetAmt: function() {
      var amt = Meteor.user().profile.total_require;
      return parseFloat(Math.round(amt * 100) / 100).toFixed(2);
    },
    income: function() {
      var amt = Meteor.user().profile.income;
      return parseFloat(Math.round(amt * 100) / 100).toFixed(2);
    },
    expenditure: function() {
      var amt = Meteor.user().profile.expenditure;
      return parseFloat(Math.round(amt * 100) / 100).toFixed(2);
    },
    riskscore: function() {
      var amt = Meteor.user().profile.riskscore;
      return amt;
    },
});

Template.profile.events({
	"click .increase": function() {
		var current = +(Meteor.user().profile.amount);
		var amt = +(Meteor.user().profile.increment);
		var newval = current+amt;
		Meteor.users.update(Meteor.userId(), {$set: {"profile.amount": newval}});
    Meteor.call("call_python", function(error) {});
	},
	"click .decrease": function() {
		var current = +(Meteor.user().profile.amount);
		var amt = +(Meteor.user().profile.increment);
		var newval = current-amt;
		Meteor.users.update(Meteor.userId(), {$set: {"profile.amount": newval}});
    Meteor.call("call_python", function(error) {});
	}
});