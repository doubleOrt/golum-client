/*
bug 1 in bugs.txt explains a bug that occured in this page and the steps that were taken to remove it.
*/


// will be set on document load.
var COMMENTS_CONTAINER_ELEMENT;
// a comment cannot be longer than 800 characters.
var MAXIMUM_COMMENT_LENGTH;


// we use this variable to prevent multiple calls to "get_post_comments.php", otherwise there would be duplicate comments, be sure to set this variable to true whenever you call "getComments()", and set it to false after a successful return in the function.
var commentsPreventMultipleCalls = false;

var commentsIntervalVar; 
var commentsIntervalObject;


var ajax_call_to_get_comments;

function getComments(postId,row_offset,pinCommentToTop, callback) {

if(typeof postId == "undefined" || typeof row_offset == "undefined" || typeof pinCommentToTop == "undefined" || typeof callback != "function") {
return false;	
}

if(commentsPreventMultipleCalls == false) {
	
commentsPreventMultipleCalls = true;

var dataObj = {};
dataObj["post_id"] = postId;
dataObj["row_offset"] = row_offset;
dataObj["pin_comment_to_top"] = pinCommentToTop;	

ajax_call_to_get_comments = $.get({
url:PATH_TO_SERVER_PHP_FILES + "get_post_comments.php",
data:dataObj,
success:function(data) {

var data_arr = JSON.parse(data);

callback(data_arr);	

commentsPreventMultipleCalls = false;
}	
});


}

}


function abort_request_to_get_comments() {
if(typeof ajax_call_to_get_comments != "undefined") {	
ajax_call_to_get_comments.abort();	
}
}



function validateCommentLength(comment) {
if(comment.length > MAXIMUM_COMMENT_LENGTH) {
return false;
}
else {
return true;	
}
}


function addCommentToPost(postId, comment, callback) {

if(typeof postId == "undefined" || typeof comment == "undefined" || typeof callback != "function") {
return false;	
}

// check if the comment's length has exceeded the limit.
if(validateCommentLength(comment) == false) {
Materialize.toast("Comments Cannot Be Longer Than " + MAXIMUM_COMMENT_LENGTH + " Characters, Currently At " + comment.length + "!",4000,"red");	
return false;	
}

$.post({
url:PATH_TO_SERVER_PHP_FILES + "add_comment_to_post.php",
data:{
"post_id": postId,
"comment": comment
},
success: function(data) {
var data_arr = JSON.parse(data);
callback(data_arr);
}	
});
	
}


function deleteComment(commentId, callback) {

$.post({
url:PATH_TO_SERVER_PHP_FILES + "delete_comment.php",
data:{"comment_id":commentId},
success:function(data) {
if(data == 1) {
if(typeof callback != "undefined") {	
callback();	
}
}
}
});
	
}



function get_comments_callback(data, callback) {


$("#totalNumberOfComments").html("(" + data[1] + ")");
$("#totalNumberOfComments").attr("data-total-number",data[1]);


if(data[0].length < 1 && COMMENTS_CONTAINER_ELEMENT.find(".singleComment").length < 1) {
COMMENTS_CONTAINER_ELEMENT.html("<div class='emptyNowPlaceholder'><i class='material-icons'>info</i><br>No comments yet :(</div>");
return false;
}
else if(data[0].length < 1) {
COMMENTS_CONTAINER_ELEMENT.attr("data-end-of-results", "true");	
COMMENTS_CONTAINER_ELEMENT.append(get_end_of_results_mark_up("End of comments"));	
}

for(var i = 0; i < data[0].length; i++) {
COMMENTS_CONTAINER_ELEMENT.append(get_comment_markup(data[0][i], 0));
}

COMMENTS_CONTAINER_ELEMENT.find(".singleComment .actualCommentComment").each(function(){
$(this).html(handle_tags($(this).html()));	
});


$('#commentsModal .actualCommentComment').readmore({
speed: 500,
collapsedHeight:100, 
moreLink: '<a href="#" class="readMore" style="font-size:12px;color:#aaaaaa;position:relative;top:-4px;">More...</a>',
lessLink: '<a href="#" class="readLess" style="font-size:12px;color:#aaaaaa;position:relative;top:-4px;">Less</a>'
});


// initialize dropdowns	
$('#commentsModal .dropdown-button').dropdown({
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


function add_comment_to_post_callback(data_arr) {

// the post element that is the parent of this comment.
var commentSinglePostElement = $(".singlePost[data-actual-post-id=" + COMMENTS_CONTAINER_ELEMENT.attr("data-actual-post-id") + "]");

if(data_arr[0] != "") {
COMMENTS_CONTAINER_ELEMENT.prepend(get_comment_markup(data_arr[0], 0));
COMMENTS_CONTAINER_ELEMENT.find(".singleComment[data-actual-comment-id='" + data_arr[0]["comment_id"] + "']").find(".dropdown-button").dropdown({
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
$('#postCommentTextarea').html("<span class='placeholder' style='color:#aaaaaa'>Type Comment...</span>");
$('#postCommentTextarea').attr('data-state','0');
// remove the empty now placeholder
COMMENTS_CONTAINER_ELEMENT.find(".emptyNowPlaceholder").remove();
}

if(data_arr[1] != "") {
Materialize.toast(data_arr[1] ,5000 ,"red")	
}

setNewNumber($("#totalNumberOfComments"),"data-total-number",true,true,"");
if(commentSinglePostElement.length > 0) {
// update the comments button's comment number element
set_post_comments_number_string(commentSinglePostElement, parseFloat(commentSinglePostElement.find(".comments_number").attr("data-total-number")) + 1);
}
	
}


function get_post_comments(post_id, pin_comment_to_top) {

$("#postCommentButton").attr("data-actual-post-id", post_id);
COMMENTS_CONTAINER_ELEMENT.attr("data-actual-post-id", post_id);
COMMENTS_CONTAINER_ELEMENT.attr("data-end-of-results", "false");

// empty the COMMENTS_CONTAINER_ELEMENT of the previously viewed post comments 
COMMENTS_CONTAINER_ELEMENT.html("");

showLoading(COMMENTS_CONTAINER_ELEMENT, "50%");
 	
// for details concerning these 2 lines, see the first bug in the bugs.txt file.
commentsPreventMultipleCalls = false;
abort_request_to_get_comments();

if(typeof pin_comment_to_top == "undefined") {
getComments(post_id,0, 0, function(data) {
get_comments_callback(data, function(){
removeLoading(COMMENTS_CONTAINER_ELEMENT);	
});
});
}
else {
getComments(post_id, 0, pin_comment_to_top, function(data){
get_comments_callback(data, function(){
removeLoading(COMMENTS_CONTAINER_ELEMENT);	
});
});	
}
	
}

function set_comments_modal_constants() {
COMMENTS_CONTAINER_ELEMENT = $("#post_comments_container");	
MAXIMUM_COMMENT_LENGTH = 800;
}




$(document).on("dom_and_device_ready", function() {

set_comments_modal_constants();

$("#commentsModal").data("on_visible", set_comments_modal_constants);

// user wants to see post comments
$(document).on("click",".showPostComments",function() {
get_post_comments($(this).attr("data-actual-post-id"), $(this).attr("data-pin-comment-to-top"));
});
// user is infinite scrolling the comments
COMMENTS_CONTAINER_ELEMENT.scroll(function(){	
if($(this).attr("data-end-of-results") === "false") {
if(($(this)[0].scrollHeight - ($(this).scrollTop() + $(this).outerHeight()) == 0)) {
last_call_type = 1;
add_secondary_loading(COMMENTS_CONTAINER_ELEMENT);
getComments($(this).attr("data-actual-post-id"), COMMENTS_CONTAINER_ELEMENT.find(".singleComment").length, 0, function(data){
get_comments_callback(data, function(){
remove_secondary_loading(COMMENTS_CONTAINER_ELEMENT);	
});
});
}
}
});



$(document).on("click",".postCommentTextarea",function(){
$(this).find(".placeholder").remove();	
$(this).attr("data-state","1");
});

$(document).on("focusout",".postCommentTextarea",function(){
if($(this).html().trim() == "") {
$(this).html("<span class='placeholder' style='color:#aaaaaa'>" + $(this).attr("data-placeholder-html") + "</span>");
$(this).attr("data-state","0");
}	
});


// when user presses the comment button.
$(document).on("click","#postCommentButton",function(){
	
if(typeof $(this).attr("data-actual-post-id") == "undefined" || $("#postCommentTextarea").find("#commentsModal .placeholder").length > 0 || 
$("#postCommentTextarea").attr("data-state") == "0" || $("#postCommentTextarea").html().trim().length < 1) {
return false;
}

/* we use text() because our only other option is html() which would give us the encoded html characters 
which would in turn mess-up with the architecture and therefore some html entities would not be rendered
correctly (such as < and >). and remember that val() is not an option since the #postCommentTextarea is 
actually a div. 
*/
addCommentToPost($(this).attr("data-actual-post-id"), $("#postCommentTextarea").text(), function(data){
add_comment_to_post_callback(data);	
COMMENTS_CONTAINER_ELEMENT.find(".singleComment .actualCommentComment").each(function(){
$(this).html(handle_tags($(this).html()));	
});
});

});





/* upvoting and downvoting */

$(document).on("click","#commentsModal .upvoteOrDownvote",function(){

if(typeof $(this).attr("data-upvote-or-downvote") == "undefined" || typeof $(this).parents(".postCommentActions").attr("data-comment-id") == "undefined") {
return false;	
}

var thisUpvotesObject = $(this).parent().find(".upvoteOrDownvote[data-upvote-or-downvote=upvote]");
var thisDownvotesObject = $(this).parent().find(".upvoteOrDownvote[data-upvote-or-downvote=downvote]");
var thisUpvotesNumberObject = $(this).parent().find(".commentUpvotes");
var thisDownvotesNumberObject = $(this).parent().find(".commentDownvotes");


$.post({
url:PATH_TO_SERVER_PHP_FILES + "upvote_downvote_comment.php",
data:{
"comment_id":$(this).parents(".postCommentActions").attr("data-comment-id"),
"type":$(this).attr("data-upvote-or-downvote")
},
success:function(data) {
	
thisUpvotesObject.removeClass('upvoteOrDownvoteActive');
thisDownvotesObject.removeClass('upvoteOrDownvoteActive');
	
eval(data);	
}	
});

});







/* deleting comments */


// want to show them the delete button (a dropdown actually) after they hold (longpress) the comment
var deleteCommentTimeout;
$(document).on("touchstart","#commentsModal .singleComment",function(){

var deleteCommentButton = $(this).find(".deleteCommentButton");

deleteCommentTimeout = setTimeout(function(){
deleteCommentButton.dropdown('open');
},1200);
}).on("touchend touchmove",".singleComment",function(){
clearTimeout(deleteCommentTimeout);	
});



// when a user presses the delete comment button
$(document).on("click",".deleteComment",function(){

if(typeof $(this).attr("data-comment-id") == "undefined") {
return false;	
}	

var thisCommentObject = $(this).parents(".singleComment");

deleteComment($(this).attr("data-comment-id"),function(){thisCommentObject.fadeOut('fast',function(){$(this).remove();});});

setNewNumber($("#totalNumberOfComments"),"data-total-number",false,true,"");


// the post element that is the parent of this comment.
var commentSinglePostElement = $(".singlePost[data-actual-post-id=" + COMMENTS_CONTAINER_ELEMENT.attr("data-actual-post-id") + "]");

if(commentSinglePostElement.length > 0) {
// update the comments button's comment number element
set_post_comments_number_string(commentSinglePostElement, parseFloat(commentSinglePostElement.find(".comments_number").attr("data-total-number")) - 1);
}

});


});
