/*
bug 1 in bugs.txt explains a bug that occured in this page and the steps that were taken to remove it.
*/


// will be set on document load.
var REPLIES_CONTAINER_ELEMENT;


// we use this variable to prevent multiple calls to "get_comment_replies.php", otherwise there would be duplicate replies, be sure to set this variable to true whenever you call "getReplies()", and set it to false after a successful return in the function.
var repliesPreventMultipleCalls = false;

var repliesIntervalVar;
var repliesIntervalObject;

var ajax_call_to_get_replies;

function getReplies(commentId,row_offset,pinReplyToTop, callback) {

if(typeof commentId == "undefined" || typeof row_offset == "undefined" || typeof pinReplyToTop == "undefined" || typeof callback != "function") {
return false;	
}

if(repliesPreventMultipleCalls == false) {
repliesPreventMultipleCalls = true;	

var dataObj = {};
dataObj["comment_id"] = commentId;
dataObj["row_offset"] = row_offset;

if(typeof pinReplyToTop != "undefined") {
dataObj["pin_comment_to_top"] = pinReplyToTop;	
}


ajax_call_to_get_replies = $.get({
url:"http://192.168.1.100/golum/components/get_comment_replies.php",
data:dataObj,
success:function(data) {	
console.log(data);
var data_arr = JSON.parse(data);

callback(data_arr)	

repliesPreventMultipleCalls = false;
}	
});

}

}


function abort_request_to_get_replies() {
if(typeof ajax_call_to_get_replies != "undefined") {	
ajax_call_to_get_replies.abort();	
}
}




function addReplyToComment(commentId, reply, isReplyTo, callback) {

if(typeof commentId == "undefined" || typeof reply == "undefined" || typeof callback != "function") {
return false;	
}


// check if the comment's length has exceeded the limit.
if(validateCommentLength(reply) == false) {
Materialize.toast("Comments Cannot Be Longer Than " + MAXIMUM_COMMENT_LENGTH + " Characters, Currently At " + comment.length + "!",4000,"red");	
return false;	
}

var dataArr = {};

dataArr["comment_id"] = commentId;
dataArr["reply"] = reply;
if(typeof isReplyTo != "undefined") {
dataArr["is_reply_to"] = isReplyTo;	
}

$.post({
url:"http://192.168.1.100/golum/components/add_reply_to_comment.php",
data:dataArr,
success: function(data) {
console.log(data);
if(data != "") {	
var data_arr = JSON.parse(data);
callback(data_arr);
}
}	
});
	
}


function add_reply_to_comment_callback(data_arr) {

var reply_comment_element = $(".singleComment[data-actual-comment-id=" + REPLIES_CONTAINER_ELEMENT.attr("data-comment-id") + "]");

if(data_arr[0] != "") {
REPLIES_CONTAINER_ELEMENT.prepend(get_comment_markup(data_arr[0], 1));
REPLIES_CONTAINER_ELEMENT.find(".singleComment[data-actual-comment-id='" + data_arr[0]["comment_id"] + "']").find(".dropdown-button").dropdown({
inDuration: 300,
outDuration: 225,
constrain_width: false, // Does not change width of dropdown to that of the activator
hover: false, // Activate on hover
gutter: 0, // Spacing from edge
belowOrigin: true, // Displays dropdown below the button
alignment: 'left', // Displays dropdown with edge aligned to the left of button
stopPropagation:true
}
);
$('#replyToCommentTextarea').html("<span class='placeholder' style='color:#aaaaaa'>Type Reply...</span>");
$('#replyToCommentTextarea').attr('data-state','0');
// remove the empty now placeholder
REPLIES_CONTAINER_ELEMENT.find(".emptyNowPlaceholder").remove();
}

if(data_arr[1] != "") {
Materialize.toast(data_arr[1] ,5000 ,"red")	
}

setNewNumber($("#totalNumberOfReplies"),"data-total-number",true,true,"");
// update the reply button's (belonging to the comment element) reply number element
if(reply_comment_element.length > 0) {
setNewNumber(reply_comment_element.find(".reply_button_total_replies"),"data-total-number",true,true,"");
}


}




function get_replies_callback(data, callback) {


$("#totalNumberOfReplies").html("(" + data[1] + ")");
$("#totalNumberOfReplies").attr("data-total-number",data[1]);

if(data[0].length < 1 && REPLIES_CONTAINER_ELEMENT.find(".singleComment").length < 1) {
REPLIES_CONTAINER_ELEMENT.html("<div class='emptyNowPlaceholder'><i class='material-icons'>info</i><br>No replies yet :(</div>");
return false;
}
else if(data[0].length < 1) {
REPLIES_CONTAINER_ELEMENT.attr("data-end-of-results", "true");	
REPLIES_CONTAINER_ELEMENT.append(get_end_of_results_mark_up("End of replies"));	
}


for(var i = 0; i < data[0].length; i++) {
REPLIES_CONTAINER_ELEMENT.append(get_comment_markup(data[0][i], 1));	
}

REPLIES_CONTAINER_ELEMENT.find(".singleComment .actualCommentComment").each(function(){
$(this).html(handle_tags($(this).html()));	
});

REPLIES_CONTAINER_ELEMENT.find('.actualCommentComment').readmore({
speed: 500,
collapsedHeight:100, 
moreLink: '<a href="#" class="readMore" style="font-size:12px;color:#aaaaaa;position:relative;top:-4px;">More...</a>',
lessLink: '<a href="#" class="readLess" style="font-size:12px;color:#aaaaaa;position:relative;top:-4px;">Less</a>'
});


// initialize dropdowns	
REPLIES_CONTAINER_ELEMENT.find('.dropdown-button').dropdown({
inDuration: 300,
outDuration: 225,
constrain_width: false, // Does not change width of dropdown to that of the activator
hover: false, // Activate on hover
gutter: 0, // Spacing from edge
belowOrigin: true, // Displays dropdown below the button
alignment: 'left', // Displays dropdown with edge aligned to the left of button
stopPropagation:true
}
);


if(typeof callback == "function") {
callback();	
}

}





$(document).ready(function(){


REPLIES_CONTAINER_ELEMENT = $("#commentRepliesContainer");



// user wants to see comment replies

$(document).on("click",".addReplyToComment",function(){
	
// empty the REPLIES_CONTAINER_ELEMENT of the previously viewed post comments 
REPLIES_CONTAINER_ELEMENT.html("");		

showLoading(REPLIES_CONTAINER_ELEMENT, "50%");

// for details concerning these 2 lines, see the first bug in the bugs.txt file.
repliesPreventMultipleCalls = false;
abort_request_to_get_replies();

$("#replyToCommentButton").attr("data-comment-id",$(this).attr("data-comment-id"));
REPLIES_CONTAINER_ELEMENT.attr("data-comment-id",$(this).attr("data-comment-id"));
REPLIES_CONTAINER_ELEMENT.attr("data-end-of-results", "false");

if(typeof $(this).attr("data-pin-comment-to-top") == "undefined") {
getReplies($(this).attr("data-comment-id"),0, 0, function(data){
get_replies_callback(data, function(){
removeLoading(REPLIES_CONTAINER_ELEMENT);	
});
});
}
else {
getReplies($(this).attr("data-comment-id"),0,$(this).attr("data-pin-comment-to-top"), function(data){
get_replies_callback(data, function(){
removeLoading(REPLIES_CONTAINER_ELEMENT);	
});
});	
}	
	
});
// infinite scrolling the replies
REPLIES_CONTAINER_ELEMENT.scroll(function(){
if($(this).attr("data-end-of-results") === "false") {
if(($(this)[0].scrollHeight - ($(this).scrollTop() + $(this).outerHeight()) == 0) && repliesPreventMultipleCalls == false) {
add_secondary_loading(REPLIES_CONTAINER_ELEMENT);	
getReplies($(this).attr("data-comment-id"), REPLIES_CONTAINER_ELEMENT.find(".singleComment").length, 0, function(data){
get_replies_callback(data, function(){
remove_secondary_loading(REPLIES_CONTAINER_ELEMENT);	
});
});
}
}
});



// upvoting and downvoting 

$(document).on("click","#commentRepliesModal .upvoteOrDownvote",function(){

if(typeof $(this).attr("data-upvote-or-downvote") == "undefined") {
return false;	
}

if(typeof $(this).parents(".postCommentActions").attr("data-comment-id") == "undefined") {
return false;	
}

var thisUpvotesObject = $(this).parent().find(".upvoteOrDownvote[data-upvote-or-downvote=upvote]");
var thisDownvotesObject = $(this).parent().find(".upvoteOrDownvote[data-upvote-or-downvote=downvote]");
var thisUpvotesNumberObject = $(this).parent().find(".commentUpvotes");
var thisDownvotesNumberObject = $(this).parent().find(".commentDownvotes");

$.post({
url:"http://192.168.1.100/golum/components/upvote_downvote_reply.php",
data:{
"reply_id":$(this).parents(".postCommentActions").attr("data-comment-id"),
"type":$(this).attr("data-upvote-or-downvote")
},
success:function(data) {
thisUpvotesObject.removeClass('upvoteOrDownvoteActive');
thisDownvotesObject.removeClass('upvoteOrDownvoteActive');	
eval(data);	
}	
});

});


// deleting replies

var deleteReplyTimeout;
var deleteReplyButton;
$(document).on("touchstart","#commentRepliesModal .singleComment",function(){

deleteReplyButton = $(this).find(".deleteCommentButton");

deleteReplyTimeout = setTimeout(function(){
deleteReplyButton.dropdown('open');
},1200);
}).on("touchend touchmove",".singleComment",function(){
clearTimeout(deleteReplyTimeout);	
});


$(document).on("click",".deleteReply",function(){

if(typeof $(this).attr("data-comment-id") == "undefined") {
return false;	
}	

var thisCommentObject = $(this).parents(".singleComment");

deleteReply($(this).attr("data-comment-id"),function(){thisCommentObject.fadeOut('fast',function(){ $(this).remove();});});

setNewNumber($("#totalNumberOfReplies"),"data-total-number",false,true,"");	
setNewNumber($("#commentsModal .singleComment[data-comment-id='" + REPLIES_CONTAINER_ELEMENT.attr("data-comment-id") + "']"),"data-total-number",false,true,"");	

// the post element that is the parent of this comment.
var reply_single_comment_element = $("#commentsModal .singleComment[data-actual-comment-id=" + REPLIES_CONTAINER_ELEMENT.attr("data-comment-id") + "] .reply_button_total_replies");

if(reply_single_comment_element.length > 0) {
// update the reply button's reply number element
setNewNumber(reply_single_comment_element, "data-total-number", false, true,"");	
}


});

function deleteReply(replyId, callback) {

$.post({
url:"http://192.168.1.100/golum/components/delete_reply.php",
data:{"reply_id":replyId},
success:function(data) {
console.log(data);	
if(data == "1") {
if(typeof callback != "undefined") {
callback();	
}
}	
}
});
	
}





// user wants to reply to a reply

$(document).on("click",".addReplyToReply",function(){

if(typeof $(this).attr("data-commenter-full-name") == "undefined" || typeof $(this).attr("data-commenter-id") == "undefined") {
return false;	
}

$("#replyToCommentTextarea").html("<a href='#modal1' class='replyToFullname  modal-trigger showUserModal view-user' data-user-id='" + $(this).attr("data-commenter-id") + "' data-reply-to='" + $(this).attr("data-commenter-id") + "'>" + $(this).attr("data-commenter-full-name") + "&nbsp;</a>");	
$("#replyToCommentTextarea").focus();
$("#replyToCommentTextarea").attr("data-state","1");
movePointerToEnd($("#replyToCommentTextarea").get(0));	
});


// when user presses the button to reply to a comment
$(document).on("click","#replyToCommentButton",function(){

if(typeof $(this).attr("data-comment-id") == "undefined" || $("#replyToCommentTextarea").find("#commentRepliesModal .placeholder").length > 0 || 
$("#replyToCommentTextarea").attr("data-state") == "0" || $("#replyToCommentTextarea").html().trim().length < 1) {
return false;	
}	

var isReplyTo;
if($("#replyToCommentTextarea").find("a").length > 0) {
isReplyTo = $("#replyToCommentTextarea").find("a").attr("data-reply-to");
$("#replyToCommentTextarea").find("a").remove();	
}

/* we use text() because our only other option is html() which would give us the encoded html characters 
which would in turn mess-up with the architecture and therefore some html entities would not be rendered
correctly (such as < and >). and remember that val() is not an option since the #postCommentTextarea is 
actually a div. 
*/
addReplyToComment( $(this).attr("data-comment-id"), $("#replyToCommentTextarea").text(), isReplyTo, function(data){
add_reply_to_comment_callback(data);
REPLIES_CONTAINER_ELEMENT.find(".singleComment .actualCommentComment").each(function(){
$(this).html(handle_tags($(this).html()));	
});	
});

});



});