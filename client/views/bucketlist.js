if (Meteor.isClient) {
	//Meteor.call("call_python", function(error) {});
  // This code only runs on the client
 Template.bucketlist.helpers({
    goals: function () {
    	var this_user = Meteor.user() ? Meteor.user().username : "test_user1";
    	return Goals.find({user: this_user});
    }
  });
}

