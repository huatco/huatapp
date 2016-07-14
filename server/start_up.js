import {SAMPLE_GOALS, investmentAmt, targetPeriod, returnRate} from "../investment.js"


Meteor.methods({
    start_up: function () {
        //populate goal catalog if it's not already populated
        for (var i = 0; i < SAMPLE_GOALS.length; i++)
            for (var j = 0; j < SAMPLE_GOALS[i]["goals"].length; j++)
                if (Goal_catalog.find({ goal: SAMPLE_GOALS[i]["goals"][j] }).count() == 0)
                    Goal_catalog.insert(
                        {
                            "keywords": [SAMPLE_GOALS[i]["keyword"]],
                            "goal": SAMPLE_GOALS[i]["goals"][j], "clicks": 0,
                            "A": 0, "B": 0, "C": 0
                        });
      
        var monthly_requirement = 0
        var total_requirement = 0
        var goalTable = {}
        var goals = Goals.find({ user: Meteor.user().username })
        var score = Meteor.user().profile.risk_score;
        var rate = returnRate(score)
     
        goals.forEach(function (goal) {
            var amt = investmentAmt(goal.target_amount, goal.time_stamp, goal.goal_month, goal.goal_year, rate);
            var p = targetPeriod(goal.goal_month, goal.goal_year);

            (p in goalTable) ? goalTable[p] += goal.target_amount : goalTable[p] = goal.target_amount;

            monthly_requirement += amt;
            total_requirement += parseFloat(goal.target_amount);
            Goals.update({ _id: goal._id }, { $set: { monthly_amt: amt } });
        });
        Meteor.users.update({ _id: Meteor.user()._id }, {
            $set: {
                "profile.return_rate": rate,
                "profile.monthly_require": monthly_requirement, "profile.total_require": total_requirement,
                "profile.goal_table": goalTable
            }
        });
    }

});