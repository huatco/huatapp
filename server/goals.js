Goals = new Mongo.Collection("goals");
Goal_catalog = new Mongo.Collection("goal_catalog");

if (Meteor.isServer) {
  //Goals.remove({});
  var exec = Npm.require('child_process').exec;
  var Fiber = Npm.require('fibers');
  var Future = Npm.require('fibers/future');

  Meteor.methods({
    start_up: function() {
      g = [{"keyword": "Education",  "goals": ["Finish masters degree", "Get into a creative writing class", "Kid's college fund", "Go for an art class"]}
          ,{"keyword": "Lifestyle",  "goals": ["Own a Range Rover", "Own a yacht", "Ride a camel in the desert", "Travel by helicopter", "Stay in Japan for a month"]}
          ,{"keyword": "Life Plans", "goals": ["Plan for retirement", "Japanese old people's home", 'Live in NYC for a year', "Purchase our first home!", "have a kid"]}
          ,{"keyword": "Life Milestone", "goals":  ["Buy Engagement Ring", "Pass Driving Test", "Have a kid", "Start a Family", "Buy my first car!"]}
          ,{"keyword": "Sports",     "goals": ["Learn to Rock Climb", "Go to a Manchester United game", "Take up yoga", "Learn how to ballroom dance", "Go on diving trips"]}
          ,{"keyword": "Nature",     "goals": ["Be on a boat during the sunset", "Camp on the Beach", "See the redwoods", "See Cherry Blossoms in Japan"]}
          ,{"keyword": "Travel",     "goals": ["Visit the Christmas Markets in Germany", "Visit the Osaka Castle", "Visit Macau", "Visit England", "Hear Big Ben chime on the hour in London", "Visit Tanzania",  "See the paddy fields of Vietnam"]} 
          ,{"keyword": "Skills",     "goals": ["Learn to Ride a Motorcycle", "Horseback riding", "Learn to play the Ukulele", "Take up Yoga"]}
          ,{"keyword": "Fan activities", "goals": ["Go to all the Harry Potter locations", "Meet Mike Tyson"]}
          ];
          //Keywords.remove({});
      for(var i=0;i<g.length;i++){
        var list = [];
        for (var j=0;j<3;j++){
          list.push(g[i]["goals"][i]);
        }
        Keywords.insert({
          keyword: g[i]["keyword"],
          goals: list
        });
        console.log(g[i]["keyword"]);
      }
    }, 
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
  });

}



