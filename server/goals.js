import {returnRate, assign_bucket, SAMPLE_GOALS, SAMPLE_KEYWORDS} from "../investment.js"

Goals = new Mongo.Collection("goals");
Goal_catalog = new Mongo.Collection("goal_catalog");

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

if (Meteor.isServer) {
  /*
  var exec = Npm.require('child_process').exec;
  var Fiber = Npm.require('fibers');
  var Future = Npm.require('fibers/future');
  */
  Meteor.methods({
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

    start_up: function () {
      //populate goal catalog if it's not already populated
      for(var i=0;i<SAMPLE_GOALS.length;i++)
          for (var j=0;j<SAMPLE_GOALS[i]["goals"].length;j++)
            if (Goal_catalog.find({goal: SAMPLE_GOALS[i]["goals"][j]}).count()==0)
              Goal_catalog.insert(
                {
                  "keywords": [SAMPLE_GOALS[i]["keyword"]],
                "goal": SAMPLE_GOALS[i]["goals"][j], "clicks": 0,
                "A": 0, "B": 0, "C": 0
                });
      
      var monthly_requirement = 0
      var total_requirement = 0
      var goalTable = {}
      //var bucket = assign_bucket()
      var goals = Goals.find({user: Meteor.user().username})
      var score = Meteor.user().profile.risk_score;
      var rate = returnRate(score)
     
      goals.forEach(function(goal){
        var amt = investmentAmt(goal.target_amount, goal.time_stamp, goal.goal_month, goal.goal_year, rate);
        var p = targetPeriod(goal.goal_month, goal.goal_year);

        (p in goalTable) ? goalTable[p] += goal.target_amount : goalTable[p] = goal.target_amount;

        monthly_requirement += amt;
        total_requirement += parseFloat(goal.target_amount);
        Goals.update({_id: goal._id}, {$set: {monthly_amt: amt}});
      });
      Meteor.users.update({_id: Meteor.user()._id}, {$set: {"profile.return_rate": rate,
            "profile.monthly_require": monthly_requirement, "profile.total_require": total_requirement,
            "profile.goal_table": goalTable}});
    },


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
        return true;
      } else {
        console.log(context.invalidKeys());
        return false;
      }

    },


    /*
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
  }); 

};

function investmentAmt(amount, start, month, year, r) {
  /*
  r: rate of return
  */
  var start_date = moment(start);
  var target_date = moment([year, month]);
  var periods = target_date.diff(start_date, 'months');
  var denom = 0;
  for(i=0; i<periods; i++){
    var val = Math.pow(1+r, i);
    denom += val;
  }
  investment = amount/denom;
  return investment;
};

function targetPeriod(month, year){
  var present = moment();
  var target = moment([year, month]);
  var period = target.diff(present, 'months');
  return period;
}



