Goal_catalog = new Mongo.Collection("goal_catalog");

k = ["Education", "Lifestyle", "Life Plans", "Life Milestone", "Sports", "Nature", "Travel", "Skills", "Fan activities"];
if (Meteor.isClient) {
    var goal_count = 4;
    var keys = ["Education", "Nature", "Sports"];
    Template.bucketlist.helpers({
        goals: function () {
        	var this_user = Meteor.user() ? Meteor.user().username : "test_user1";
        	return Goals.find({user: this_user});
        },
        k1: function(){return keys[0];},
        k2: function(){return keys[1];},
        k3: function(){return keys[2];},
        keyword1: function(){
            var key = keys[0];
            return Goal_catalog.find({keywords: key}, {skip: 0, limit: goal_count});
        },
        keyword2: function(){
            var key = keys[1];
            return Goal_catalog.find({keywords: key}, {skip: 0, limit: goal_count});
        },
        keyword3: function(){
            var key = keys[2];
            return Goal_catalog.find({keywords: key}, {skip: 0, limit: goal_count});
        }
    });

     Template.bucketlist.events({
        "click .deletekey1": function(event, template) {
            var newkey = [];
            newkey.push(key[1]); 
            newkey.push(key[2]);
            newkey.push("Lifestyle");
            key = newkey;
        },
        "click .deletekey2": function(event, template) {
            var newkey = [];
            newkey.push(key[0]); 
            newkey.push(key[2]);
            newkey.push("Lifestyle");
            key = newkey;
        },
        "click .deletekey3": function(event, template) {
            var newkey = [];
            newkey.push(key[0]); 
            newkey.push(key[1]);
            newkey.push("Lifestyle");
            key = newkey;
        },
         
    });
    
    Template.bucket_goal.helpers({  
        progress_percent: function(goalid) {
        	var goal = Goals.findOne({_id: goalid});
        	return +(goal.progress)*100;
        },

        format_startdate: function(goalid) {
        	var goal = Goals.findOne({_id: goalid});
        	var date = moment(goal.timestamp).format("dddd, MMMM Do YYYY");
        	return date;
        },

        format_enddate: function(goalid) {
            var goal = Goals.findOne({_id: goalid});
            var monthnum = goal.goal_month;
            var year = goal.goal_year;
            var date = moment([year, monthnum]);
            return date.format("MMMM YYYY");

        },
        format_current: function(amt) {
            return parseFloat(Math.round(amt * 100) / 100).toFixed(2);
        },

        format_target: function(amt) {
            return parseFloat(Math.round(amt * 100) / 100).toFixed(2);
        },

        remainder: function(goalid) {
            var goal = Goals.findOne({_id: goalid});
            var start = moment(goal.timestamp);
            var end = moment([goal.goal_year, goal.goal_month]);
            var difference = end.diff(start, 'months');
            return difference;
        }
    });


    UI.registerHelper('shortIt', function(stringToShorten, maxCharsAmount){
        if(stringToShorten.length > maxCharsAmount){
            return stringToShorten.substring(0, maxCharsAmount) + '...';
        }
        return stringToShorten;
    });
}

