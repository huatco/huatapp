Template.goal.helpers({
	createDate: function(timestamp) {
		var date = moment(timestamp).format("MMMM Do YYYY");
		return date;
	},

	targetDate: function(month, year) {
		var date = moment([year, month]);
		return date.format("MMMM YYYY");
	},
});

Template.goal.events({
	"click .bucketlist": function(event, template){
		Router.go('/bucketlist')
	},

	"click .delete_goal": function(event, template) {
        var goalid = template.data._id;
        Goals.remove(goalid);
        Meteor.call("call_python", function(error) {});
        Router.go('/bucketlist')
    },
});