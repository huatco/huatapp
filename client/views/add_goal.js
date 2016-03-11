Template.add_goal.events({
    "submit .add-goal": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var title = event.target.title.value;
      //var details = event.target.details.value;
      //var amount = event.target.amount.value;
      //var priority = event.target.priority.value;
      console.log(title);
      //console.log(details);
      //console.log(amount);
      //console.log(priority);
      /*Goals.insert({ title: title,
        createdAt: new Date(),  priority: priority, 
        amount: amount, progress: 0, category: "Entertainment", 
        tags: ["Jay Chou", "Concert"], user: this_user, 
        details: details });
      
      // Clear form
      event.target.title.value = "";
      event.target.details.value = "";
      event.target.amount.value = "";
      event.target.priority.value = "";
      */
    }
  });