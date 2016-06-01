var currentSection = 1;
var goalAddDep = new Tracker.Dependency;


Template.add_goal_modal.onRendered(function () {
	$(window).on('closed.zf.reveal', function () {
    	currentSection = 1;
    	goalAddDep.changed();
    });
    $('#tags').tagsInput({
    	'width':'100%',
    	'placeholderColor': '#e50b4f',
    	'defaultText':'Add a Tag'
    });
    this.myRevealInstance = new Foundation.Reveal($('#add_goal_modal'));
    this.dataslider = new Foundation.Slider($('.slider'));
});

Template.add_goal_modal.onDestroyed(function () {

  let reveal = this.myRevealInstance;
  if (reveal) {
    reveal.destroy();
  }
});

Template.add_goal_modal.helpers({

	sectionStatus: function(section) {
		goalAddDep.depend();
		if (section<currentSection) {
			return "done";
		} else if (section==currentSection) {
			return "active";
		} else {
			return null;
		}
	},

	statusIcon: function(section) {
		goalAddDep.depend();
		if (section<=currentSection){
			return "fa-circle";
		}else {
			return "fa-circle-o";
		}
	}
});

Template.goal_modal.helpers({
	isActive: function(section){
		goalAddDep.depend();
		if (section == currentSection){
			return "active";
		} else {
			return null;
		}
	},

	submitValue: function(){
		goalAddDep.depend();
		if(currentSection<4) {
			return "button";
		}else {
			return "submit";
		}
	}

});

Template.goal_modal.events({
	"click .previous": function(event, template){
		console.log("back button")
		currentSection -= 1;
		goalAddDep.changed();
	},
	"click .next": function(event, template){
		event.preventDefault();
		if (currentSection<4){
			currentSection += 1;
			goalAddDep.changed();	
		}else {
			var title = $('#title').val();
			var desc = $('#description').val();
			var category = $("form input[type='radio']:checked").val();
			var target_amt = $('#amount').val();
			var month = $('#month').val();
			var year = $('#year').val();
			var priority = $('#slider').attr('aria-valuenow');
			var tags = $('#tags').val();
			console.log(priority, tags);
		}
	},

});
