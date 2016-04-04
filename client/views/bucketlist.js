if (Meteor.isClient) {
	//Meteor.call("call_python", function(error) {});
  // This code only runs on the client
  //Meteor.call("call_python", function(error) {});
 Template.bucketlist.helpers({
    goals: function () {
    	var this_user = Meteor.user() ? Meteor.user().username : "test_user1";
    	return Goals.find({user: this_user});
    },

    progress_percent: function(goalid) {
    	var goal = Goals.findOne({_id: goalid});
    	return +(goal.progress)*100;
    },

    format_date: function(goalid) {
    	var goal = Goals.findOne({_id: goalid});
    	var date = goal.createdAt.toDateString();
    	return date;
    },
  });
}

