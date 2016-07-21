import {SAMPLE_KEYWORDS} from "../../investment.js"
Session.set("section", 1);
var goalAddDep = new Tracker.Dependency;
var categoryDep = new Tracker.Dependency;
var realismDep = new Tracker.Dependency;
var nextDep = new Tracker.Dependency;
var targetPeriod = -1;
var realisticPeriod = -1;
var VAL = 0;
var activeNext = 1;
Session.set("month", '1');
Session.set("year", '2017');
Session.set("goal_val", '0');

Template.add_goal_modal.onRendered(function () {
	activeNext = 1;
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
		activeNext = 1;
		$("#amount").val(0.00);
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
		//console.log(val);
		categoryDep.depend();
		currentVal = $("form input[type='radio']:checked").val();
		if (val == currentVal)return "active";
		return null;
	},

	isDisabled: function() {
		nextDep.depend();
		if(activeNext==0) {
			return "disabled";
		}else {
			return "";
		}
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
	default_year: function () { return 2017; }, 
	realismAmount: function(){
		realismDep.depend();
		if (targetPeriod == -1 || Session.get("reg_state") == 2 || Goals.find({user: Meteor.user().username}).count()==0) {
			var str = investmentAmt();
			return { show: true, str: str };
		}
		if(activeNext==0){
			var str = investmentAmt();
			return { show: true, str: str };
		}
	}

});

function investmentAmt() {
	var denom = 0;
	var year = Session.get("year");
	var month = Session.get("month");
	var date = moment([parseInt(year), parseInt(month)]);
	var present = moment(Meteor.user().profile.present_time);
	var target = date.diff(present, 'months');
	console.log(target);
	var r = Meteor.user().profile.return_rate;
	for(var i=0; i<target; i++){
		denom += Math.pow(1+r, i);
	}
	var v = parseFloat(Session.get("goal_val"));
	var newval = v / denom;
	var str = parseFloat(Math.round(newval * 100) / 100).toFixed(2);
	if (!isFinite(str)) str = "-";
	if (isNaN(str)) str = "-";
	return str;
};

Template.goal_modal.events({
	'change #amount': function (event, template) {
		VAL = event.target.valueAsNumber;
		Session.set("goal_val", event.target.valueAsNumber);
	},

	"click #topup": function(e, t){
		e.preventDefault();
   		e.stopPropagation()
		var increment = parseFloat($("#topupamount").val());
		var amount = parseFloat(Meteor.user().profile.increment) || 0;
		Meteor.call("topup", amount + increment);
		console.log("increment", increment);
		console.log("amount", amount);
		var current = amount + increment;
		Session.set("msg", "Top up successful!");
		activeNext=1;
		nextDep.changed();
		//alert("Top up successful.");
	}, 
	"change #month": function(event, template){
		var month = $("#month").val();
		var year = $("#year").val();
		Session.set("month", month);
		Session.set("year", year);
		var present = moment(Meteor.user().profile.present_time);
		var date = moment([year, month]);
		console.log("date changed", date);
		targetPeriod = date.diff(present, 'months');
		realismDep.changed();
		activeNext=0;
		nextDep.changed();
	},

	"change #year": function(event, template){
		var month = $("#month").val();
		var year = $("#year").val();
		Session.set("month", month);
		Session.set("year", year);
		var present = moment(Meteor.user().profile.present_time);
		var date = moment([year, month]);
		console.log("date changed", date);
		targetPeriod = date.diff(present, 'months');
		realismDep.changed();
		activeNext=0;
		nextDep.changed();
	},

	"click #reset_date": function(){
		var date = moment(Meteor.user().profile.present_time).add(realisticPeriod, 'M');
		var month = date.month()+1;
		var year = date.year();
		$("#month").val(month);
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
			var target_amt = $('#amount').val();
			var month = $('#month').val();
			var year = $('#year').val();
			var tags = $('#tags').val();
			if (Session.get("category")) {
				var category = Session.get("category");
			} else {
				var category = $("form input[type='radio']:checked").val();
			}	
			var priority = $("#points")[0].value;
			if(Goals.find({user:username, title:title}).count()==0){
				Meteor.call("add_goal",
					title, month, year, priority, target_amt, category, desc, tags,
					function (e, result) {
						if (result) {
							if (Session.get("reg_state") == 2) {
								Session.set("reg_state", 3);
								Meteor.users.update(Meteor.userId(), {
									$set: {
										"profile.account_status": 3
									}
								});
							}
							alert("Goal Added! " + title)
							document.location.href = '/bucketlist';
						}
					}
				);
			} else {
				alert("goal repeated! ")
			}

		}
	},

});



