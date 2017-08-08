

function postVote(postObject, voteOptionIndex) {

if(typeof postObject.attr("data-actual-post-id") == "undefined" || typeof postObject.attr("data-poster-id") == "undefined" || typeof postObject.attr("data-already-voted") == "undefined" || typeof voteOptionIndex == "undefined") {
return false;	
}
else {
	
var postId = postObject.attr("data-actual-post-id");
var posterId = postObject.attr("data-poster-id");
var voterHasAlreadyVoted = postObject.attr("data-already-voted");

$.post({
url:PATH_TO_SERVER_PHP_FILES + "vote.php",
data:{
"post_id": postId,
"poster_id": posterId,
"option_index": voteOptionIndex,
"already_voted": voterHasAlreadyVoted
},
success:function(data) {	
// so user can't vote twice.
postObject.attr("data-already-voted","true");
}	
});

}
	
}


function getVotedPostsVotesMarkup() {
$(".loadPostComponents").each(function(){	
if($(this).find(".selectedOptionContainer").length == 0 && $(this).find(".votesContainer").length == 0) {	
var this_post_element = $(this); 
get_votes_data(this_post_element.attr("data-actual-post-id"), this_post_element.attr("data-post-type"), function(data){
get_post_votes_callback(this_post_element, data, true);	
});	
}
});
}


function get_votes_data(post_id, post_type, callback) {	

if(typeof post_id == "undefined" || typeof post_type == "undefined") {
return false;	
}

$.get({
url:PATH_TO_SERVER_PHP_FILES + "get_votes_data.php",
data:{
"post_id": post_id,
"post_type": post_type
},
success:function(data) {
var data_arr = JSON.parse(data);	
if(typeof callback == "function") {
callback(data_arr);	
}
}	
});
}


function get_post_votes_callback(post_element ,data, do_animations) {


// remove markup if it already exists.
post_element.find(".vote_holder .votesContainer").remove();

var post_type = post_element.attr("data-post-type");

for(var i = 0;i<data[1].length;i++) {	
data[1][i]["post_type"] = post_type;
data[1][i]["user_vote_index"] = data[0]["user_vote_index"];
data[1][i]["index_is_majority"] = (i == data[0]["majority_vote_index"] ? true : false);
post_element.find(".vote_holder[data-option-index=" + data[1][i]["vote_index"] + "]").prepend( get_vote_markup(data[1][i], post_element.attr("data-positive-icon"), post_element.attr("data-negative-icon")) );
if(do_animations == true) {
post_element.attr("data-post-type") == "3" || post_element.attr("data-post-type") == "4" ? post_element.find(".votesContainerChild").addClass("skewScaleItem") : post_element.find(".votesContainerChild").addClass("scaleVerticallyCenteredItem");
}
}

// if the user has already voted.
if(post_element.attr("data-already-voted") == "true") {
post_element.find(".votesContainer").show();	
post_element.find(".posterInfoMegaContainer").css("display","inline-block");
}
	
}


function get_vote_markup(data, positive_icon, negative_icon) {
return `<div class='votesContainer'>
<div class='votesContainerChild'>
<div class='votesIcon fullyRoundedBorder white-text' ` + (data["vote_index"] == data["user_vote_index"] ? `data-user-vote='true'`  : `` ) +`><i class='material-icons'>`+ (data["post_type"] == 1 ? (data["vote_index"] == 0 ? positive_icon : negative_icon) : (data["vote_index"] == data["user_vote_index"] ? positive_icon : negative_icon)) +`</i></div>
<div class='totalVotesNumber' `+ (data["vote_index"] == data["user_vote_index"] ? `data-user-vote='true'`  : ``) +` data-votes-number='`+ data["index_total_votes"] +`'>`+ data["index_total_votes"] + ` Vote` + (data["index_total_votes"] != 1 ? `s` : ``) +`</div>
<div class='totalVotesPercentage'>`+ data["index_votes_percentage_in_total"] +`%</div>
</div>
</div>`;
}



/* we do this to avoid relying on an ajax call to give us the new markup for the votes after the user votes, because it would be slower, so instead whenever the user votes, just pass
the .singlePost object and the option index of the user's vote to this function and it will handle everything. */
function showNewPostVotes(singlePostElement,userOptionIndex) {
		
singlePostElement.find(".votesContainer").show();

var oldVotesNewNum = parseFloat(singlePostElement.find(".vote_holder .totalVotesNumber[data-user-vote='true']").attr("data-votes-number")) - 1;
var newVotesNewNum = parseFloat(singlePostElement.find(".vote_holder[data-option-index='" + userOptionIndex + "']").find(".totalVotesNumber").attr("data-votes-number")) + 1;

setNewNumber(singlePostElement.find(".vote_holder .totalVotesNumber[data-user-vote='true']"),"data-votes-number",false,false," Vote"  + (oldVotesNewNum == 1 ? "" : "s"));	
singlePostElement.find(".vote_holder").find(".totalVotesNumber, .votesIcon").attr("data-user-vote","false");	
singlePostElement.find(".vote_holder[data-option-index='" + userOptionIndex + "']").find(".totalVotesNumber , .votesIcon").attr("data-user-vote","true");	
setNewNumber(singlePostElement.find(".vote_holder .totalVotesNumber[data-user-vote='true']"),"data-votes-number",true,false," Vote" + (newVotesNewNum == 1 ? "" : "s"));	

if(singlePostElement.attr("data-post-type") != "1") {
singlePostElement.find(".votesIcon i").html(singlePostElement.attr("data-negative-icon"));	
singlePostElement.find(".votesIcon[data-user-vote=true] i").html(singlePostElement.attr("data-positive-icon"));	
} 

var allVotesNumber = 0;
singlePostElement.find(".votesContainer").each(function(){
// just for the worst case scenario. we check if the data-votes-number actually exists.
if(typeof $(this).find(".totalVotesNumber").attr("data-votes-number") != "undefined") {
allVotesNumber += parseFloat($(this).find(".totalVotesNumber").attr("data-votes-number"));
}	
});

// now recalculate the percentages.
singlePostElement.find(".votesContainer").each(function(){
// just for the worst case scenario. we check if the data-votes-number actually exists.
if(typeof $(this).find(".totalVotesNumber").attr("data-votes-number") != "undefined") {
$(this).find(".totalVotesPercentage").html(Math.round((parseFloat($(this).find(".totalVotesNumber").attr("data-votes-number")) / allVotesNumber) * 100) + "%");
// give a new height to the votesLine.
var newVotesLineHeight = Math.round(parseFloat($(this).find(".totalVotesNumber").attr("data-votes-number")) / allVotesNumber) * parseFloat($(this).find(".votesLineContainer").attr("data-max-height")) + "px";
$(this).find(".votesLineContainer").css("height",newVotesLineHeight);
}	
});

// re-style majorities and minorities
singlePostElement.find(".votesIcon, .votesLine").removeClass("majorityVoteBackgroundColor").addClass("minorityVoteBackgroundColor");
var majorityVotes = getMajorityVoteIndex(singlePostElement);
for(var i = 0;i < majorityVotes.length;i++) {
singlePostElement.find(".vote_holder[data-option-index='" + majorityVotes[i] + "'] .votesIcon, .vote_holder[data-option-index='" + majorityVotes[i] + "'] .votesLine").removeClass("minorityVoteBackgroundColor").addClass("majorityVoteBackgroundColor");	
}


}



// gives you an array that contains the index of the majority vote(s) in a post.
function getMajorityVoteIndex(singlePostElement) {

var majorityVotes = [];

singlePostElement.find(".vote_holder").each(function(){
if(typeof $(this).attr("data-option-index") != "undefined") {
var thisTotalVotesNumber = $(this).find(".totalVotesNumber").attr("data-votes-number");
var thisIsMajority = true;
singlePostElement.find(".vote_holder").each(function(){
var thatTotalVotesNumber = $(this).find(".totalVotesNumber").attr("data-votes-number");
if(thisTotalVotesNumber < thatTotalVotesNumber) {
thisIsMajority = false;
}
});	
if(thisIsMajority == true) {
majorityVotes.push(parseFloat($(this).attr("data-option-index")));	
}
}
});

return majorityVotes;
}





/* pass a single post element, it will tell you if the user's vote falls in the minority, average or majority category based on the percentage of the total votes of the user's option 
relative to the total votes on the post */
function isVoteMajorityOrMinorityOrAverage(singlePostElement) {

var totalVotes = 0;
var userVoteTotalVotes = 0;

var counter = 0;


singlePostElement.find(".vote_holder").each(function(){
if(typeof $(this).attr("data-option-index") != "undefined") {
var totalVotesElement = $(this).find(".totalVotesNumber");
totalVotes += parseFloat(totalVotesElement.attr("data-votes-number"));	
if(totalVotesElement.attr("data-user-vote") == "true") {
userVoteTotalVotes = totalVotesElement.attr("data-votes-number");
}
counter++;	
}
});
	
	
var userOptionPercentageOfAllVotes = (userVoteTotalVotes / totalVotes) * 100;	
	
return (userOptionPercentageOfAllVotes > 40 ? (userOptionPercentageOfAllVotes > 60 ? 1 : 3) : 2);		

}


// adds those fancy emoji scaling up effect upon voting
function reactToVote(postObject, x_position, y_position) {

var value = isVoteMajorityOrMinorityOrAverage(postObject);

if(value == 1) {	
$("body").append("<div class='postReaction postReactionAnimation' style='position:fixed;left:" + x_position + "px;top:" + y_position + "px'><img src='icons/emojis/14.svg' alt='Trendy'/><br><div class='postReactionText'>Trendy</div></div>");	
}
else if(value == 2) {
$("body").append("<div class='postReaction postReactionAnimation' style='position:fixed;left:" + x_position + "px;top:" + y_position + "px'><img src='icons/emojis/73.svg' alt='Trendy'/><br><div class='postReactionText'>Grumpy</div></div>");	
}
else if(value == 3) {
$("body").append("<div class='postReaction postReactionAnimation' style='position:fixed;left:" + x_position + "px;top:" + y_position + "px'><img src='icons/emojis/85.svg' alt='Trendy'/><br><div class='postReactionText'>Average</div></div>");		
}
	
}

