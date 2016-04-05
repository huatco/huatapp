var reg_state = 0;
var regDep = new Tracker.Dependency;

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
		console.log(reg_state);
		regDep.changed();
	},
})