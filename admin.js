AdminConfig = {
  adminEmails: ['rama@huat.com', 'zikang@huat.com'],
  
	userSchema: new SimpleSchema({
    'profile.gender': { type: String, label: "gender"},
    'profile.riskscore': { type: Number, label: "risk score"},
  }),     
  collections:
  {
    Beta: {
      tableColumns: [
        { label: "code", name: "code" }, 
        { label: "user", name: 'user' },
      ]
    }, 
    Goals: {
      routes: {
        view: {
            waitOn: function () { return Meteor.subscribe('goals'); }
          },
      }, 
      tableColumns: [
        { label: 'title', name: 'title' },
        { label: 'target amount', name: 'target_amount' },
        { label: "monthly_amt", name: "monthly_amt" }, 
        {label: "username", name: "username"}, 
      ]
    }
  }
};

