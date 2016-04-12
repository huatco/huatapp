Template.portfolio.helpers({
	username: function () {
		return Meteor.user() && Meteor.user().username;
	}, 
    goals: function () {
    	var this_user = Meteor.user() ? Meteor.user().username : "test_user1";
    	return Goals.find({user: this_user});
    },
    amount: function(){
    	return Meteor.user()['profile']['amount'];
    },
    riskscore: function(){
        return Meteor.user()['profile']['riskscore'];
    },
    returnRate: function(){
        var rate =  returnRate();
        return rate;
    }
});


Template.returnsChart.onRendered( function(){
    drawChart();
});

function returnRate() {
    var score = Meteor.user()['profile']['riskscore'];
    if (score<=30) {
        return 0.05;
    }else if(score<=60) {
        return 0.07;
    }else {
        return 0.09;
    }
};

function generateInvestmentReturns(rate) {
    var initial = +(Meteor.user()['profile']['amount']);
    var monthRate = Math.pow((1 + rate),(1/12)) - 1;
    var increment = +(Meteor.user()['profile']['increment']);
    var update = initial;
    var data = [initial];
    for (i=0; i<8; i++) {
        update = update + increment + (update*monthRate);
        var formatVal = parseFloat(Math.round(update * 100) / 100).toFixed(2);
        data.push(formatVal);
    }

    return data;
};

function generateNormalReturns() {
    var initial = +(Meteor.user()['profile']['amount']);
    var increment = +(Meteor.user()['profile']['increment']);
    var update = initial;
    var data = [initial];
    for (i=0; i<8; i++) {
        update = update + increment;
        var formatVal = parseFloat(Math.round(update * 100) / 100).toFixed(2)
        data.push(formatVal);
    }

    return data;
};

function drawChart() {
    var rate = returnRate();
    var investValues = generateInvestmentReturns(rate);
    var normValues = generateNormalReturns();
    var data = {
        labels: ["April", "May", "June", "July", "August", "September", "October", "November", "December"],
        datasets: [
            {
                label: "My Investment Returns",
                fillColor: "rgba(204,204,204,0.2)",
                strokeColor: "#e50b4f",
                pointColor: "#e50b4f",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: investValues,
            },
            {
                label: "My Standard Returns",
                fillColor: "rgba(204,204,204,0.2)",
                strokeColor: "#f85130",
                pointColor: "#f85130",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: normValues,
            },
        ]
    };

    var ctx = document.getElementById("returnschart").getContext("2d");
    var myReturnsChart = new Chart(ctx);

    new Chart(ctx).Line(data);

};
