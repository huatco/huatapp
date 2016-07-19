import {assign_bucket, RATES, returnRate,  BUCKET_PORTFOLIOS} from "../../investment.js"
var score = 0;
Session.set({"step": 0, "bucket": 1});
var q2 = [
	{
		title: "When looking for a job, what do you look for?",
		option1: "High-paying start-up job",
		option2: "Low-paying multinational corporations"
	},
	{
		title: "Would you invest 10% of your savings/yearly income in a startup?", 
		option1: "Yes",
		option2: "No"
	}, 
	{
		title: "When going on holiday, I would go",
		option1: "For a Package Tour",
		option2: "Free and Easy"
	},
	{
		title: "My company is laying off employees. I see this as",
		option1: "Uncertainty of my next paycheck",
		option2: "Opportunity to move on"
	},
	{
		title: "I just inherited a $100k property. By next year, the value might be $150k or $50k with an equal chance. I would",
		option1: "Sell it immediately",
		option2: "Hold for a year"
	}
];
var x = 0.5;
var y = 5;
var A = 10;
var B = 0.05;
var q1 = [];
for (var i = 0; i < 9; i++){
	var per1 = i * 10 + 10;
	var per2 = 100 - per1;
	q1.push({
		title: "Choose one of two bets:",
		option1: "" + per1 + "% chance of getting " + x + " dollars; \n" +
				  per2 + "% chance of getting " + y + " dollars.", 
		option2: "" + per2 + "% chance of getting " + A + " dollars; \n" +
				  per1 + "% chance of getting " + B + " dollars."
	})
}

var values = [5, 3, 3, 4, 5];
var questionDep = new Tracker.Dependency;
var questions = q1.concat(q2);	

Template.risk_profile.helpers ({
	question: function(){
		questionDep.depend();
		return questions[Session.get("step")];
	},
	bucket: function(){
		return Session.get("bucket");
	},
	returns: function () {
		return parseFloat(RATES[Session.get("bucket")]) * 100.0;
	},
});
Template.risk_profile.events ({
	"click .opt1": function () {
		var step = Session.get("step");
		if (step >= 10 && step <= 14) score += values[step - 10];
		else score += 5;
		Session.set("step", Session.get("step") + 1);
		Session.set("bucket", assign_bucket(score)); 
		
		questionDep.changed();
	},
	"click .opt2": function () {
		var step = Session.get("step");
		if (step >= 10 && step <= 14) score -= values[step - 10];
		else score -= 5;
		Session.set("step", Session.get("step") + 1);

		Session.set("bucket", assign_bucket(score)); 
	
		questionDep.changed();
	},
	"click .submit_risk": function () {
		//Meteor.call("update_beta");
		var risk_score = score;
		var bucket = assign_bucket(risk_score);
		Meteor.users.update(Meteor.userId(), {$set: {
			"profile.riskscore": risk_score,
			"profile.return_rate": returnRate(risk_score), 
			"profile.bucket": bucket, 
			"profile.account_status": 2
		}
		});
		Session.set("reg_state", 2);
		regDep.changed();
	},
});

function getPortfolioData(vals, labels){
	data = [];
	colours = ['#e50b4f', '#ccc', '#1A90B2', '#3a3a3c', '#f85130'];
	for(var i=0; i<vals.length; i++){
		asset = {
			value: vals[i],
	        color: colours[i],
	        highlight: "#f2f2f2",
	        label: labels[i],
		};
		data.push(asset);
	}
	return data;
};

Template.bucketChart.onRendered(function(){
	drawBucketChart();
});

function drawBucketChart() {
	var bucket = Session.get("bucket");
	var bucketvals = BUCKET_PORTFOLIOS[bucket];
	var labels = BUCKET_PORTFOLIOS[0];
	var data = getPortfolioData(bucketvals, labels);
	var options = { 
        responsive: true,
        maintainAspectRatio: true
    };
	var ctx = document.getElementById("bucketChart").getContext("2d");
	var myNewChart = new Chart(ctx).Doughnut(data, options);
};