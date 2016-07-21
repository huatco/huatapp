Schemas = {};
Schemas.Beta = new SimpleSchema({
  code: { type: String },
  user: { type: String, optional: true },
  
});
Schemas.Bug = new SimpleSchema({
  user: {type: String}, 
  title: { type: String },
  description: { type: String, optional: true },
  time_stamp: {type: Date}
})
Schemas.Goals = new SimpleSchema({
  title: { type: String },
  time_stamp: {type: Date, }, 
  created_year: { type: Number },
  created_month: { type: Number, min: 1, max: 12 },
  goal_month: { type: Number, },
  goal_year: { type: Number, min: 2016},
  target_amount: { type: Number, decimal: true},
  current_amount: {type: Number, decimal: true},
  progress: {type: Number, decimal: true, defaultValue: 0},
  category: {type: String },
  user: {type: String },
  details: { type: String, optional: true },
  current_time: { type: Number },
  priority: { type: Number },
  keywords: {type: String, optional: true},
  monthly_amt: {type: Number, decimal: true, optional: true},
  units: {type: Number, decimal: true, optional: true}
});
Schemas.Active = new SimpleSchema({
  status: { type: String },
  from: { type: Date },
  to: { type: Date },
  ip: { type: String, optional: true }
});
Schemas.Goal_catalog = new SimpleSchema({
  keywords: { type: [String] },
  goal: { type: String },
  clicks: { type: Number },
  A: { type: Number },
  B: { type: Number },
  C: { type: Number },
});

Beta = new Mongo.Collection("beta");
Beta.attachSchema(Schemas.Beta);
Beta.schema = Schemas.Beta;

Active = new Mongo.Collection("active");
Active.attachSchema(Schemas.Active);
Active.schema = Schemas.Active;

Goals = new Mongo.Collection("goals");
Goals.attachSchema(Schemas.Goals);
Goals.schema = Schemas.Goals;

Goal_catalog = new Mongo.Collection("goal_catalog");
Goal_catalog.attachSchema(Schemas.Goal_catalog);
Goal_catalog.schema = Schemas.Goal_catalog;

Bug = new Mongo.Collection("bug");
Bug.attachSchema(Schemas.Bug);
Bug.schema = Schemas.Bug;

AdminConfig = {
  adminEmails: ['rama@huat.com', 'zikang@huat.com'],
  
	userSchema: new SimpleSchema({
    'profile.gender': { type: String, label: "gender"},
    'profile.riskscore': { type: Number, label: "risk score" },
    'profile.increment': { type: Number, label: "increment" },
    'profile.amount': {type: Number, label: "amount"}, 
  }),     

  collections:
  {
    Active: {
      omitFields: [], 
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
      omitFields: [], 
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
        { label: "created_month", name: "created_month" }, 
        { label: "progress", name: "progress" },
        { label: "goal_month", name: "goal_month" },
        { label: "goal_year", name: "goal_year" },
        { label: "category", name: "category" },
        {label: "units", name: "units"}, 
        
      ]
    }
  }
};

