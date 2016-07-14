Router.route('/', {
  name: 'dashboard',
  template: 'dashboard'
});

Router.route('/bucketlist', {
  name: 'bucketlist',
  template: 'bucketlist'
});

Router.route('/portfolio', {
  name: 'portfolio',
  template: 'portfolio'
});

Router.route('/profile', {
  name: 'profile',
  template: 'profile'
});

Router.route('/support', {
  name: 'support',
  template: 'support'
});

Router.route('/add_goal', {
  name: 'add_goal',
  template: 'goal_form'
});

Router.route('/beta', {
  name: 'beta',
  template: 'beta'
});

Router.route('/add_goal1/:_id', function() {
  console.log(this.params._id);
  this.render("goal_form", {data: function(){return {_id: this.params._id};}});
});

Router.route('/risk_profile', {
  name: 'risk_profile',
  template: 'risk_profile'
});

Router.route('/registration', {
  name: 'registration',
  template: 'registration'
});

Router.route('/goal/:_id', function() {
  this.render('goal', {
    data: function() {
      return Goals.findOne({_id: this.params._id});
    }
  });
});

Router.configure({
  layoutTemplate: 'layout'
});

AccountsTemplates.configure({
    defaultLayout: 'layout',
});

AccountsTemplates.configureRoute('signIn');