#To test this code: meteor run
#To test DB: meteor mongo

#Test user: username: lenalena password: lenalena

#DataBase command cheat sheet

users: 
	db.users
	in app: Meteor.users

db.users.insert();
db.users.update({}, {$set: {"new_field": "stuff"}});
db.users.find({_id: "bbb"}, {limit: 5}); #limiting search result to 5