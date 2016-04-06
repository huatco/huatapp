
if (Meteor.isClient) {
Template.portfolio.helpers({
	username: function () {
		return Meteor.user() && Meteor.user().username;
	}, 
    goals: function () {
    	var this_user = Meteor.user() ? Meteor.user().username : "test_user1";
    	return Goals.find({user: this_user});
    },
    amount: function(){
    	return Meteor.user()['profile']['amount'];
    },
    riskscore: function(){
        return Meteor.user()['profile']['riskscore'];
    },
});
}