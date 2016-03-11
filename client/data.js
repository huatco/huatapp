
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Goals.find().count() === 0) {
      Goals.insert({ title: "Go to Jay Chou's concert", 
									createdAt: new Date(),  
									priority: 2, 
									amount: 300,
									progress: 40,
									category: "Entertainment", 
									tags: ["Jay Chou", "Concert"],
									ID: 0,
									details: "Jay Chou has always been there for me through my adolescent. "
									});
    }
  });
}
