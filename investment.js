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
}