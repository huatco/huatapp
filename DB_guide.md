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

User subscription mode -> not request/response
user subscribe to an event

atmosphere is the package manager

client: mini-mongo, spacebar(the dynamic content in template)
server: 

#guides on setting up server(nginx, upstart, ssl)

https://www.digitalocean.com/community/tutorials/how-to-deploy-a-meteor-js-application-on-ubuntu-14-04-with-nginx

https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-server-blocks-virtual-hosts-on-ubuntu-14-04-lts

https://www.digitalocean.com/community/tutorials/how-to-create-a-ssl-certificate-on-nginx-for-ubuntu-12-04
