var investment;
var periods;
var start_date;
var target_date;
var present;
var r;

Template.goal.helpers({
	createDate: function(timestamp) {
		var date = moment(timestamp).format("MMMM Do YYYY");
		return date;
	},

	targetDate: function(month, year) {
		var date = moment([year, month]);
		return date.format("MMMM YYYY");
	},

	investment: function(goalid){
		var goal = Goals.findOne({_id: goalid});
		r = Meteor.user().profile.return_rate;
		start_date = moment(goal.time_stamp);
		target_date = moment([goal.goal_year, goal.goal_month]);
		present = moment();
		periods = target_date.diff(start_date, 'months');
		investment = goal.monthly_amt;
		return parseFloat(Math.round(investment * 100) / 100).toFixed(2);

	},

	format_money: function(amt) {
        return parseFloat(Math.round(amt * 100) / 100).toFixed(2);
    },

    progress_percent: function(goalid) {
    	var goal = Goals.findOne({_id: goalid});
    	return +(goal.progress)*100;
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


Template.goalprogressChart.onRendered( function(){
    drawChart();
});


function monthlyInvestments(a, b) {
	var curr_period = present.diff(start_date, 'months');
	var investments = [];
	var data = [];
	var curr = 0;
	for(i=0; i<periods; i++){
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

	if(periods<12){
		b = periods;
	}else{
		b= 12;
	}

	return [a,b]
};

function drawChart() {
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

    var ctx = document.getElementById("goalprogressChart").getContext("2d");

    var myBarChart = new Chart(ctx).Bar(data, options)

    for(i=0; i<vals[0]; i++){
    	myBarChart.datasets[0].bars[i].fillColor = "rgba(229, 11, 79,0.2)"; 
    }

    myBarChart.datasets[0].bars[vals[0]].fillColor = "rgba(229, 11, 79,0.65)"; 
    myBarChart.update();

};