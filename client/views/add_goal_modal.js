var currentSection = 1;
var goalAddDep = new Tracker.Dependency;
var categoryDep = new Tracker.Dependency;
Template.add_goal_modal.onRendered(function (gg) {
	var id = this.data.gg._id;
	$(window).on('closed.zf.reveal', function (sth) { 
    	currentSection = 1;
    	goalAddDep.changed();
    });
    $('#tags').tagsInput({
    	'width':'100%',
    	'placeholderColor': '#e50b4f',
    	'defaultText':'Add a Tag'
    });
    var name = '#add_goal_modal' + id;
    this.myRevealInstance = new Foundation.Reveal($(name));
    //this.dataslider = new Foundation.Slider($('.slider'));
});

Template.add_goal_modal.onDestroyed(function () {
	//this.myRevealInstance.stop();
	Session.set("modal", false)
	/*
  let reveal = this.myRevealInstance;
  if (reveal) {
    reveal.destroy();
  }*/
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
	},
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
	},

	isChecked: function(val) {
		categoryDep.depend();
		currentVal = $("form input[type='radio']:checked").val();
		if (val == currentVal){
			return "active";
		}else {
			return null;
		}
	},

	predefinedTags: function(gg){
		categoryDep.depend();
		$(".tags").importTags('');
		var category = $("form input[type='radio']:checked").val();
		var tag = ".tags";
		if (category=="Life"){
			$(tag).importTags("life,shopping,leisure,staycation,party");
		}
		else if (category=='Education'){
			$(tag).importTags("education,graduation,college,post-graduation");
		}
		else if (category=='Fitness'){
			$(tag).importTags("fitness,health,gym,cross fitness,martial arts,kickboxing, marathon");
		}
		else if (category=='Travel'){
			$(tag).importTags("travel,holiday,exploration,backpacking,sightseeing,adventure");
		}
		else if (category=='Milestone'){
			$(tag).importTags("milestone,retirement,career,marriage,migration,house");
		}
		else if (category=='Hobbies'){
			$(tag).importTags("hobbies,guitar,soccer,robotics,coding");
		}
		else {
			return "";
		}
	}

});

Template.goal_modal.events({
	"click .goal_category": function(){
		categoryDep.changed();
	},

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
			var username = Meteor.user().username;
			var title = event.target.form[8].value;
			var desc = event.target.form[9].value;
			var category = $("form input[type='radio']:checked").val();
			var month = event.target.form[12].value;
			var target_amt = event.target.form[11].value;
			var year = event.target.form[13].value;
			var priority = $("#points")[0].value;
			var tags = event.target.form[16].value.split(",");
			var time_stamp = new Date();
			if(Goals.find({user:username, title:title}).count()==0){
	      Goals.insert({ 
	      	title: title,
	        time_stamp: time_stamp, 
	        created_year: time_stamp.getYear(),
	        created_month: time_stamp.getMonth(),   
	        goal_month: month,
	        goal_year: year, 
	        priority: priority, 
	        target_amount: target_amt, 
	        current_amount: 0.0, 
	        progress: 0,
	        category: category,
	        user: Meteor.user().username, 
	        details: desc,
	        current_time: 0,
	        keywords: tags 
	      }); 
	      console.log("Added a goal", title);
	      Meteor.call("call_python", function(error) {});
	      alert("Goal Added! " + title)
	    }else{
	    	alert("goal repeated! ")
	    }
     
      if (reg_state==2){
        reg_state+=1;
        regDep.changed();
      }else {
        document.location.href = '/bucketlist';

      }
		}
	},

});


