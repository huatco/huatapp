Goal_catalog = new Mongo.Collection("goal_catalog");

k = ["Education", "Lifestyle", "Life Plans", "Life Milestone", "Sports", "Nature", "Travel", "Skills", "Fan activities"];

if (Meteor.isClient) {

    Meteor.call("start_up", function(error){});
    var goal_count = 4;
    //var keys = ["Education", "Nature", "Sports"];
    Template.bucketlist.helpers({
        goals: function () {
        	var this_user = Meteor.user() ? Meteor.user().username : "test_user1";
        	return Goals.find({user: this_user});
        },
        keyword1: function(){
            var keys = Meteor.users.find({username: Meteor.user().username}).fetch()[0].profile.rec_keywords;
            console.log(keys)
            if(keys.length < 3){
                Meteor.call("keyword_clean_up", function(e){});
            }
            if(keys == undefined){
                Meteor.users.update({username: Meteor.user().username}, {$set:{rec_keywords: k}});
            }
            return [
            {k: keys[0], g: Goal_catalog.find({keywords: keys[0]}, {skip: 0, limit: goal_count})},
            {k: keys[1], g: Goal_catalog.find({keywords: keys[1]}, {skip: 0, limit: goal_count})},
            {k: keys[2], g: Goal_catalog.find({keywords: keys[2]}, {skip: 0, limit: goal_count})}]
            ;
        }
    });


     Template.bucketlist.events({
        "click .deletekey1": function(event, template) {
            
            var keyword = this.k;

            var keys = Meteor.users.find({username: Meteor.user().username}).fetch()[0].profile.rec_keywords;
            var dkeys = Meteor.users.find({username: Meteor.user().username}).fetch()[0].profile.dislike_keywords;
            if(dkeys == undefined) dkeys = [];
            dkeys.push(keyword);
            var index = keys.indexOf(keyword);
            keys.splice(index, 1);
            /*
            Meteor.users.update({_id: Meteor.user()._id}, {$set: {rec_keywords: keys}});
            Meteor.users.update({_id: Meteor.user()._id}, {$set: {dislike_keywords: dkeys}});
            */
            console.log(keys);
            console.log(dkeys);
            Meteor.call("recommendation", [keys, dkeys], function(error) {});
            var keys = Meteor.users.find({username: Meteor.user().username}).fetch()[0].profile.rec_keywords;
            var dkeys = Meteor.users.find({username: Meteor.user().username}).fetch()[0].profile.dislike_keywords;
            console.log(keys);
            console.log(dkeys);
        }
    });
    
    Template.bucket_goal.helpers({  
        progress_percent: function(goalid) {
        	var goal = Goals.findOne({_id: goalid});
        	return +(goal.progress)*100;
        },

        format_startdate: function(goalid) {
        	var goal = Goals.findOne({_id: goalid});
        	var date = moment(goal.time_stamp).format("dddd, MMMM Do YYYY");
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
            var start = moment();
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

