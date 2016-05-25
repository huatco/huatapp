Template.goal.helpers({
	createDate: function(timestamp) {
		var date = moment(timestamp).format("dddd, MMMM Do YYYY");
		return date;
	},

	targetDate: function(month, year) {
		console.log(month, year);
		var date = moment([year, month]);
		return date.format("MMMM YYYY");
	},
});

Template.goal.events({
	"click .bucketlist": function(event, template){
		Router.go('/bucketlist')
	}
});