import {returnRate, assign_bucket, SAMPLE_KEYWORDS, investmentAmt} from "../investment.js"

Meteor.methods({
  click_on_goal: function (goal) {
    var c = parseInt(Goal_catalog.find({ goal: goal }).clicks); 
    Goal_catalog.update({ goal: goal }, { $set: { clicks: c + 1 } }); 
  }, 
  
  add_goal: function (title, month, year, priority, target_amt, category, desc, tags) {
    var time_stamp = new Date();
    var ror = Meteor.user().profile.return_rate;
    var amount = parseFloat(investmentAmt(parseFloat(target_amt), time_stamp, parseInt(month), parseInt(year), ror));
    console.log(time_stamp);
    console.log(tags);
    console.log(time_stamp.getYear());
    var new_goal = {
      title: title,
      time_stamp: time_stamp,
      monthly_amt: amount, 
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
  
  submit_bug: function (user, title, desc) {
    
    var bug = { user: user, title: title, description: desc, time_stamp: new Date() };
    var bug_context = Bug.schema.namedContext("bug");
    if (bug_context.validate(bug)) {
      Bug.insert(bug);
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