import {SAMPLE_KEYWORDS} from "../../investment.js"
Session.set("section", 1);
var goalAddDep = new Tracker.Dependency;
var categoryDep = new Tracker.Dependency;
var realismDep = new Tracker.Dependency;
var targetPeriod = -1;
var realisticPeriod = -1;
var val = 0;
k = ["Education", "Lifestyle", "Life Plans", "Life Milestone", "Sports", "Nature", "Travel", "Skills", "Fan activities"];

Template.add_goal_modal.onRendered(function () {
	Session.set("msg", "");
	if (Session.get("category")) Session.set("section", 2);
	$(window).on('closed.zf.reveal', function (sth) { 
    	goalAddDep.changed();
    });
    $('#tags').tagsInput({
    	'width':'100%',
    	'placeholderColor': '#e50b4f',
    	'defaultText':'Add a Tag'
    });
    var name = '#add_goal_modal';
    this.myRevealInstance = new Foundation.Reveal($(name));
});

Template.add_goal_modal.onDestroyed(function () {
	this.myRevealInstance.stop();
	let reveal = this.myRevealInstance;
	if (reveal) {
		reveal.destroy();
	}
});

Template.add_goal_modal.helpers({
	sectionStatus: function(section) {
		goalAddDep.depend();
		if (section<Session.get("section")) {
			return "done";
		} else if (section == Session.get("section")) {
			return "active";
		} else {
			return null;
		}
	},
	statusIcon: function(section) {
		goalAddDep.depend();
		if (section<=Session.get("section")){
			return "fa-circle";
		}else {
			return "fa-circle-o";
		}
	},
});

Template.goal_modal.helpers({
	title: function (e) {
		Session.set("msg", "");
		return Session.get("title");
	},
	category: function (e) {
		return Session.get("category");
	}, 
	categories: function (e) {
		return SAMPLE_KEYWORDS;
	}, 
	isActive: function(section){
		goalAddDep.depend();
		if (section == Session.get("section"))
			return "active";
		return null;
	},
	msg:function(){
		return Session.get("msg");
	}, 
	submitValue: function(){
		goalAddDep.depend();
		if(Session.get("section")<4)  return "button";
		return "submit";
	},

	isChecked: function (val) {
		console.log(val);
		categoryDep.depend();
		currentVal = $("form input[type='radio']:checked").val();
		if (val == currentVal)return "active";
		return null;
	},
	predefinedTags: function(gg){
		categoryDep.depend();
		$(".tags").importTags('');
		var category = $("form input[type='radio']:checked").val();
		var tag = ".tags";
		if (category=="Life"){
			$(tag).importTags("life,shopping,leisure,staycation,party");
		}
		else if (category=='Education'){
			$(tag).importTags("education,graduation,college,post-graduation");
		}
		else if (category=='Fitness'){
			$(tag).importTags("fitness,health,gym,cross fitness,martial arts,kickboxing, marathon");
		}
		else if (category=='Travel'){
			$(tag).importTags("travel,holiday,exploration,backpacking,sightseeing,adventure");
		}
		else if (category=='Milestone'){
			$(tag).importTags("milestone,retirement,career,marriage,migration,house");
		}
		else if (category=='Hobbies'){
			$(tag).importTags("hobbies,guitar,soccer,robotics,coding");
		}
		else {
			return "";
		}
	},

	realismAmount: function(){
		realismDep.depend();
		console.log("Realism", realisticPeriod, targetPeriod);
		/*
		if (Session.get("reg_state") == 2) {
			var newval = investmentAmt();
			var str = parseFloat(Math.round(newval * 100) / 100).toFixed(2);
			if (!isFinite(str)) str = "Not Available";
			if (isNaN(str)) str = "Not Available";
			console.log("str", str);
			return { show: true, str: str };
		}*/
		if(targetPeriod==-1){
			return { show: false, str: "" };
		}
		if(realisticPeriod>targetPeriod || Session.get("reg_state") == 2){
			// var r = Meteor.user().profile.return_rate;
			// var goalTable = Meteor.user().profile.goal_table;

			// var numsum = val;
			// var densum = 0;
			// for(var key in goalTable){
			// 	numsum+= parseFloat(goalTable[key]);
			// }
			// var periodList = Object.keys(goalTable);
			// var maxPeriod = Math.max.apply(null, periodList);

			// if(maxPeriod<targetPeriod){
			// 	maxPeriod = targetPeriod;
			// }
			// console.log()
			// for(var i=0; i<maxPeriod; i++){
			// 	densum+= Math.pow(1+r, i);
			// }

			// var newval = numsum/densum;
			// newval -= Meteor.user().profile.monthly_require;
			// console.log("num amt", numsum, densum, newval);
			// //document.getElementById("topup").style.visibility = "visible";
			// console.log(Math.round(newval * 100) / 100);
			var newval = investmentAmt();
			var str = parseFloat(Math.round(newval * 100) / 100).toFixed(2);
			if (!isFinite(str)) str = "Not Available";
			if (isNaN(str)) str = "Not Available";
			console.log("str", str);
			return { show: true, str: str };
		}
	}

});

function investmentAmt() {
  var r = Meteor.user().profile.return_rate;
  var denom = 0;
  for(i=0; i<targetPeriod; i++){
    var a = Math.pow(1+r, i);
    denom += a;
  }
  investment = val/denom;
  return investment;
};

Template.goal_modal.events({
	'change #amount': function (event, template) {
		val = event.target.valueAsNumber;
		
		if (Session.get("reg_state") == 2) {
			realismDep.changed();
			return;
		}
		var goalTable = Meteor.user().profile.goal_table;
		var period = 1;
		var r = Meteor.user().profile.return_rate;
		var amount = parseFloat(Meteor.user().profile.amount);
		var monthlyAdd = parseFloat(Meteor.user().profile.monthly_require);
		var totalRequire = Meteor.user().profile.total_require + val;
		var goalReached = false;
		while (!goalReached) {
			if(period in goalTable){
				amount = amount - goalTable[period.toString()] + monthlyAdd*(Math.pow(1+r,period-1));
				totalRequire -= goalTable[period.toString()];
			}else {
				amount = amount + monthlyAdd*(Math.pow(1+r,period-1));
			}

			if(amount>totalRequire){
				goalReached= true;
			}else {
				period+=1;
			}
		}

		console.log(period);
		realisticPeriod = period;
		var date = moment().add(period, 'M');
		var month = date.month()+1;
		var year = date.year();
		$("#month").val(month);
		document.getElementById('month').style.backgroundColor = "yellow";
		$("#year").val(year);
		document.getElementById('year').style.backgroundColor = "yellow";
	},
	"click #topup": function(e, t){
		e.preventDefault();
   		e.stopPropagation()
		var increment = parseFloat($("#topupamount").val());
		var amount = parseFloat(Meteor.user().profile.increment) || 0;
		Meteor.call("topup", [amount + increment]);
		console.log("increment", increment);
		console.log("amount", amount);
		var current = amount + increment;
		Session.set("msg", "Top up successful. Topup amount: " + increment);
		$("#topupamount").val("0");
		//alert("Top up successful.");
	}, 
	"change #month": function(event, template){
		var month = $("#month").val();
		var year = $("#year").val();
		var present = moment();
		var date = moment([year, month]);
		console.log("date changed", date);
		targetPeriod = date.diff(present, 'months');
		realismDep.changed();
	},

	"change #year": function(event, template){
		var month = $("#month").val();
		var year = $("#year").val();
		var present = moment();
		var date = moment([year, month]);
		console.log("date changed", date);
		targetPeriod = date.diff(present, 'months');
		realismDep.changed();
	},

	"click #reset_date": function(){
		var date = moment().add(realisticPeriod, 'M');
		var month = date.month()+1;
		var year = date.year();
		$("#month").val(month)
		$("#year").val(year);
		targetPeriod = -1;
		realismDep.changed();
	},

	"click .goal_category": function(){
		categoryDep.changed();
	},

	"click .previous": function(event, template){
		console.log("back button")
		Session.set("section", Session.get("section") - 1);
		goalAddDep.changed();
	},
	"click .next": function(event, template){
		event.preventDefault();
		if (Session.get("section")<4){
			Session.set("section", Session.get("section") + 1);
			goalAddDep.changed();	
		} else {
			var username = Meteor.user().username;
			
			var title = $('#title').val();
			var desc = $('#description').val();
			//var category = $("form input[type='radio']:checked").val();
			var target_amt = $('#amount').val();
			var month = $('#month').val();
			var year = $('#year').val();
			//var priority = $('#slider').attr('aria-valuenow');
			var tags = $('#tags').val();
			
			//var title = event.target.form[8].value;
			//var desc = event.target.form[9].value;
			if (Session.get("category")) {
				var category = Session.get("category");
			} else {
				var category = $("form input[type='radio']:checked").val();
			}	
			//var month = event.target.form[12].value;
			//var target_amt = event.target.form[11].value;
			//var year = event.target.form[13].value;
			var priority = $("#points")[0].value;
			//var tags = event.target.form[16].value.split(",");
			var time_stamp = new Date();
			console.log("title", title);
			console.log("desc", desc);
			console.log("target_amount", target_amt);
			if(Goals.find({user:username, title:title}).count()==0){
				Goals.insert({ 
					title: title,
					time_stamp: time_stamp, 
					created_year: time_stamp.getYear(),
					created_month: time_stamp.getMonth(),   
					goal_month: month,
					goal_year: year, 
					priority: priority, 
					target_amount: target_amt, 
					current_amount: 0.0, 
					progress: 0,
					category: category,
					user: Meteor.user().username, 
					details: desc,
					current_time: 0,
					keywords: tags 
				}); 
				console.log("Added a goal", title);
				Meteor.call("call_python", function(error) {});
				
				if (Session.get("reg_state") == 2){
					Session.set("reg_state", 3);
					Meteor.users.update(Meteor.userId(), {$set: {
						"profile.account_status": 3
					}});
					
					alert("Goal Added! " + title)
					document.location.href = '/registration';
				} else {
					alert("Goal Added! " + title)
					document.location.href = '/bucketlist';
				}
			}else{
				alert("goal repeated! ")
			}

		}
	},

});



