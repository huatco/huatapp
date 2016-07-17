AdminConfig = {
  adminEmails: ['rama@huat.com', 'zikang@huat.com'],
  
	userSchema: new SimpleSchema({
    'profile.gender': { type: String, label: "gender"},
    'profile.riskscore': { type: Number, label: "risk score"},
  }),     
  collections:
  {
    Active: {
      tableColumns: [
        { label: "status", name: "status" },
        { label: "from", name: "from" },
        {label: "to", name: "to"}, 
        { label: "ip", name: "ip" }, 
        
      ]
    }, 
    Bug: {
      routes: {
        view: {
            waitOn: function () { return Meteor.subscribe('bug'); }
          },
      }, 
      tableColumns: [
        { label: "title", name: "title" }, 
        { label: "description", name: 'description' },
        { label: "user", name: "user" },
        
      ]
    }, 
    Goal_catalog: {
      tableColumns: [
        { label: "goal", name: "goal" }, 
        { label: "keywords", name: 'keywords' },
        { label: "clicks", name: "clicks" }, 
        
      ]
    }, 
    Beta: {
      routes: {
        view: {
            waitOn: function () { return Meteor.subscribe('beta'); }
          },
      }, 
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
        { label: "username", name: "username" }, 
        { label: "priority", name: "priority" },
        { label: "user", name: "user" },
        { label: "created_year", name: "created_year" },
        {label: "progress", name: "progress"}
      ]
    }
  }
};

