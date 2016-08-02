import {SAMPLE_GOALS, investmentAmt, targetPeriod, returnRate, INVITATIONS, PILOT_START_DATE, ROR, PRICES} from "../investment.js"
import { Session } from 'meteor/session'

Meteor.methods({
    valid_code: function (value) {
        var b = Beta.findOne({ code: value });
        if (Beta.find({ code: value }).count() > 0) {
            console.log("B", b.user);
            if (b.user == "") {
                console.log("worked");
                return false;
           }
        } 
        console.log("not working");
        return true; 
    }, 
    update_beta: function () {
        var code = Meteor.users.find({ username: Meteor.user().username }).fetch()[0].profile.invitation;
        Beta.update({ code: code }, { $set: { user: Meteor.user().username } });
        console.log("beta updated");
    },
    start_up: function () {
        var monthly_requirement = 0;
        var total_requirement = 0;
        var goalTable = {};
        var goals = Goals.find({ user: Meteor.user().username });
        
        var present = moment();
        var virtual_present;
        if(Meteor.user().profile.present_time == undefined){
            virtual_present = present;
        }else {
            virtual_present = moment(Meteor.user().profile.present_time);
        }
        var diff_days = Math.ceil(virtual_present.diff(present,"days")/14);
        var diff_months = virtual_present.diff(present,"months");
        console.log("diffdays", diff_days, diff_months);
        var bucket = Meteor.user().profile.bucket;
        var rate = (ROR[bucket][diff_days]);
        var portfolio_value = PRICES[bucket][diff_days];
        var total_units = 0;

        console.log("rate and port", rate, portfolio_value)

        goals.forEach(function (goal) {
            var amt = goal.monthly_amt;
            var p = targetPeriod(goal.goal_month, goal.goal_year);
            var units = 0;
            
            for(var i=0; i<diff_days; i+=2){
                units += amt/(PRICES[bucket][i]);
            }

            var new_val = parseFloat(units*portfolio_value);
            var new_prog = new_val / goal.target_amount;

            monthly_requirement += amt;
            total_requirement += parseFloat(goal.target_amount);
            total_units += units;
            console.log("units", units);
            Goals.update({ _id: goal._id }, { 
                $set: { 
                    units: parseFloat(units),
                    current_amount: new_val,
                    progress: new_prog,
                } 
            });
        });
        console.log("total units", total_units, total_units*portfolio_value);
        Meteor.users.update({ _id: Meteor.user()._id }, {
            $set: {
                "profile.return_rate": rate,
                "profile.portfolio_value": portfolio_value,
                "profile.monthly_require": monthly_requirement, 
                "profile.total_require": total_requirement,
                "profile.present_time": virtual_present.toISOString(),
                "profile.units": total_units,
                "profile.amount": total_units*portfolio_value,
            }
        });
    }

});

Meteor.users.find({ "status.online": true }).observe({
    /*
        added: function(id) {
            console.log("added", id.status.lastLogin.ipAddr);
            var obj = {
                status: "log On",
                time_stamp: id.status.lastLogin.date,
                ip: id.status.lastLogin.ipAddr
            };
            var context = Active.schema.namedContext("add");
            if (context.validate(obj)) {
                Active.insert(obj);
            }else {
      console.log(context.invalidKeys());
      return false;
    }
                    
        },
        */
        removed: function (id) {
            var obj = {
                status: "log Off",
                from: id.status.lastLogin.date, 
                to: new Date(),
                ip: id.status.lastLogin.ipAddr
            }
            console.log("removed", id.status.lastLogin);
            var context = Active.schema.namedContext("remove");
            if (context.validate(obj)) {
                if (obj['to'].getMinutes() - obj['from'].getMinutes() >= 1)
                    Active.insert(obj);
            } else {
                console.log(context.invalidKeys());
                return false;
            }
            
        }
});
    
Meteor.startup(function () {

    for (var i = 0; i < SAMPLE_GOALS.length; i++)
        for (var j = 0; j < SAMPLE_GOALS[i]["goals"].length; j++)
            if (Goal_catalog.find({ goal: SAMPLE_GOALS[i]["goals"][j] }).count() == 0)
                Goal_catalog.insert(
                    {
                        "keywords": [SAMPLE_GOALS[i]["keyword"]],
                        "goal": SAMPLE_GOALS[i]["goals"][j], "clicks": 0,
                        "A": 0, "B": 0, "C": 0
                    });
      
    /*
    if (Beta.find({}).count() == 0) {
        for (var i = 0; i < 50; i++) {
            Beta.insert({ code: INVITATIONS[i], user: "" });
        }
        Beta.insert({ code: "testtesttest", user: "" });
    }*/
    
});