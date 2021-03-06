import {PORTFOLIO_PRICES, PORTFOLIO_DATES, BUCKET_PORTFOLIOS, BUCKET_VALUES} from "../../investment.js"
r=0;
start_date=0;
present=0;

Template.portfolio.helpers({
    returnRate: function(){
        var rate =  Meteor.user().profile.return_rate*100;
        return rate.toFixed(3);
    },

    bondPercent: function(){
        var bucket = BUCKET_VALUES[Meteor.user().profile.bucket];
        return bucket[0];
    },

    stockPercent: function(){
        var bucket = BUCKET_VALUES[Meteor.user().profile.bucket];
        return bucket[1];
    },

    annualReturn: function(){
        var bucket = BUCKET_VALUES[Meteor.user().profile.bucket];
        return bucket[2];
    },

    volatilityRate: function(){
        var bucket = BUCKET_VALUES[Meteor.user().profile.bucket];
        return bucket[3];
    },

    expenseRatio: function(){
        var bucket = BUCKET_VALUES[Meteor.user().profile.bucket];
        return bucket[4];
    },
});
Template.portfolio.onRendered(function () {
if(!Meteor.user().profile || Meteor.user().profile.account_status<3)
    document.location.href = '/registration'; 
});

Template.returnsChart.onRendered( function(){
    drawReturnsChart();
});


function drawReturnsChart() {
    r = Meteor.user().profile.return_rate;
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

    var ctx = document.getElementById("returnschart").getContext("2d");

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
    for(i=0; i<100; i++){
        var val = curr + investment*(Math.pow(1+r,i));
        investments.push(val.toFixed(2));
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

    b=25;

    return [a,b]
};

Template.breakdownChart.onRendered(function(){
    drawBreakdownChart();
});

function drawBreakdownChart(){
    var labels = BUCKET_PORTFOLIOS[0]
    var values = BUCKET_PORTFOLIOS[Meteor.user().profile.bucket]
    var data = {
        labels: labels,
        datasets: [
            {
                label: "My Goal Progress",
                fillColor: "rgba(0, 0, 0, 0.1)",
                strokeColor: "rgba(229, 11, 79,0)",
                highlightFill: "rgba(229, 11, 79, 0.65)",
                highlightStroke: "rgba(229, 11, 79, 0)",
                data: values,
            },
        ]
    };

    var options = { 
        responsive: true,
        maintainAspectRatio: true
    };

    var ctx = document.getElementById("breakdownChart").getContext("2d");

    var myBarChart = new Chart(ctx).Bar(data, options)

    colours = ['#e50b4f', '#ccc', '#1A90B2', '#3a3a3c', '#f85130'];

    for(i=0; i<5; i++){
        myBarChart.datasets[0].bars[i].fillColor = colours[i]; 
    }

    myBarChart.update();
};
