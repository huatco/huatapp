import {PORTFOLIO_PRICES, PORTFOLIO_DATES, BUCKET_PORTFOLIOS} from "../../investment.js"
Goals = new Mongo.Collection("goals");
r=0;
start_date=0;
present=0;


Template.dashboard.helpers({
	username: function () {
		if(!Meteor.user().profile || Meteor.user().profile.account_status < 3)
            document.location.href = '/registration'; 
		return Meteor.user() && Meteor.user().username;
	}, 

    goals: function () {
		var this_user = Meteor.user().username;
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
    },

    riskscore:function() {
    	return Meteor.user().profile.risk_score;
    },

    format_money: function(amt) {
        return parseFloat(Math.round(amt * 100) / 100).toFixed(2);
    },

    progress_percent: function(goalid) {
        var goal = Goals.findOne({_id: goalid});
        return +(goal.progress)*100;
    },
});

// Template.goalchart.onCreated(function(){
// 	this.goal = this.data._id;
// });


Template.stockChart.onRendered(function(){
	drawStockChart();
});

function drawStockChart(){
	var values = PORTFOLIO_PRICES;
	var dates = getDates(PORTFOLIO_PRICES.length)

	var data = {
	    labels: dates,
	    datasets: [
	        {
	            label: "My First dataset",
	            fillColor: "rgba(220,220,220,0.25)",
	            strokeColor: "rgba(229, 11, 79, 1)",
	            pointColor: "rgba(220,220,220,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(220,220,220,1)",
	            data: values,
	        },
	    ]

	};

	var options = { 
        responsive: true,
        maintainAspectRatio: true,
        showTooltips: false,
        showScale: true,
        pointDot : false,
    };

	var ctx = document.getElementById("stockChart").getContext("2d");
	var myLineChart = new Chart(ctx).Line(data, options);
};

function getDates(len){
	dates = [];
	date = moment();
	for(var i=0; i<len; i++){
		dates.push("")
		date = date.add(1, 'd');
	}
	return dates;
};

Template.portfolioChart.onRendered(function(){
	drawPortfolioChart();
});

function drawPortfolioChart() {
	bucket = Meteor.user().profile.bucket;
	bucketvals = BUCKET_PORTFOLIOS[Meteor.user().profile.bucket];
	labels = BUCKET_PORTFOLIOS[0];
	data = getPortfolioData(bucketvals, labels);
	var ctx = document.getElementById("portfolioChart").getContext("2d");
	var myNewChart = new Chart(ctx).Doughnut(data);
};

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

Template.progressChart.onRendered(function(){
	drawProgressChart();
});

function drawProgressChart() {
	r = Meteor.user().profile.return_rate;
	console.log("return rate", r);
	start_date = moment(Meteor.user().createdAt);
	present = moment();
	var vals = datalength();
    var data = monthlyInvestments(vals[0], vals[1]);
    var monthlabels = monthLabels(vals[0], vals[1]);
    console.log(vals);
    console.log(data);
    console.log(monthlabels);
    var data = {
	    labels: monthlabels,
	    datasets: [
	        {
	            label: "My Goal Progress",
	            fillColor: "rgba(0, 0, 0, 0.1)",
	            strokeColor: "rgba(229, 11, 79,0)",
	            highlightFill: "rgba(229, 11, 79, 0.65)",
	            highlightStroke: "rgba(229, 11, 79, 0)",
	            data: data,
	        },
	    ]
	};

    var options = { 
        responsive: true,
        maintainAspectRatio: true
    };

    var ctx = document.getElementById("progressChart").getContext("2d");

    var myBarChart = new Chart(ctx).Bar(data, options)

    for(i=0; i<vals[0]; i++){
    	myBarChart.datasets[0].bars[i].fillColor = "rgba(229, 11, 79,0.2)"; 
    }

    myBarChart.datasets[0].bars[vals[0]].fillColor = "rgba(229, 11, 79,0.65)"; 
    myBarChart.update();
};

function monthlyInvestments(a, b) {
	var curr_period = present.diff(start_date, 'months');
	var investments = [];
	var investment = Meteor.user().profile.monthly_require;
	var data = [];
	var curr = parseFloat(Meteor.user().profile.amount);
	for(i=0; i<12; i++){
		var val = curr + investment*(Math.pow(1+r,i));
		investments.push(val);
		curr = val;
	}

	var data_start = present.diff(start_date, 'months') - a;

	for(i=0; i<b; i++){
		data.push(investments[data_start]);
		data_start+=1;
	}

	return data;
};

function monthLabels(a,b) {
	var labels = [];
	var m = moment();
	var curr = m.month() - a;
	for (var i = 0; i < b; i++) {
		var mon = curr%12;
		labels.push(m.month(mon).format('MMMM'));
		curr+=1;
	}
	return labels;
};

function datalength(){
	var curr_period = present.diff(start_date, 'months');
	var a;
	var b;
	if(curr_period<5){
		a = curr_period;
	}else{
		a = 5;
	}

	b=12;

	return [a,b]
};
