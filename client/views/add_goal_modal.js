var currentSection = 1;
var goalAddDep = new Tracker.Dependency;
var categoryDep = new Tracker.Dependency;
var realismDep = new Tracker.Dependency;
var targetPeriod = -1;
var realisticPeriod = -1;
var val = 0;

Template.add_goal_modal.onRendered(function () {
	var id = this.data.gg._id;
	var category = this.data.category;
	if (category) {
		currentSection = 2;
		Session.set("category", category);
	}
	$(window).on('closed.zf.reveal', function (sth) { 
    	//currentSection = 1;
    	goalAddDep.changed();
    });
    $('#tags').tagsInput({
    	'width':'100%',
    	'placeholderColor': '#e50b4f',
    	'defaultText':'Add a Tag'
    });
    var name = '#add_goal_modal' + id;
    this.myRevealInstance = new Foundation.Reveal($(name));
});

Template.add_goal_modal.onDestroyed(function () {
	//this.myRevealInstance.stop();
	Session.set("modal", false)
	/*
  let reveal = this.myRevealInstance;
  if (reveal) {
    reveal.destroy();
  }*/
});

Template.add_goal_modal.helpers({
	sectionStatus: function(section) {
		goalAddDep.depend();
		if (section<currentSection) {
			return "done";
		} else if (section==currentSection) {
			return "active";
		} else {
			return null;
		}
	},
	
	statusIcon: function(section) {
		goalAddDep.depend();
		if (section<=currentSection){
			return "fa-circle";
		}else {
			return "fa-circle-o";
		}
	},
});

Template.goal_modal.helpers({
	isActive: function(section){
		goalAddDep.depend();
		if (section == currentSection){
			return "active";
		} else {
			return null;
		}
	},

	submitValue: function(){
		goalAddDep.depend();
		if(currentSection<4) {
			return "button";
		}else {
			return "submit";
		}
	},

	isChecked: function(val) {
		categoryDep.depend();
		currentVal = $("form input[type='radio']:checked").val();
		if (val == currentVal){
			return "active";
		}else {
			return null;
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

	realismAmount: function(){
		realismDep.depend();
		console.log("Realism", realisticPeriod, targetPeriod);
		if(targetPeriod==-1){
			return "";
		}

		if(realisticPeriod>targetPeriod){
			var r = Meteor.user().profile.return_rate;
			var goalTable = Meteor.user().profile.goal_table;

			var numsum = val;
			var densum = 0;
			for(var key in goalTable){
				numsum+= parseFloat(goalTable[key]);
			}

			for(var i=0; i<targetPeriod; i++){
				densum+= Math.pow(1+r, i);
			}

			var newval = numsum/densum;
			console.log("num amt", numsum, densum, newval);
			var str = "In order to reach this target, you need to top up $"+ parseFloat(Math.round(newval * 100) / 100).toFixed(2);
			return str;
		}else {
			return "";
		}
	}

});

Template.goal_modal.events({
	'change #amount': function (event, template) {
		val = event.target.valueAsNumber;
		var goalTable = Meteor.user().profile.goal_table;
		var period = 1;
		var r = Meteor.user().profile.return_rate;
		var amount = parseFloat(Meteor.user().profile.amount);
		var monthlyAdd = parseFloat(Meteor.user().profile.increment);
		var totalRequire = Meteor.user().profile.total_require + val;
		var goalReached = false;

		while (!goalReached) {
			if(period in goalTable){
				amount = amount - goalTable[period.toString()] + monthlyAdd*(Math.pow(1+r,period-1));
				totalRequire -= goalTable[period.toString()];
			}else {
				amount = amount + monthlyAdd*(Math.pow(1+r,period-1));
			}
			console.log(amount)
			console.log(totalRequire)
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
		$("#month").val(month)
		$("#year").val(year);
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
		currentSection -= 1;
		goalAddDep.changed();
	},
	"click .next": function(event, template){
		event.preventDefault();
		if (currentSection<4){
			currentSection += 1;
			goalAddDep.changed();	
		} else {
			var username = Meteor.user().username;
			var title = event.target.form[8].value;
			var desc = event.target.form[9].value;
			if (Session.get("category")) {
				var category = Session.get("category");
			} else {
				var category = $("form input[type='radio']:checked").val();
			}	
			var month = event.target.form[12].value;
			var target_amt = event.target.form[11].value;
			var year = event.target.form[13].value;
			var priority = $("#points")[0].value;
			var tags = event.target.form[16].value.split(",");
			var time_stamp = new Date();
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


