reg_state = 0;
regDep = new Tracker.Dependency;

Template.registration.helpers({
	basic: function() {
		regDep.depend();
		if (reg_state==0){
			return true;
		}
		else {
			return false;
		};
	},

	risk: function() {
		regDep.depend();
		if (reg_state==1){
			return true;
		}
		else {
			return false;
		};
	},

	goal: function() {
		regDep.depend();
		if (reg_state==2){
			return true;
		}
		else {
			return false;
		};
	},

});

Template.registration.events({
	"click .next": function() {
		reg_state += 1;
		regDep.changed();
	},
})

Template.basic_info.events({
	"submit .basic_info": function(event) {
      	event.preventDefault();

      	var gender = event.target.gender.value;
      	var income = event.target.income.value;
      	var expenditure = event.target.expenditure.value;
      	var deposit = event.target.deposit.value;
      	var increment = event.target.increment.value;

      	Meteor.users.update(Meteor.userId(), {$set: {
      		"profile.gender": gender,
      		"profile.income": income,
      		"profile.expenditure": expenditure,
      		"profile.amount": deposit,
      		"profile.increment": increment,
      	}});

      	reg_state += 1;
		regDep.changed();

		return false;
	},
});