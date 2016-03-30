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
      var category = event.target.category.value;
      var this_user = Meteor.user() ? Meteor.user().username : "test_user1";
      
      console.log(title);
      console.log(details);
      console.log(amount);
      console.log(priority);
      console.log(category);

      
      Goals.insert({ title: title,
        createdAt: new Date(),  priority: priority, 
        amount: amount, progress: 10, 
        //category: "Entertainment", tags: ["Jay Chou", "Concert"], 
        user: this_user, 
        details: details });
      
      // Clear form
      event.target.title.value = "";
      event.target.details.value = "";
      event.target.amount.value = "";
      event.target.priority.value = "";
      Meteor.call("call_python", function(error) {});
    }
  });