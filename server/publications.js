Meteor.publish("goals", function(){
    return Goals.find({});
});

Meteor.publish("support", function () {
    return Support.find({});
});

Meteor.publish("goal_catalog", function () {
    return Goal_catalog.find({}); 
});

Meteor.publish("goal", function () {
    var name = Meteor.users.findOne(this.userId);
    return Goals.find({ user: name });
});