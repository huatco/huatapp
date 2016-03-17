/*
TODO
1. sort the list according to priority
2. only show top 3;
*/
Goals = new Mongo.Collection("goals");


Template.dashboard.helpers({
	username: function () {
		return Meteor.user() && Meteor.user().username;
	}, 
    goals: function () {
    	var this_user = Meteor.user() ? Meteor.user().username : "test_user1";
    	return Goals.find({user: this_user});
    }
});

Template.goalchart.onCreated(function(){
	this.goal = this.data._id;
});

Template.goalchart.onRendered( function() {
	var value = this.goal;
	console.log(value);
  	drawChart(value);
	
});

function drawChart(goalid){
	var goal = +(Goals.findOne({_id: goalid}).progress);
	console.log(goal);
  	var data = [
	    {
	        value: goal,
	        color:"#e50b4f",
	        highlight: "#e50b4f",
	        label: "Current Value"
	    },
	    {
	        value: 100 - goal,
	        color: "#ccc",
	        highlight: "#ccc",
	        label: "Remaining Value"
	    }
	]

	var ctx = document.getElementById(goalid).getContext("2d");
	var myNewChart = new Chart(ctx);

	new Chart(ctx).Pie(data);
}




