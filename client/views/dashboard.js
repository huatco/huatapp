/*
TODO
1. sort the list according to priority
2. only show top 3;
*/
Goals = new Mongo.Collection("goals");

// Template.myReveal.onRendered(function () {
//   this.myRevealInstance = new Foundation.Reveal($('#myReveal'));
// });

// Template.myReveal.onDestroyed(function () {
//   let reveal = this.myRevealInstance;
//   if (reveal) {
//     reveal.destroy();
//   }
// });

Template.dashboard.helpers({
	username: function () {
		if(!Meteor.user().profile || Meteor.user().profile.account_status < 3)
            document.location.href = '/registration'; 
		return Meteor.user() && Meteor.user().username;
	}, 
    goals: function () {
		var this_user = Meteor.user().username;
    	return Goals.find({user: this_user}, {sort: {progress: -1}, limit:3});
    }
});

Template.goalchart.onCreated(function(){
	this.goal = this.data._id;
});

Template.goalchart.onRendered( function() {
	var value = this.goal;
	console.log(value);
	drawChart(value);

	if(!Meteor.user().profile || Meteor.user().profile.account_status<3)
		document.location.href = '/registration'; 
		
});


function drawChart(goalid){
	var goal = Goals.findOne({_id: goalid});
	var prog = goal.current_amount;
	var amt = +(goal.target_amount);
	console.log(goal);
  	var data = [
	    {
	        value: prog,
	        color:"#e50b4f",
	        highlight: "#e50b4f",
	        label: "Current Value"
	    },
	    {
	        value: amt,
	        color: "#ccc",
	        highlight: "#ccc",
	        label: "Remaining Value"
	    }
	]

	var ctx = document.getElementById(goalid).getContext("2d");
	var myNewChart = new Chart(ctx);

	new Chart(ctx).Doughnut(data);
};




