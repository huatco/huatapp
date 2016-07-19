Session.set({ "reg_state": 0 });
regDep = new Tracker.Dependency;

Template.registration.helpers({
	basic: function () {
		Meteor.call("update_beta");
		regDep.depend();
		if (!Meteor.user().profile) return true;
		if (Meteor.user()['profile']['account_status'])
			Session.set("reg_state", Meteor.user()['profile']['account_status']);
		else return true;
		if (Session.get("reg_state") == 0) {
			console.log("basic");
			return true;
		} console.log(this);
		return false;
	},
	goal_item: function () {
    	return { goal: "A goal which enriches your life", _id: "" };
  	},
	risk: function() {
		regDep.depend();
		if (Meteor.user()['profile']['account_status'])
			Session.set("reg_state", Meteor.user()['profile']['account_status']);	
		if (Session.get("reg_state") == 1) {
			console.log("risk");
			return true;
		} return false;
	},
	done: function () {
		regDep.depend();
		if (Meteor.user()['profile']['account_status'])
			Session.set("reg_state", Meteor.user()['profile']['account_status']);	
		if (Session.get("reg_state") == 2) {
			if (Goals.find({ user: Meteor.user().username }).count() > 0) {
				Session.set("reg_state", 3); 
									Meteor.users.update(Meteor.userId(), {$set: {
						"profile.account_status": 3
					}});
				return true;
			}
		}
		if (Session.get("reg_state") == 3) {
			console.log("done");
			return true;
		} return false;
	}, 
	goal: function() {
		regDep.depend();
		if (Meteor.user()['profile']['account_status'])
			Session.set("reg_state", Meteor.user()['profile']['account_status']);	
		if (Session.get("reg_state") == 2) {
			if (Goals.find({ user: Meteor.user().username }).count() > 0) {
				Session.set("reg_state", 3); 
					Meteor.users.update(Meteor.userId(), {$set: {
						"profile.account_status": 3
					}});
				return false;
			}
			console.log("goal");
			return true;
		} return false;
	},

});

Template.registration.events({
	"click #dashboard": function (e) {
		document.location.href = '/'; 
	}
});

Template.basic_info.events({
	"submit .basic_info": function(event) {
      	event.preventDefault();
			var age = event.target.age.value;
			var marital = event.target.age.value;
      	var gender = event.target.gender.value;
      	var income = event.target.income.value || 0.0;
      	var expenditure = event.target.expenditure.value || 0.0;
      	var deposit = event.target.deposit ? event.target.deposit.value : 0.0;
      	var increment = event.target.increment ? event.target.increment.value : 0.0;
      	var input_valid = true;
      	Meteor.users.update(Meteor.userId(), {$set: {
				"profile.gender": gender,
				"profile.marital": marital, 
				"profile.age": age, 
				"profile.income": income,
				"profile.expenditure": expenditure,
      		"profile.amount": deposit,
			"profile.increment": increment,
			"profile.account_status": 1
      	}});

		Session.set("reg_state", Session.get("reg_state") + 1);
		regDep.changed();

		return false;
	},
});