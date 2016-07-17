Meteor.publish("goals", function(){
    return Goals.find({});
});


Meteor.publish("bug", function () {
    return Bug.find({});
});

Meteor.publish("goal_catalog", function () {
    return Goal_catalog.find({}); 
});

Meteor.publish("goal", function () {
    var name = Meteor.users.findOne(this.userId);
    return Goals.find({ user: name });
});

Meteor.publish("beta", function () {
    return Beta.find({});
})