import {SAMPLE_KEYWORDS} from "../../investment.js"

//Goals = new Mongo.Collection("goals");
Goal_catalog = new Mongo.Collection("goal_catalog");

//Meteor.call("start_up", function(error){});
var goal_display_count = 4;
Template.bucketlist.onCreated(function () {
   this.autorun(() => {
       this.subscribe("goals");
       this.subscribe("support");   
    });
});

Template.bucketlist.helpers({
    goals: function () {
        //return Meteor.subscribe("goal");
        
            if (!Meteor.user().profile || Meteor.user().profile.account_status < 3)
                document.location.href = '/registration';
            var this_user = Meteor.user().username;
            console.log(this_user);
            console.log(Goals.find({user: this_user}).count());
            return Goals.find({ user: this_user });
        
    },
});


Template.recommendation.onCreated(function () {
   this.autorun(() => {
    this.subscribe("goal_catalog");
    });
});

Template.recommendation.helpers({
    modal: function () { return true; },
    keyword1: function () {
        var keys = Meteor.user().profile.rec_keywords;
        if (keys == undefined || keys.length < 3) {
            Meteor.call("keyword_clean_up", function (e) { });
        }
        keys = Meteor.user().profile.rec_keywords;
        //console.log("keys", keys);
        if (keys[0].title) {
            for (var i = 0; i < keys.length; i++) {
                keys[i] = keys[i].title;
            }
        }
        return [
            { k: keys[0], g: Goal_catalog.find({ keywords: keys[0] }, { skip: 0, limit: goal_display_count }) },
            { k: keys[1], g: Goal_catalog.find({ keywords: keys[1] }, { skip: 0, limit: goal_display_count }) },
            { k: keys[2], g: Goal_catalog.find({ keywords: keys[2] }, { skip: 0, limit: goal_display_count }) }
        ];
    }
});

Template.recommendation.events({
    "click .deletekey1": function (event, template) {
        console.log(template);
        console.log(this);
        console.log(event);
        var keyword = this.k;
        var keys = Meteor.users.find({username: Meteor.user().username}).fetch()[0].profile.rec_keywords;
        var dkeys = Meteor.users.find({username: Meteor.user().username}).fetch()[0].profile.dislike_keywords;
        if(dkeys == undefined) dkeys = [];
        dkeys.push(keyword);
        var index = keys.indexOf(keyword);
        keys.splice(index, 1);
        Meteor.call("recommendation", [keys, dkeys], function(error) {});
        var keys = Meteor.users.find({username: Meteor.user().username}).fetch()[0].profile.rec_keywords;
        var dkeys = Meteor.users.find({username: Meteor.user().username}).fetch()[0].profile.dislike_keywords;
    }
});

Template.rec_goal.events({
    "click .rec_goal": function (t, e) {
        Session.set("section", 2);
        Session.set("title", e.data.goal_item.goal);
        Session.set("category", e.data.category);
        
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


