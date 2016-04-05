Goals = new Mongo.Collection("goals");

if (Meteor.isServer) {
  //Goals.remove({});
  var exec = Npm.require('child_process').exec;
  var Fiber = Npm.require('fibers');
  var Future = Npm.require('fibers/future');

  Meteor.methods({
    start_up: function() {
      console.log(Meteor.user().username);
      var this_user = Meteor.user().username;
      if (Goals.find({user: this_user}).count() === 0) {
        console.log("nothing in goal database, add two goals for testing.");
        var time_stamp = new Date();
        Goals.insert({ title:  "Go to Jay Chou's concert",
          time_stamp: time_stamp, 
          created_year: time_stamp.getYear(),
          created_month: time_stamp.getMonth(),   
          goal_month: 7,
          goal_year: 2016, 
          priority: 2, 
          target_amount: 300, 
          current_amount: 0.0, 
          progress: 0.0,
          category: "Life",
          user: this_user, 
          details: "love jay chou",
        });
        Goals.insert({ title:  "get married",
          time_stamp: time_stamp, 
          created_year: time_stamp.getYear(),
          created_month: time_stamp.getMonth(),   
          goal_month: 7,
          goal_year: 2019, 
          priority: 1, 
          target_amount: 30000, 
          current_amount: 0.0, 
          progress: 0.0,
          category: "Marriage",
          user: this_user, 
          details: "I'm lucky",
        });
      }
    }, 
    call_python: function() {
      var fut = new Future();
      var allocation;
      var this_user = Meteor.user() ? Meteor.user().username : "test_user1";
      var url = process.env.MONGO_URL;
      console.log(url);
      console.log(this_user);
      console.log(__dirname);
      var cmd = 'python ../../../../../goal_sorting.py ' + this_user + ' ' + url
      //var cmd = "ls ../../../../..";
      exec(cmd, function (error, stdout, stderr) {
        console.log(stdout);
        console.log(error);
        console.log("insertion succeeded");
      });
      //return allocation;
      return fut.wait();
    },

  });
}



