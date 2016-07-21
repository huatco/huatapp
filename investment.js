
export const RATES = [0.00, 0.05, 0.075, 0.125];
export const INVITATIONS = ["1S8gDkNtNiqe","21dX7Gm5Jgek","CvldiDwJCfVm","9drRh0cdaYra","nJMmhl3AYZEx","ppulW8X5OVpd","20OA4zGivBXw","VtTI9JQg2yAu","ewN3llooh3Mt","6EtM9KYYqvcf","6XOgKckasVVD","H4XnVMUGNSY9","Dx9if2mWJNqX","Z7xtJLIBZLNJ","SCW8NrDXJtEo","Ur5Dshjs5LkI","DCFMXZ40uZa6","DVOl5zomRVfh","RFBqQ6mY00Mo","kMm8Eq2hPnY8","C8ayM0esorO1","bpNZw7S9IMVk","yO3DaEtqu05o","9M7lo2qELT1n","kQdlJ3Mb1Nmq","n6O9lKQlGZqR","gsHHTVEebIPQ","Ao0Ya1MXeCxd","CMtv8aFkA5x9","lTJECWbnAGUn","goEuAHVeljM2","7VqQhTksBxAC","PM6m6EERj6eo","Oi2LmsPL0qrp","T3dOT3VbQWV3","hzod8a4aBQPU","QenBwlmqurqd","qZsdoKyQ1GXA","9oOZs8ApiRIs","Kcmq8z3Yf1q2","5fWVzUMNEW43","kA9mVJX7eDkZ","Owe3qPpx4niH","LSXJDbUUKX7m","EJzOpIa3ieRa","iw1Q31BWjEoc","GMT58Y8ITYds","izaiSRjBmQBQ","kGvm7JkT6jOl","EnzGQoa8QmZh",];

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

export const investmentAmt = function(amount, start, month, year, r) {
  /*
  r: rate of return
  */
  var start_date = moment(start);
  var target_date = moment([year, month]);
  var periods = target_date.diff(start_date, 'months');
  var denom = 0;
  for(i=0; i<periods; i++){
    var val = Math.pow(1+r, i);
    denom += val;
  }
  investment = amount/denom;
  return investment;
};

export const targetPeriod = function(month, year){
  var present = moment();
  var target = moment([year, month]);
  var period = target.diff(present, 'months');
  return period;
}



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

export const SAMPLE_KEYWORDS = [
    {title: "Education", icon: "fa-book"},
    {title: "Lifestyle", icon: "fa-shopping-bag"}, 
    {title: "Life Plans", icon: "fa-home"},
    {title: "Life Milestone", icon: "fa-trophy"},
    {title: "Sports", icon: "fa-soccer-ball-o"}, 
    {title: "Nature", icon: "fa-tree"}, 
    {title: "Travel", icon: "fa-plane"}, 
    {title: "Skills", icon: "fa-laptop"}, 
    {title: "Fan activities", icon: "fa-star"}
    ];

export const PORTFOLIO_PRICES = ['2763.419922', '2751.560059', '2774.25', '2768.330078', '2785.429932', '2822.969971', '2843.800049', '2862.379883', '2848.090088', '2831.280029', '2809.22998', '2795.090088', '2790.540039', '2791.060059', '2796.75', '2802.51001', '2773.310059', '2766.659912', '2750.22998', '2766.929932', '2763.820068', '2740.110107', '2777.110107', '2781.110107', '2736.060059', '2734.909912', '2745.389893', '2732.870117', '2741.149902', '2766.060059', '2730.800049', '2767.810059', '2773.070068', '2811.199951', '2838.52002', '2862.300049', '2874.719971', '2894.659912', '2900.280029', '2940.429932', '2960.780029', '2949.949951', '2951.810059', '2917.75', '2923.939941', '2913.929932', '2890.409912', '2814.649902', '2809.23999', '2808.320068', '2813.590088', '2811.25', '2800.919922', '2835.350098', '2818.48999', '2840.899902', '2872.780029', '2819.080078', '2830.290039', '2847.389893', '2881.97998', '2880.649902', '2880.689941', '2906.800049', '2880.169922', '2844.209961', '2839.439941', '2847.060059', '2828.860107', '2809.120117', '2810.429932', '2778.77002', '2823.51001', '2837', '2787.620117', '2726.959961', '2682.389893', '2666.51001', '2649.379883', '2603.399902', '2619.959961', '2672.070068', '2660.649902', '2656.870117', '2657.570068', '2613.790039', '2644.580078', '2607.899902', '2539.949951', '2538.280029', '2582.100098', '2623.209961', '2558.48999', '2550.73999', '2579.22998', '2602.409912', '2629.110107', '2562.449951', '2546.179932', '2545.610107']
export const PORTFOLIO_DATES = ['17/6/16', '16/6/16', '15/6/16', '14/6/16', '13/6/16', '10/6/16', '9/6/16', '8/6/16', '7/6/16', '6/6/16', '3/6/16', '2/6/16', '1/6/16', '31/5/16', '30/5/16', '27/5/16', '26/5/16', '25/5/16', '24/5/16', '23/5/16', '20/5/16', '19/5/16', '18/5/16', '17/5/16', '16/5/16', '13/5/16', '12/5/16', '11/5/16', '10/5/16', '9/5/16', '6/5/16', '5/5/16', '4/5/16', '3/5/16', '29/4/16', '28/4/16', '27/4/16', '26/4/16', '25/4/16', '22/4/16', '21/4/16', '20/4/16', '19/4/16', '18/4/16', '15/4/16', '14/4/16', '13/4/16', '12/4/16', '11/4/16', '8/4/16', '7/4/16', '6/4/16', '5/4/16', '4/4/16', '1/4/16', '31/3/16', '30/3/16', '29/3/16', '28/3/16', '24/3/16', '23/3/16', '22/3/16', '21/3/16', '18/3/16', '17/3/16', '16/3/16', '15/3/16', '14/3/16', '11/3/16', '10/3/16', '9/3/16', '8/3/16', '7/3/16', '4/3/16', '3/3/16', '2/3/16', '1/3/16', '29/2/16', '26/2/16', '25/2/16', '24/2/16', '23/2/16', '22/2/16', '19/2/16', '18/2/16', '17/2/16', '16/2/16', '15/2/16', '12/2/16', '11/2/16', '10/2/16', '5/2/16', '4/2/16', '3/2/16', '2/2/16', '1/2/16', '29/1/16', '28/1/16', '27/1/16', '26/1/16']

export const BUCKET_PORTFOLIOS = [
['VTI', 'IVV', 'LQD', 'TLT', 'SCHZ'],
[0.6619165236, 0.001038973255, 0.1180524381,0.1817394196,0.03725333297],
[0.4401053972, 0.001010214154, 0.2203919313, 0.07940569461, 0.2590874474],
[0.2259104152, 0.1010084842, 0.2797979756, 0, 0.3932838212]];

export const BUCKET_VALUES = [
["Bonds", "Stocks", "Expected Volatility", "Effective Expense Ratio"],
[0.3370451907, 0.6629554969, 0.0171760268, 0.08],
[0.5588850733, 0.4411156113, 0.01345145021, 0.08],
[0.6730817968, 0.3269188994, 0.01157907932, 0.08]];

export const PILOT_START_DATE = moment("2016-07-20");

export const ROR = [
    [0.020198454, 0.02246008, 0.023242598, 0.008614959, 0.007091018, 0.008708009, 0.034670802, -0.024258594, 0.003421202, 0.022597915],
    [0.012684713, 0.017053085, 0.021748325, 0.004316131, 0.004158732, 0.007695837, 0.026686965, -0.02050739, 0.001591046, 0.016068317],
    [0.012561243, 0.014568161, 0.01750311, 0.003123681, 0.002642652, 0.004055913, 0.027574635, -0.018353308, 0.001295619, 0.015789348],
];
export const PRICES = [
    [107.5933733, 109.9466273, 112.2657301, 113.9188256, 114.9076172, 113.9561172, 118.6785738, 115.4221626, 116.8882627, 119.8344878],
    [101.382443, 102.8993809, 105.2387166,  106.296252, 106.6716487, 106.162525, 109.5183171,   106.9390431, 107.6777357, 109.68725],
    [105.5635412, 106.8869052, 109.1257479, 110.1489065, 110.3551279, 110.0162832, 113.5471989, 111.1634206, 111.2024388, 113.2615399], 
]