
Goals = new Mongo.Collection("goals");


Template.dashboard.helpers({
	username: function () {
		return Meteor.user() && Meteor.user().username;
	}, 

    goals: function () {
    	var this_user = Meteor.user() ? Meteor.user().username : "test_user1";
    	return Goals.find({user: this_user}, {sort: {progress: -1}, limit:3});
    },

    goalCount: function() {
    	return Goals.find({user: Meteor.user().username}).count();
    },

    currentProgress: function() {
    	var total = Meteor.user().profile.total_require;
    	var current = parseFloat(Meteor.user().profile.amount);
    	var percent = (current/total)*100;
    	return parseInt(percent);
    },

    monthlyAmt: function() {
    	var amt = Meteor.user().profile.monthly_require;
    	return parseFloat(Math.round(amt * 100) / 100).toFixed(2);
    },

    currentAmt: function() {
    	var amt = Meteor.user().profile.amount;
    	return parseFloat(Math.round(amt * 100) / 100).toFixed(2);
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




