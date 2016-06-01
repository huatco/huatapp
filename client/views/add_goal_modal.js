var currentSection = 1;

Template.add_goal_modal.onRendered(function () {
  this.myRevealInstance = new Foundation.Reveal($('#add_goal_modal'));
});

Template.add_goal_modal.onDestroyed(function () {
  let reveal = this.myRevealInstance;
  if (reveal) {
    reveal.destroy();
  }
});


Template.goal_modal.helpers({
	isActive: function(section){
		if (section == currentSection){
			return "active";
		} else {
			return null;
		}
	},
});

Template.goal_modal.events({
	"click .next": function(event, template){
		console.log("clicked");
		currentSection += 1;
	},
});