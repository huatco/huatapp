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

Router.route('/add_goal', {
  name: 'add_goal',
  template: 'add_goal'
});

Router.route('/risk_profile', {
  name: 'risk_profile',
  template: 'risk_profile'
});

Router.route('/registration', {
  name: 'registration',
  template: 'registration'
});

Router.configure({
  layoutTemplate: 'layout'
});

AccountsTemplates.configure({
    defaultLayout: 'layout',
});

AccountsTemplates.configureRoute('signIn');