#Huat
##About the Project
Huat is a goal-based financial management application that allows individuals to invest and track their investments towards meeting realistic goals. The Huat App is a javascript application built using [Meteor.js](https://www.meteor.com/). This documentation will get you kickstarted on running the application. Further documentation on the framework can be found in the [official Meteors Docs](https://guide.meteor.com/).

*Note: This quickstart guide is only for Mac users. The Windows environment is not supported at the moment.*


##Quick Start

To get started with the app, you need to ensure that you have Node.js and NPM installed. If you already have them installed, you can skip the first two steps.
###Installing Node

Install the latest version of Node directly on your terminal, using the following command:
```
curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"
```

Or if you use **Homebrew**, you can simply:
```
brew install node
```

###Installing NPM (Node Package Manager)

Since Node comes preinstalled with NPM, you should be able to work with Meteor. However if you wish to ensure that you have the latest version of NPM, you can enter the following:
```
sudo npm install npm -g
```

###Installing Meteor

Meteor.js can be installed using:
```
curl https://install.meteor.com/ | sh
```

###Clone the Repo
Go into your preferred folder and clone this repository. 
```
git clone https://github.com/huatco/huatapp.git
```
Once cloned, `cd huatapp`
###Run Server
Before running the server, update packages using:
```
npm install
meteor update
```
Once the packages have installed, run server with:
```
meteor run
```
The app should now be running on: http://localhost:3000/

You can always use `meteor help` to see what commands are available.



##Application Structure

The project structure closely resembles the official Meteor application structure, with minimal modifications. The overall outline of the project is as follows.
```
huatapp/
	.meteor/   
	client/
		views/
			#All templates and javascript logic 
			bucketlist.html
			bucketlist.js
			...
		#Entry point for the application
		main.html
		main.js
		main.scss
		router.js
		settings.scss
	lib/
		#Database Schema
		admin.js
	packages/
	public/
		#Images and resources
		huat_logo.png
		...
	server/
		#Backend/Server-side logic
	untracked/
	investment.js
	packages.json
	settings.json
	
	
```
The bulk of the application resides in the `client/` folder. This is where all the templates as well as front end logic of the website exists. Database calls are made within the front-end logic as well. 

Meteor uses MongoDB and as such a SimpleSchema meteor package is used to maintain a relational database instead of a NoSQL approach. 

Majority of the server-side logic involves computational logic which runs on every load of the page. These are necessary in order for the application to represent accurate up-to-date information.


##Contributors

Huat was conceived at Smartkarma, a bold tech venture revolutionising the investment landscape in Asia and is being developed in collaboration with students and faculty at the Singapore University of Technology and Design as part of the Capstone Program.

Students: Chong Shi Kai, Han Zikang, Surya Ravikumar, Ramakrishna K

Mentors: Raghav Kapoor, Lynnette Cheah, Zhang Yue, Niyazi Taneri
