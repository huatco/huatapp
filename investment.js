export const RATES = [0.04, 0.05, 0.09, 0.08];

export const returnRate = function(risk_score) {
    var bucket = assign_bucket(risk_score);
    return RATES[bucket]/12
};
export const assign_bucket = function(risk_score) {
    var bucket = 2;
	if (risk_score > 15) bucket = 1;
	if (risk_score < -15) bucket = 3;
	//Session.set("bucket", bucket);
    return bucket;
};

export const SAMPLE_GOALS = [{"keyword": "Education",  "goals": ["Finish masters degree", "Get into a creative writing class", "Kid's college fund", "Go for an art class"]}
    ,{"keyword": "Lifestyle",  "goals": ["Own a Range Rover", "Own a yacht", "Ride a camel in the desert", "Travel by helicopter", "Stay in Japan for a month"]}
    ,{"keyword": "Life Plans", "goals": ["Plan for retirement", "Japanese old people's home", 'Live in NYC for a year', "Purchase our first home!", "have a kid"]}
    ,{"keyword": "Life Milestone", "goals":  ["Buy Engagement Ring", "Pass Driving Test", "Have a kid", "Start a Family", "Buy my first car!"]}
    ,{"keyword": "Sports",     "goals": ["Learn to Rock Climb", "Go to a Manchester United game", "Take up yoga", "Learn how to ballroom dance", "Go on diving trips"]}
    ,{"keyword": "Nature",     "goals": ["Be on a boat during the sunset", "Camp on the Beach", "See the redwoods", "See Cherry Blossoms in Japan"]}
    ,{"keyword": "Travel",     "goals": ["Visit the Christmas Markets in Germany", "Visit the Osaka Castle", "Visit Macau", "Visit England", "Hear Big Ben chime on the hour in London", "Visit Tanzania",  "See the paddy fields of Vietnam"]} 
    ,{"keyword": "Skills",     "goals": ["Learn to Ride a Motorcycle", "Horseback riding", "Learn to play the Ukulele", "Take up Yoga"]}
    ,{"keyword": "Fan activities", "goals": ["Go to all the Harry Potter locations", "Meet Mike Tyson"]}
    ];

export const SAMPLE_KEYWORDS = ["Education", "Lifestyle", "Life Plans", "Life Milestone", "Sports", "Nature", "Travel", "Skills", "Fan activities"];
