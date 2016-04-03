/*
TODO:
1. work on radio button: category
2. work on adding tags
*/

Template.add_goal.events({
    "submit .add-goal": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var title = event.target.title.value;
      var details = event.target.details.value;
      var amount = event.target.amount.value;
      var priority = event.target.priority.value;
      var year = event.target.year.value;
      var month = event.target.month.value;
      var category = event.target.category.value;
      var this_user = Meteor.user() ? Meteor.user().username : "test_user1";
      
      console.log(title);
      console.log(details);
      console.log(amount);
      console.log(priority);
      console.log(category);
      console.log(year);
 

      var time_stamp = new Date();
      Goals.insert({ title: title,
        time_stamp: time_stamp, 
        created_year: time_stamp.getYear(),
        created_month: time_stamp.getMonth(),   
        goal_month: month,
        goal_year: year, 
        priority: priority, 
        target_amount: amount, 
        current_amount: 0.0, 
        progress: 0,
        category: category,
        user: this_user, 
        details: details,
        current_time: 0
      });
      
      // Clear form
      event.target.title.value = "";
      event.target.details.value = "";
      event.target.amount.value = "";
      event.target.priority.value = "";
      event.target.month.value = "";
      event.target.year.value = "";

      Meteor.call("call_python", function(error) {});
    }
  });