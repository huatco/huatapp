if (Meteor.isClient) {
	//Meteor.call("call_python", function(error) {});
  // This code only runs on the client
  //Meteor.call("call_python", function(error) {});
    Template.bucketlist.helpers({
        goals: function () {
        	var this_user = Meteor.user() ? Meteor.user().username : "test_user1";
        	return Goals.find({user: this_user});
        },
        keywords: function(){
            //Meteor.call("start_up", function(error) {});
            var keywords = ["Education", "Lifestyle", "Nature"];
            //console.log(keywords);
            //var res = Keywords.find({keyword: { $in: ["Education", "Lifestyle", "Nature"] }});

            return [{"keyword": "Education", "goals": ["Finish masters degree", "Get into a creative writing class", "Kid's college fund"]}
          ,{"keyword": "Lifestyle", "goals": ["Own a Range Rover", "Own a yacht", "Ride a camel in the desert"]}
          ,{"keyword": "Life Plans", "goals":  ["Plan for retirement", "Japanese old people's home", 'Live in NYC for a year', ]}];
            //return Keywords.find({keyword: "Education"});
            /*var keywords = ["Education", "Lifestyle", "Nature"];
            var results = [];
            var goal_count = 5;
            for(var i=0;i<keywords.length;i++){
                var key = keywords[i];
                var res = Goal_catalog.find({keywords: key});
                result.push({});
                console.log(res);
                for (var j=0;j<min(goal_count, res.length);j++){
                    result[i]["goals"].push(res[j]["goal"]);
                }
            }
            return result;
            */
        }

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
    });

    Template.bucket_goal.events({
        "click .delete_goal": function(event, template) {
            var goalid = template.data._id;
            Goals.remove(goalid);
            Meteor.call("call_python", function(error) {});
        }
    });
}

