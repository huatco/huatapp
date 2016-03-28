/*
TODO
1. sort the list according to priority
2. only show top 3;
*/
Goals = new Mongo.Collection("goals");

Template.myReveal.onRendered(function () {
  this.myRevealInstance = new Foundation.Reveal($('#myReveal'));
});

Template.myReveal.onDestroyed(function () {
  let reveal = this.myRevealInstance;
  if (reveal) {
    reveal.destroy();
  }
});

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
	var goal = Goals.findOne({_id: goalid});
	var prog = +(goal.progress);
	var amt = +(goal.amount);
	console.log(goal);
  	var data = [
	    {
	        value: (prog/100)*amt,
	        color:"#e50b4f",
	        highlight: "#e50b4f",
	        label: "Current Value"
	    },
	    {
	        value: ((100 - prog)/100)*amt,
	        color: "#ccc",
	        highlight: "#ccc",
	        label: "Remaining Value"
	    }
	]

	var ctx = document.getElementById(goalid).getContext("2d");
	var myNewChart = new Chart(ctx);

	new Chart(ctx).Pie(data);
};




