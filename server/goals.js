Goals = new Mongo.Collection("goals");

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Goals.find().count() === 0) {
      var this_user;
      //if(Meteor.user()) this_user = this.userId;
      //else this_user = "test_user1";
    	this_user = "user01";
    	Goals.insert({ title: "Go to Jay Chou's concert",createdAt: new Date(),  priority: 2, amount: 300, progress: 40, category: "Entertainment", tags: ["Jay Chou", "Concert"], user: this_user, details: "Jay Chou has always been there for me through my adolescent. "});
			Goals.insert({ title: "10-day Honeymoon in Japan", createdAt: new Date(),  priority: 5, amount: 10000, progress: 3, category: "Relationship", tags: ["Honeymoon", "Japan"], user: this_user, details: "My crush loves Japan, although I don't think he knows I exist i.i" });
			Goals.insert({ title: "Buy a condo", createdAt: new Date(),  priority: 5, amount: 2000000, progress: 30, category: "Property", tags: ["condo", "house"], user: this_user, details: "saving up for a good house." });
    }
  });
}