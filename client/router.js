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

Router.route('/add-goal', {
  name: 'add-goal',
  template: 'add-goal'
});

Router.configure({
  layoutTemplate: 'layout'
});