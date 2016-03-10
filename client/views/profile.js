Template.profile.helpers({
	username: Meteor.user().username,
	email: Meteor.user().email,
});