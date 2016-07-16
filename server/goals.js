import {returnRate, assign_bucket, SAMPLE_KEYWORDS} from "../investment.js"

Goals = new Mongo.Collection("goals");
Goal_catalog = new Mongo.Collection("goal_catalog");
Support = new Mongo.Collection("support");

Goals.schema = new SimpleSchema({
  title: { type: String },
  time_stamp: {type: Date, }, 
  created_year: { type: Number },
  created_month: { type: Number, min: 1, max: 12 },
  goal_month: { type: Number, },
  goal_year: { type: Number, min: 2016},
  target_amount: { type: Number, },
  current_amount: {type: Number, },
  progress: {type: Number, defaultValue: 0},
  category: {type: String },
  user: {type: String },
  details: { type: String, optional: true },
  current_time: { type: Number },
  priority: { type: Number },
  keywords: {type: String, optional: true}
});

Support.schema = new SimpleSchema({
  title: { type: String },
  description: { type: String, optional: true },
  time_stamp: {type: Date}
})



Meteor.methods({

  add_goal: function (title, month, year, priority, target_amt, category, desc, tags) {
    var time_stamp = new Date();
    console.log(time_stamp);
    console.log(tags);
    console.log(time_stamp.getYear());
    var new_goal = {
      title: title,
      time_stamp: time_stamp,
      created_year: time_stamp.getYear(),
      created_month: time_stamp.getMonth(),
      goal_month: parseInt(month),
      goal_year: parseInt(year),
      priority: parseInt(priority),
      target_amount: parseFloat(target_amt),
      current_amount: 0.0,
      progress: 0,
      category: category,
      user: Meteor.user().username,
      details: desc,
      current_time: 0,
      keywords: tags
    };
    var context = Goals.schema.namedContext("add_goal");
    if (context.validate(new_goal)) {
      Goals.insert(new_goal);
      console.log("goal added!", title);
      return true;
    } else {
      console.log(context.invalidKeys());
      return false;
    }
  },


  recommendation: function(key){
    var keys = key[0];
    var dkeys = key[1];
    Meteor.users.update({_id: Meteor.user()._id}, {$set: {"profile.rec_keywords": keys}});
    Meteor.users.update({_id: Meteor.user()._id}, {$set: {"profile.dislike_keywords": dkeys}}); 
  },

  
  topup: function (increment) {
    Meteor.users.update(Meteor.userId(), {
      $set: {
        "profile.increment": increment,
      }
    });
    console.log("INCREMENTED");
  }, 

  
  keyword_clean_up: function () {
    var keys = [];
    for (var i = 0; i < SAMPLE_KEYWORDS.length; i++){
      keys.push(SAMPLE_KEYWORDS[i].title);
    }
      
    Meteor.users.update({_id: Meteor.user()._id}, {$set: {"profile.rec_keywords": keys}});
    Meteor.users.update({_id: Meteor.user()._id}, {$set: {"profile.dislike_keywords": []}}); 
  },

  submit_bug: function (title, desc) {
    var bug = { title: title, description: desc, time_stamp: new Date() };
    var bug_context = Support.schema.namedContext("bug");
    if (bug_context.validate(bug)) {
      Support.insert(bug);
      return true;
    } else return false;
  }
}); 


  /*
var exec = Npm.require('child_process').exec;
var Fiber = Npm.require('fibers');
var Future = Npm.require('fibers/future');
  call_python: function() {
    var fut = new Future();
    var allocation;
    var this_user = Meteor.user() ? Meteor.user().username : "test_user1";
    var url = process.env.MONGO_URL;
    console.log("Server running goal sorting optimization...")
    console.log("Mongo url:", url);
    console.log("Username:", this_user);
    //console.log(__dirname);
    var cmd = 'python ../../../../../goal_sorting.py ' + this_user + ' ' + url
    //var cmd = "ls ../../../../..";
    exec(cmd, function (error, stdout, stderr) {
      console.log("Standard output from python script: ")
      console.log(stdout);
      console.log(stderr);
    });
    //return allocation;
    return fut.wait();
  },
  */