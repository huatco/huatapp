var score = 0;
var stepcount = 0;
var questions = [
	{
		title: "I prefer a job with",
		option1: "Fixed Wage",
		option2: "Variable Commission"
	},
	{
		title: "I would rather have",
		option1: "Stable and Secure Job",
		option2: "High Paying Risky Job"
	},
	{
		title: "When studying for an exam, I usually",
		option1: "Spend equal time on all topics",
		option2: "Prioritise on the topics more likely tested"
	},
	{
		title: "I would prefer working in a",
		option1: "Multi National Company",
		option2: "Startup"
	},
	{
		title: "When I think of risk, I think of",
		option1: "Danger",
		option2: "Thrill"
	},
	{
		title: "When going on holiday, I would go",
		option1: "For a Package Tour",
		option2: "Free and Easy"
	},
	{
		title: "I'd much rather eat at a",
		option1: "Food Court",
		option2: "Hawker Centre"
	},
	{
		title: "My company is laying off employees. I see this as",
		option1: "Uncertainty of my next paycheck",
		option2: "Opportunity to move on"
	},
	{
		title: "I just inherited a $100k property. By next year, the value might be $150k or $50k with an equal chance. I would",
		option1: "Sell it immediately",
		option2: "Hold for a year"
	},
	{
		title: "I like to engage in",
		option1: "Recreational Activities",
		option2: "Competetive Activities"
	},
];
var questionDep = new Tracker.Dependency;

Template.risk_profile.helpers ({
	question: function(){
		console.log("score:"+score);
		questionDep.depend();
		return questions[stepcount];
	},
	riskscore: function(){
		var val = (score/10) * 100;
		return val;
	}
});

Template.risk_profile.events ({
	"click .opt1": function() {
		stepcount += 1;
		questionDep.changed();
	},
	"click .opt2": function() {
		score +=1
		stepcount += 1;
		questionDep.changed();
	},
})