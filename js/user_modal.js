

// the imagepath referred to by this variable will be used for the background image of users who have not uploaded a background image of their own yet.
var DEFAULT_USER_PROFILE_BACKGROUND_IMAGE = "icons/default_user_profile_background_image.png";
var MAXIMUM_USER_PROFILE_BACKGROUND_IMAGE_SIZE = 5000000;
var MAXIMUM_USER_PROFILE_AVATAR_IMAGE_SIZE = 5000000;
var USER_LETTER_AVATAR_SIZE = 120;
// will be set on document load
var PROFILE_CONTAINER_ELEMENT;
var USER_PROFILE_NEW_MESSAGES_NUM;
var USER_PROFILE_FOLLOWER_COUNTER;
var USER_PROFILE_FOLLOWING_COUNTER;
var USER_PROFILE_TAGS_COUNTER;
var USER_PROFILE_POSTS_COUNTER;
var USER_PROFILE_KNOWN_INFO_CONTAINER;
var USER_PROFILE_POSTS_CONTAINER;

// these 2 variables exist for the sake of hotfixing bug 3 in the bugs.txt file
var USER_PROFILE_SELECTS_CONTAINER;
var USER_PROFILE_SELECTS_CONTAINER_HTML;



// this var will block any calls to the "userModalGet.php" file as soon as a call is made, and will re-allow these calls after the call succeeds.
var userModalShouldServerSide = true;	



// first parameter is the id of the user, second parameter is the element that the markup for that user should be added to, and the last function is a callback that must have 1 parameter (because we pass to it an array of info related to the requested user).
function getUser(userId, callback) {
	
// set this to false to prevent weird things from occuring when the user activates edit mode on his profile, and then goes to another user's profile without deactivating their edit mode.
editModeActive = false;

if(userModalShouldServerSide == true) {

userModalShouldServerSide = false;

$.get({
url:"components/userModalGet.php",
data:{"user_id":userId},
success:function(data){					  

var dataArr = JSON.parse(data);

// gives us an object called "info" that is populated with info about this user.
eval(dataArr[0]);	


// if the user has not uploaded a background image, set the "background" field to the default background image.
(info["background"] == "" ? info["background"] = DEFAULT_USER_PROFILE_BACKGROUND_IMAGE : "");
// if the user has not uploaded an avatar image, set their avatar field to a letter-avatar generated by our mini letter-avatar library.
(info["avatar"] == "" ? info["avatar"] = LetterAvatar(info["first_name"] , USER_LETTER_AVATAR_SIZE) : "");

if(callback.length > 0) {
// grab from the dataArr the info variable that contains this user's info.
callback(info);	
}


userModalShouldServerSide = true;
}
});


}
	
}


function handleUserInfo(data, callback) {

set_user_profile_constants();

PROFILE_CONTAINER_ELEMENT.attr("data-user-id", data["id"]);
PROFILE_CONTAINER_ELEMENT.attr("data-is-base-user", data["is_base_user"]);

$("#user_profile_tabs .tab[data-tab-index=1]").attr({"data-user-id": data["id"], "data-first-name": data["first_name"]});
$("#user_profile_tabs .tab[data-tab-index=2]").attr({"data-user-id": data["id"]});
USER_PROFILE_POSTS_COUNTER.attr({"data-user-id": data["id"], "data-first-name": data["first_name"]});


// showing and hiding things that should be only visible when the base-user or only when not-base-user profiles are being viewed. 
if(PROFILE_CONTAINER_ELEMENT.attr("data-is-base-user") == "1") {
PROFILE_CONTAINER_ELEMENT.find(".notBaseUserOnly").hide(); 		
PROFILE_CONTAINER_ELEMENT.find(".baseUserOnly").show(); 	
get_new_messages_num(function(num) {	
if(parseFloat(num) > 0) {
USER_PROFILE_NEW_MESSAGES_NUM.html(num).css("display", "inline-block");	
}
});
}
else {
PROFILE_CONTAINER_ELEMENT.find(".baseUserOnly").hide(); 	
PROFILE_CONTAINER_ELEMENT.find(".notBaseUserOnly").show(); 		

// set the data-user-id attributes on the elements that require it in order to function
$("#startChatButton").attr("data-user-id", data["id"]); 	
$("#user_profile_follow_button").attr("data-user-id", data["id"]);
$("#user_profile_block_button").attr("data-user-id", data["id"]);
if(data["user_blocked_state"] == "1") {
$("#user_profile_follow_button").addClass("disabledButton");	
$("#startChatButton").addClass("disabledButtonLight");	
$("#user_profile_block_button").html("Unblock");	
}
else {
$("#user_profile_follow_button").removeClass("disabledButton");	
$("#startChatButton").removeClass("disabledButtonLight");	
$("#user_profile_block_button").html("Block");		
}

// if the base user is not following the profile they are currently viewing, then change the html of the #user_profile_follow_button to "follow"
if(data["followed_by_base_user"] == "0") {
$("#user_profile_follow_button").html("follow +");
}
// if the base user is following the profile they are currently viewing, then change the html of the #user_profile_follow_button to "unfollow"
else {
$("#user_profile_follow_button").html("unfollow");	
}

}

$(".always_hidden_initially").hide();


// we always want edit_mode to be not active initially. 
close_edit_mode();


$("#profileBackground").css({"background":"url('" + data["background"] + "')", "background-position": "center", "background-size": "cover"});


// set the user's posts num
set_user_profile_posts_num(data["total_posts_num"]);
// set the user's followers num
set_user_profile_followers_num(data["followers_num"]);
// set the user's followings num
set_user_profile_followings_num(data["followings_num"]);
// set the user's tags num
set_user_profile_tags_num(data["following_tags_num"]);

// set the data-user-id for the show-followers and show-followings buttons, which is required in order for them to show what they are supposed to show when clicked.
USER_PROFILE_FOLLOWER_COUNTER.attr("data-user-id", data["id"]);
USER_PROFILE_FOLLOWING_COUNTER.attr("data-user-id", data["id"]);
USER_PROFILE_TAGS_COUNTER.attr("data-user-id", data["id"]);



// set the avatar image to the user's avatar
$("#userAvatarImage").attr("src", data["avatar"]);
$("#userAvatarImage").attr("data-avatar-editable", data["avatar_editable"]);
$("#userAvatarRotateDiv").attr("data-rotate-degree", data["avatar_rotate_degree"]);
$("#userAvatarRotateContainer").css({"margin-top": data["avatar_positions"][0] + "%", "margin-left": data["avatar_positions"][1] + "%"});
/* if this is the base user they have uploaded an avatar (see the above if statement), then we want to add a 
baseUserAvatarRotateDivs class to it to handle live updates when the user rotates their avatar. */
if(data["is_base_user"] == "1") {
$("#userAvatarRotateDiv").addClass("baseUserAvatarRotateDivs");	
}	
// else we want to remove the class in case we had added it previously
else {
$("#userAvatarRotateDiv").removeClass("baseUserAvatarRotateDivs");		
}
// need to do some magic on the avatar image
$("#userAvatarRotateDiv").attr("data-rotate-degree",$("#userAvatarRotateDiv").attr("data-rotate-degree"));
$("#userAvatarRotateDiv").css("transform","rotate(" + $("#userAvatarRotateDiv").attr('data-rotate-degree') + "deg)");	
adaptRotateWithMargin($("#userAvatarRotateDiv").find("img"),$("#userAvatarRotateDiv").attr('data-rotate-degree') ,false);
// the avatar has to be fully loaded before fitToParent() is called, since it will deal with the naturalWidth/naturalHeight properties, which will return 0 if the image is not loaded yet.
$("#userAvatarRotateDiv img").on("load", function() {
fitToParent("#userAvatarImage");	
});



// set user's full and user names.
$("#userModalFullName").html(data["first_name"] + " " + data["last_name"]);
$("#userModalUserName").html("@" + data["user_name"]);


var personality_infos = [
{"type": 1, "name": "Trendy","image":"icons/emojis/14.svg"},
{"type": 2, "name": "Average","image":"icons/emojis/73.svg"},
{"type": 3, "name": "Grumpy","image":"icons/emojis/85.svg"}
];
// handle the user info widgets
handle_user_info_widget( "personality" , (data["personality"] != "0" ? (personality_infos[parseFloat(data["personality"]) - 1]["name"]) : "Unknown") , (data["personality"] != "0" ? personality_infos[parseFloat(data["personality"]) - 1]["image"] : "icons/other.png") );
handle_user_info_widget( "gender" , (data["gender"] != "" ? data["gender"] : "Unknown") , (data["gender"] != "" ? "icons/" + data["gender"] + ".png" : "icons/other.png") );
handle_user_info_widget( "country" , (data["country"] != "" ? get_country_name_from_country_code(data["country"]) : "Unknown") , (data["country"] != "" ? "dependencies/flag-icon-css-master/flags/1x1/" + data["country"] + ".svg" : "icons/other.png"));
handle_user_info_widget( "birthdate" , (data["birthdate"] != "" ? data["birthdate"] : "Unknown") , data["age_in_years"] );


// initialize the #birthdate datepicker and preselect it with the user's birthdate. in case you need to make some modifications, go to the documentation for pickadate.js
$('#birthdate').pickadate({
selectMonths: true,
selectYears: 80,
today: null,
clear: null
});

$("#birthdate").val("Birthdate");

callback();
}


/* this function changes the front-end of the user-info widgets with the options given in the arguments. 
DO NOT USE THIS FUNCTION TO CHANGE USER INFOS, this function merely handles the front-end after they have been changed on the server-side */
function handle_user_info_widget(name, text, icon) {

// handle the user personality 
if(name == "personality") {
$("#personalityTypeContainer").find(".userModalKnownInfoText").html(text);
$("#personalityTypeContainer").find(".userModalKnownInfoIcon").attr("src", icon);	
}

//handle the user gender widget
if(name == "gender") {
$("#genderContainer").find(".userModalKnownInfoText").html(text);
$("#genderContainer").find(".userModalKnownInfoIcon").attr("src", icon);
}

//handle the user country widget
if(name == "country") {
$("#countryContainer").find(".userModalKnownInfoText").html(text);
$("#countryContainer").find(".userModalKnownInfoIcon").attr("src", icon);	
}

// handle the user birthdate widget 
if(name == "birthdate") {
$("#birthdateContainer").find(".userModalKnownInfoText").html(text);
// since we are using a manual element instead of an icon for the birthdate widget (to show the user's age in years), we need to tweak things a bit in here
$("#birthdateContainer").find(".birthdateContainer div").html(icon);	
}
	
}


// returns a full country name from an ISO country code
function get_country_name_from_country_code(country_code) {
return $(".countrySelect option[value=" + country_code + "]").html()	
}
	


// call this function to set the user's follows number on the profile section.
function set_user_profile_posts_num(posts_num) {
USER_PROFILE_POSTS_COUNTER.find(".profile_stats_num").html(posts_num);
USER_PROFILE_POSTS_COUNTER.find(".profile_stats_label").html((posts_num != 1 ? " Posts" : " Post"));
}	
// call this function to set the user's follows number on the profile section.
// this one will be called form user_follow_related.js as well. (to update the follower-count when users press the follow button)
function set_user_profile_followers_num(followers_num) {
USER_PROFILE_FOLLOWER_COUNTER.find(".profile_stats_num").html(followers_num);
USER_PROFILE_FOLLOWER_COUNTER.find(".profile_stats_label").html((followers_num != 1 ? " Followers" : " Follower"));
}
// call this function to set the user's followings number on the profile section.
function set_user_profile_followings_num(followings_num) {
USER_PROFILE_FOLLOWING_COUNTER.find(".profile_stats_num").html(followings_num);
USER_PROFILE_FOLLOWING_COUNTER.find(".profile_stats_label").html((followings_num != 1 ? " Followings" : " Following"));
}
// call this function to set the user's followings number on the profile section.
function set_user_profile_tags_num(tags_num) {
USER_PROFILE_TAGS_COUNTER.find(".profile_stats_num").html(tags_num);
USER_PROFILE_TAGS_COUNTER.find(".profile_stats_label").html((tags_num != 1 ? " Tags" : " Tag"));
}


function get_user_profile_followers_num() {
return parseFloat(USER_PROFILE_FOLLOWER_COUNTER.find(".profile_stats_num").html());	
}	

function get_user_profile_tags_num() {
return parseFloat(USER_PROFILE_TAGS_COUNTER.find(".profile_stats_num").html());	
}
	
	
function user_profile_section_tabs_changed() {

var active_tab = USER_PROFILE_TABS_STATE_HOLDER.attr("data-active-tab");

// user switched to the PEOPLE tab
if(active_tab == "0") {
USER_PROFILE_POSTS_CONTAINER.hide();
USER_PROFILE_KNOWN_INFO_CONTAINER.show();
}
// user switched to the TAGS tab
else if(active_tab == "1"){
}

}

	
	
function set_user_profile_constants() {
PROFILE_CONTAINER_ELEMENT = $("#user_profile_container");	
USER_PROFILE_FOLLOWER_COUNTER = $("#user_profile_follower_count");
USER_PROFILE_FOLLOWING_COUNTER = $("#user_profile_following_count");
USER_PROFILE_TAGS_COUNTER = $("#user_profile_tags_count");
USER_PROFILE_POSTS_COUNTER = $("#user_profile_posts_count");
USER_PROFILE_TABS_STATE_HOLDER = PROFILE_CONTAINER_ELEMENT;	
USER_PROFILE_KNOWN_INFO_CONTAINER = $("#userModalKnownInfoContainer");
USER_PROFILE_POSTS_CONTAINER = $("#user_profile_posts_container");	
USER_PROFILE_NEW_MESSAGES_NUM = $("#user_profile_new_messages_num");	
set_user_profile_selects_container_constant();
}	
function set_user_profile_selects_container_constant() {
USER_PROFILE_SELECTS_CONTAINER = $("#user_modal_info_changers_selects");	
}
	
	
var changeInfosGetObj = {};




function my_hotfix_for_bug_3() {
set_user_profile_selects_container_constant();
USER_PROFILE_SELECTS_CONTAINER.html(USER_PROFILE_SELECTS_CONTAINER_HTML);
USER_PROFILE_SELECTS_CONTAINER.find("select").material_select();	
}



function open_edit_mode() {
$("#editProfileButton i").html("done");
$("#userAvatarImage").css("opacity",".8");	
$("#userModalInfoSee").slideUp();
$("#userModalInfoChangers").slideDown();
// if the user's avatar is editable (e.g it is not a default letter-avatar), toggle these 2 elements as well.
if( $("#userAvatarImage").attr("data-avatar-editable") == "true") {
$("#rotateAvatarButton").fadeIn();
$("#repositionAvatarDiv").fadeIn();
}
}

function close_edit_mode() {
$("#editProfileButton i").html("mode_edit");
$("#userAvatarImage").css("opacity","1");	
$("#userModalInfoSee").slideDown();
$("#userModalInfoChangers").slideUp();
$("#rotateAvatarButton").fadeOut();
$("#repositionAvatarDiv").fadeOut();
}





$(document).ready(function(){	


set_user_profile_constants();

// this one MUST NOT be in the constant initialization function else it will become pointless.
USER_PROFILE_SELECTS_CONTAINER_HTML = USER_PROFILE_SELECTS_CONTAINER.html();


$(document).on("click", "#user_profile_tabs .tab", function() {
/* if we didn't add a disabled class and then overwrote that disabled tab's styles to look like a not-disabled tab, we would have to manually reset the 
tab to the "profile" tab whenever the "posts" tab was clicked, which is weird, but yeah, the "posts" tab isn't actually supposed to work like a tab, 
rather, it is a modal opener, so without the disabled class on it, the user would open its modal, then go back and see himself having activated the 
"posts" tab which shows nothing, instead, whenever the user goes back, using this disabled functionality, we give them the illusion that they switched the 
tab back to the "people" tab. So anything related with .disabled in this particular #user_profile_tabs is there to enable this functionality. */
if(!$(this).hasClass("disabled")) {	
USER_PROFILE_TABS_STATE_HOLDER.attr("data-active-tab", $(this).attr("data-tab-index"));	
user_profile_section_tabs_changed();
}
});

		  

// go to a profile
$(document).on("click",".showUserModal",function(e){
e.stopPropagation();
PROFILE_CONTAINER_ELEMENT.find("#user_profile_container_child").hide();
showLoading(PROFILE_CONTAINER_ELEMENT, "50%");
getUser($(this).attr("data-user-id"), function(data){
handleUserInfo(data, function(){
$("#user_profile_container").appendTo("#user_modal .modal-content");	
my_hotfix_for_bug_3();	
$("#user_modal .modal-header .modalHeaderFullName").html("@" + data["user_name"]);
removeLoading(PROFILE_CONTAINER_ELEMENT);
PROFILE_CONTAINER_ELEMENT.find("#user_profile_container_child").show();
});	
});
});

$(document).on("click", "#bottom_nav_user_profile", function(e) {
e.stopPropagation();
PROFILE_CONTAINER_ELEMENT.find("#user_profile_container_child").hide();
showLoading(PROFILE_CONTAINER_ELEMENT, "50%");
getUser($(this).attr("data-user-id"), function(data){
handleUserInfo(data, function(){
$("#user_profile_container").appendTo("#main_screen_user_profile");	
my_hotfix_for_bug_3();	
removeLoading(PROFILE_CONTAINER_ELEMENT);
PROFILE_CONTAINER_ELEMENT.find("#user_profile_container_child").show();
});	
});
});
		  
		  
		  
//push every avatar image that shows the base user's avatar into this array, we will later update its source when a user changes his profile picture until the page is refreshed.
var avatarImagesArray = [{ref:"#userAvatar",type:"img"},{ref:"#userAvatarImage",type:"img"}];

var userInfosChangedOr = false;

/* takes care of the avatar rotating */				
$(document).on("click","#rotateAvatarButton",function(){
var currentRotationDegree = getRotationDegrees($("#userAvatarImage").parent());
var newDegree = currentRotationDegree != 270 ? currentRotationDegree + 90 : 0;

$(".baseUserAvatarRotateDivs").each(function(){
$(this).attr("data-rotate-degree",newDegree);	
$(this).css("transform","rotate(" + newDegree + "deg)");
adaptRotateWithMargin($(this).find("img"),newDegree,true);	
});

changeInfosGetObj[$(this).attr("data-change-name")] = getRotationDegrees($("#userAvatarImage").parent());
});				



/* takes care of the avatar repositioning */ 
$(document).on("click",".repositionAvatar",function(){
/* underneath, there are some reposition adapting methods or algorithms, yes, since these are called stuff programmers don't want to explain. but they 
mostly prevent elements from going out of the avatar circle while repositioning. */
changeInfosGetObj["avatar_positions"] = [0,0];
// all this variable and conditionals do is determine the direction the user wants to reposition the avatar to
var repositionDirection = $(this).attr("data-direction");
var userAvatarCoordinates = $("#userAvatarImage")[0].getBoundingClientRect();
if(repositionDirection == "up") {
if(parseFloat($("#userAvatarImage").parent().parent().css("margin-top").replace("px","")) > (document.getElementById("userAvatarImage").getBoundingClientRect().height - 120) * -1) {
$("#userAvatarImage").parent().parent().animate({"margin-top":"-=10px"},100);
}
else {
$("#userAvatarImage").parent().parent().animate({"margin-top":"-=" + document.getElementById("userAvatarImage").getBoundingClientRect().width - 110 + "px"},100);
}
changeInfosGetObj["avatar_positions"][0] = Math.round((parseFloat($("#userAvatarImage").parent().parent().css("margin-top").replace("px",""))/110)*100);
}
if(repositionDirection == "down") {
if(parseFloat($("#userAvatarImage").parent().parent().css("margin-top").replace("px","")) < -10) {
$("#userAvatarImage").parent().parent().animate({"margin-top":"+=10px"},100);
}
else {
$("#userAvatarImage").parent().parent().animate({"margin-top":"0px"},100);	
}
changeInfosGetObj["avatar_positions"][0] = Math.round((parseFloat($("#userAvatarImage").parent().parent().css("margin-top").replace("px",""))/110)*100);
}
if(repositionDirection == "left") {
if(parseFloat($("#userAvatarImage").parent().parent().css("margin-left").replace("px","")) > (document.getElementById("userAvatarImage").getBoundingClientRect().width - 120) * -1) {
$("#userAvatarImage").parent().parent().animate({"margin-left":"-=10px"},100);
}
else {
$("#userAvatarImage").parent().parent().animate({"margin-left":"-=" + document.getElementById("userAvatarImage").getBoundingClientRect().width - 110 + "px"},100);	
}
changeInfosGetObj["avatar_positions"][1] = Math.round((parseFloat($("#userAvatarImage").parent().parent().css("margin-left").replace("px",""))/110)*100);
}
if(repositionDirection == "right") {
if(parseFloat($("#userAvatarImage").parent().parent().css("margin-left").replace("px","")) < -10) {
$("#userAvatarImage").parent().parent().animate({"margin-left":"+=10px"},100);		
}			
else {
$("#userAvatarImage").parent().parent().animate({"margin-left":"0px"},100);					
}
changeInfosGetObj["avatar_positions"][1] = Math.round((parseFloat($("#userAvatarImage").parent().parent().css("margin-left").replace("px",""))/110)*100);
}
});





/* takes care of adding userModalChangeAbles to the changeInfosGetObj object */		
$(document).on("change",".userModalChangeAbles",function(event){
changeInfosGetObj[$(this).attr("data-change-name")] = $(this).val();
});					


/* save changes */
$(document).on("click","#editProfileButton",function(){

if(editModeActive == true) {

$.post({
url:"components/change_infos.php",
data:changeInfosGetObj,
success:function(data){

// this array will contain the user's age_in_years from their new birthdate in its first index.
var data_arr = JSON.parse(data);


// change the front-end of the user's profile with the latest changes in the infos.

if(typeof changeInfosGetObj["gender"] != "undefined") {
handle_user_info_widget( "gender" , changeInfosGetObj["gender"] , ("icons/" + changeInfosGetObj["gender"] + ".png"));
}

if(typeof changeInfosGetObj["country"] != "undefined") {
handle_user_info_widget( "country" , get_country_name_from_country_code(changeInfosGetObj["country"]) , ("dependencies/flag-icon-css-master/flags/1x1/" + changeInfosGetObj["country"] + ".svg"));
}

if(typeof changeInfosGetObj["birthdate"] != "undefined") {
// handle the user birthdate widget 
handle_user_info_widget( "birthdate" , changeInfosGetObj["birthdate"] , (data_arr[0] != "" ? data_arr[0] : null) );
}


if(typeof changeInfosGetObj["avatar_rotation"] != "undefined") {
$("#userAvatarRotateDiv").attr('data-rotate-degree', changeInfosGetObj["avatar_rotation"]);
$("#userAvatarRotateDiv").css('transform','rotate(' + $("#userAvatarRotateDiv").attr('data-rotate-degree') + 'deg)');	
}

if(typeof changeInfosGetObj["avatar_positions"] != "undefined") {
$("#userAvatarRotateDiv").parent().css({'margin-top': changeInfosGetObj["avatar_positions"][0]  + '%','margin-left': changeInfosGetObj["avatar_positions"][1] + '%'});
}

adaptRotateWithMargin($("#userAvatarRotateDiv").find('img'),$("#userAvatarRotateDiv").attr('data-rotate-degree') ,false);

changeInfosGetObj = {};

}
});


}
});



var editModeActive = false;

/* takes care of enabling and disabling edit mode. (profile editing) */
$(document).on("click","#editProfileButton",function(){
	
if(editModeActive == false) {
open_edit_mode();	
editModeActive = true;
}
else {
close_edit_mode();	
editModeActive = false;
}

});




// start related to changing the avatar picture ........................							


// click the file input whenever the  div is clicked.
$(document).on("click",".changeAvatarContainer",function(e){
$("#changeAvatarInput").click();
});

//if you don't call this then the above snippet will cause an error "maximum call stack size exceeded" because clicking this element will cause the parent to be clicked and then the parent's click causes the child's,etc...
$(document).on("click","#changeAvatarInput",function(e){
e.stopPropagation();
});



$(document).on("mouseover",".userModalAvatarImage",function(){
// if the user is on their profile and they are not in edit mode, then on hovering the avatar we show him the change avatar div.
if(check_current_profile_is_base_user() == true && editModeActive == false) {
$(".changeAvatarContainer").show();
}
});


// whenever the user mouseouts the user avatar pic, we hide the change profile div.						
$(document).on("mouseout",".userModalAvatarImage",function(){
$(".changeAvatarContainer").hide();
});




//whenever a user selects an image to set it as their new avatar, do an ajax query to upload it.  
$(document).on("change","#changeAvatarInput", function(){
setNewAvatar($(this) , callback_to_avatar_set);	

function callback_to_avatar_set(data) {
	
if(data[0] != "") {
	
$("#userAvatarImage").attr("data-avatar-editable" , "true");	
	
$(".baseUserAvatarRotateDivs img").attr('src', data[0]);	

$('.baseUserAvatarRotateDivs img').on("load", function(){	
fitToParent('#' + $(this).attr('id'));
});

$(".baseUserAvatarRotateDivs").attr('data-rotate-degree','0');
$(".baseUserAvatarRotateDivs").parent().css({'margin-top':'0px','margin-left':'0px'});
$(".baseUserAvatarRotateDivs").css({'top':'0%','left':'0%'});
$(".baseUserAvatarRotateDivs").css('transform','rotate(' + $(".baseUserAvatarRotateDivs").attr('data-rotate-degree') + 'deg)');	
adaptRotateWithMargin($(".baseUserAvatarRotateDivs img"),$(".baseUserAvatarRotateDivs").attr('data-rotate-degree') ,false);


Materialize.toast('Avatar Changed',5000,'green');	
}
else {
Materialize.toast(data[1] , 5000 , 'red');	
}

}

});


function setNewAvatar(inputElement , callback){
var avatar_filetype = inputElement[0].files[0]["type"];
var avatar_size = inputElement[0].files[0]["size"];
if(avatar_filetype == "image/jpeg" || avatar_filetype == "image/jpg" || avatar_filetype == "image/png" || avatar_filetype == "image/gif") {
//check if file is smaller than 5mb
if(avatar_size < MAXIMUM_USER_PROFILE_AVATAR_IMAGE_SIZE) {					
if(avatar_size > 1) {
var data = new FormData();
data.append('new_avatar', $("#changeAvatarInput")[0].files[0]);
$.post({
url: 'components/change_avatar.php',
data: data,
cache: false,
contentType: false,
processData: false,
success: function(data){

/* if the data_arr's first index (path to the new background) is not empty, then the background has been successfully uploaded, otherwise the operation has been a failure 
and a custom error message is included in the second index. */
var data_arr = JSON.parse(data);	

// call the callback function, passing "data_arr" as its parameter.
callback(data_arr);

}
}); 
/* without this, everytime the cancel button is pressed instead of the open button after each avatar picture change, it will throw an error 
"cannot read property type of undefined", another solution to this bug would be to check if the file[0] is undefined at the beginning of this function. */
$("#changeAvatarInput").val("");
}
else {
Materialize.toast("Sorry, There Is Something Wrong With Your Picture",4000,"red");
}
}
//if file is larger than 5mb
else {
Materialize.toast("Image Size Must Be Smaller Than " + (MAXIMUM_USER_PROFILE_AVATAR_IMAGE_SIZE/1000000) + "MB",6000,"red");
}
}
// if file is not jpeg, jpg, png or gif
else {
Materialize.toast("Image Type Must Be Either \"JPEG\", \"JPG\", \"PNG\" Or \"GIF\" !",6000,"red");
}
}

// end related to avatar picture ..........................





// whenever the user clicks on their background, toggle the #changeBackgroundButton
$(document).on("click" , "#profileBackground", function(){
if( check_current_profile_is_base_user() == true ) {	
$("#changeBackgroundButton").toggle();	
}
});

$(document).on("click","#changeBackgroundButton",function(e) {
$("#newBackgroundInput").click();
});

$(document).on("change","#newBackgroundInput",function(){
setNewBackground($(this) , callback_to_background_set);

function callback_to_background_set(data){
	
// if the image was uploaded successfully, then set the user's profile's background image to that uploaded image. 	
if(data[0] != "") {
$("#profileBackground").css({"background":"url('" + data[0] + "')","background-size":"cover","background-position":"center center"});	
// hide the #changeBackgroundButton so the newly uploaded background looks good.
$("#changeBackgroundButton").hide();
Materialize.toast("Background Changed",5000,"green");	
}
else {
Materialize.toast(data[1] , 5000 , "red");	
}
}

});


/* on completing, this function will call the function provided in its callback parameter, passing an array that contains the path to the uploaded image in its first index 
(empty if there was an error uploading the image) and the error message as its second index, in case there was an error uploading the image (empty if the image was uploaded
successfully). */
function setNewBackground(inputElement , callback) {

var background_filetype = inputElement[0].files[0]["type"];
var background_size = inputElement[0].files[0]["size"];

if(background_filetype == "image/jpeg" || background_filetype == "image/jpg" || background_filetype == "image/png" || background_filetype == "image/gif") {
	
//check if file is smaller than 5mb
if(background_size < MAXIMUM_USER_PROFILE_BACKGROUND_IMAGE_SIZE) {					
if(background_size > 1) {
var data = new FormData();
data.append('new_background', inputElement[0].files[0]);
$.post({
url: 'components/change_background.php',
data: data,
cache: false,
contentType: false,
processData: false,
success: function(data){


/* if the data_arr's first index (path to the new background) is not empty, then the background has been successfully uploaded, otherwise the operation has been a failure 
and a custom error message is included in the second index. */
var data_arr = JSON.parse(data);	

// call the callback function, passing "data_arr" as its parameter.
callback(data_arr);

}
}); 
/* without this, everytime the cancel button is pressed instead of the open button after each avatar picture change, it will throw an error 
"cannot read property type of undefined", another solution to this bug would be to check if the file[0] is undefined at the beginning of this function. */
inputElement.val("");
}
else {
Materialize.toast("Sorry, There Is Something Wrong With Your Picture",4000,"red");
}
}
//if file is larger than 5mb
else {
Materialize.toast("Image Size Must Be Smaller Than " + (MAXIMUM_USER_PROFILE_BACKGROUND_IMAGE_SIZE/1000000) + "MB",6000,"red");
}
}
// if file is not jpeg, jpg, png or gif
else {
Materialize.toast("Image Type Must Be Either \"JPEG\", \"JPG\", \"PNG\" Or \"GIF\" !",6000,"red");
}
	
}



function check_current_profile_is_base_user() {
return ($("#user_profile_container").attr("data-is-base-user") == "1" ? true : false);
}


});
