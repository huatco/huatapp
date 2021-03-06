var pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
    _id: "username",
    type: "text",
    displayName: "username",
    required: true,
    minLength: 5,
  },
  {
    _id: 'email',
    type: 'email',
    required: true,
    displayName: "email",
    re: /.+@(.+){2,}\.(.+){2,}/,
    errStr: 'Invalid email',
  },
  pwd,
  // {
  //   _id: "amount",
  //   type: "text",
  //   placeholder: "S$100.00 min",
  //   displayName: "Initial Deposit Amount (SGD)",
  //   required: true,
  //   func: function(value){
  //     if (value >= 100)
  //       return false;
  //     return true;
  //   },
  //   errStr: 'Please enter minimum deposit of S$100.00',
  // },
  // {
  //   _id: "increment",
  //   type: "text",
  //   placeholder: "S$50.00 min",
  //   displayName: "Monthly Increment Amount (SGD)",
  //   required: true,
  //   func: function(value){
  //     if (value >= 50)
  //       return false;
  //     return true;
  //   },
  //   errStr: 'Please enter minimum increment of S$50.00',
  // },
]);

AccountsTemplates.configure({
  homeRoutePath:'/registration'
});

Template.topbar.helpers({
  goal_item: function () {
    return { goal: "", _id: "" };
  },
  username: function () {
    return Meteor.user() && Meteor.user().username;
  }, 
});

Template.topbar.events({
  "click .add_goal": function () {
    Session.set("section", 1);
    Session.set("title", "");
    Session.set("category", "");
  },
})

AdminConfig = { 
  adminEmails: ['rama@huat.com'], 
  collections: 
  { 
    Analytics: {
      icon: 'bar-chart',
    }, 
  } 
}