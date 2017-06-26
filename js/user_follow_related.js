
// will be set on document load
var SHOW_USER_FOLLOWERS_CONTAINER_ELEMENT;
var SHOW_USER_FOLLOWINGS_CONTAINER_ELEMENT;



var get_user_followers_or_followings_prevent_multiple_calls = false;
// see a user's followers
function get_user_followers_or_followings(user_id, row_offset, type, callback) {
	
if( isNaN(parseFloat(user_id)) || isNaN(parseFloat(type)) || typeof callback != "function" ) {
return false;	
}	

get_user_followers_or_followings_prevent_multiple_calls = true;

$.get({
url:"components/get_user_followers_or_followings.php",
data: {
"user_id": user_id,
"row_offset": row_offset,
"type": type
},
type:"get",
success: function(data) {
var data_arr = JSON.parse(data);	
callback(data_arr);	
get_user_followers_or_followings_prevent_multiple_calls = false;
}
});
	
}





/* call this function when users want to follow or unfollow other users, takes the target user's id and 
a callback function with at least one parameter as arguments.  will return 0 if the user is now followed, 
and 1 if they are now unfollowed. */
function addOrRemoveContact(userId, callback) {

if(typeof userId == "undefined") {
return false;	
}

$.get({
url:"components/add_remove_contacts.php",
data:{user_id:userId},
type:"get",
success: function(data) {

if(data != "") {
// if the callback has a parameter that we can pass the data to	
if(callback.length > 0) {	
callback(data);
}
}

}
});
	
}



/* call this function when users want to block or unblock other users, takes the target user's id and 
a callback function with at least one parameter as arguments.  will return 0 if the user is now blocked, 
and 1 if they are now unblocked. */
function blockOrUnblockUser(userId, callback) {
$.get({
url:"components/block_user.php",
data:{"user_id":userId},
success:function(data) {
if(data != "") {
// if the callback has a parameter that we can pass the data to	
if(callback.length > 0) {	
callback(data);
}
}
}	
});
}



// all this letters business deals with having those letter-separators for all a user's followers/followings of the same letter, so it's easier to navigate.
function get_user_followers_callback(data) {

console.log(data[0][data[0].length-1]);

var is_first_call = SHOW_USER_FOLLOWERS_CONTAINER_ELEMENT.find(".contactsSingleRow").length < 1;

// if there are no rows currently, it means that the previous call was the first and therefore there is a gender-widget-info array in the second (1) index of data.
if(is_first_call == true) {
console.log(data[1]);	
SHOW_USER_FOLLOWERS_CONTAINER_ELEMENT.prepend(`<div class='contactsModalTop'>
<div class='contactsModalSingleElement cardStyles'><img src='icons/male.png' alt='Male'/><span class='contactsModalSingleElementMainText'>`+ Math.round((data[1]["total_male"] / data[1]["total"]) * 100)  +`%</span></div>
<div class='contactsModalSingleElement cardStyles'><img src='icons/female.png' alt='Female'/><span class='contactsModalSingleElementMainText'>`+ Math.round((data[1]["total_female"] / data[1]["total"]) * 100) +`%</span></div>
</div><!-- end .contactsModalTop -->`);
}

// if there are no results, 
if(data[0].length < 1 && is_first_call == true) {
SHOW_USER_FOLLOWERS_CONTAINER_ELEMENT.html("<div class='emptyNowPlaceholder'><i class='material-icons'>info</i><br>Not a single follower to show :(</div>")	
}	


for(var i = 0; i < data[0].length; i++) {
var current_first_letter = data[0][i]["first_name"].substring(0,1).toLowerCase();	

var letter_rows_container_id = "letter_" + current_first_letter + "_rows_container";
if( SHOW_USER_FOLLOWERS_CONTAINER_ELEMENT.find("#" + letter_rows_container_id).length < 1 ) {
SHOW_USER_FOLLOWERS_CONTAINER_ELEMENT.append(`<div class='singleLetterContainer row'>
<div class='singleLetter col l1 m1 s2'>` + current_first_letter.toUpperCase() + `</div>
</div>
<div id='` + letter_rows_container_id + `' class='oneLetterRowsContainer myHorizontalCardStyle cardStyles'></div>`);	
}

SHOW_USER_FOLLOWERS_CONTAINER_ELEMENT.find("#" + letter_rows_container_id).append(get_follow_related_row_markup(data[0][i]));
}

}


// all this letters business deals with having those letter-separators for all a user's followers/followings of the same letter, so it's easier to navigate.
function get_user_followings_callback(data) {

var is_first_call = SHOW_USER_FOLLOWINGS_CONTAINER_ELEMENT.find(".contactsSingleRow").length < 1;

// if there are no rows currently, it means that the previous call was the first and therefore there is a gender-widget-info array in the second (1) index of data.
if(is_first_call == true) {
SHOW_USER_FOLLOWINGS_CONTAINER_ELEMENT.prepend(`<div class='contactsModalTop'>
<div class='contactsModalSingleElement cardStyles'><img src='icons/male.png' alt='Male'/><span class='contactsModalSingleElementMainText'>`+ Math.round((data[1]["total_male"] / data[1]["total"]) * 100)  +`%</span></div>
<div class='contactsModalSingleElement cardStyles'><img src='icons/female.png' alt='Female'/><span class='contactsModalSingleElementMainText'>`+ Math.round((data[1]["total_female"] / data[1]["total"]) * 100) +`%</span></div>
</div><!-- end .contactsModalTop -->`);
}

// if there are no results, 
if(data[0].length < 1 && is_first_call == true) {
SHOW_USER_FOLLOWINGS_CONTAINER_ELEMENT.html("<div class='emptyNowPlaceholder'><i class='material-icons'>info</i><br>Not a single following to show :(</div>")	
}	


for(var i = 0; i < data[0].length; i++) {
var current_first_letter = data[0][i]["first_name"].substring(0,1).toLowerCase();	

var letter_rows_container_id = "letter_" + current_first_letter + "_rows_container";
if( SHOW_USER_FOLLOWINGS_CONTAINER_ELEMENT.find("#" + letter_rows_container_id).length < 1 ) {
SHOW_USER_FOLLOWINGS_CONTAINER_ELEMENT.append(`<div class='singleLetterContainer row'>
<div class='singleLetter col l1 m1 s2'>` + current_first_letter.toUpperCase() + `</div>
</div>
<div id='` + letter_rows_container_id + `' class='oneLetterRowsContainer myHorizontalCardStyle cardStyles'></div>`);	
}

SHOW_USER_FOLLOWINGS_CONTAINER_ELEMENT.find("#" + letter_rows_container_id).append(get_follow_related_row_markup(data[0][i]));
}

}



function get_follow_related_row_markup(data) {

var avatar_image_id = "avatar" + Math.floor(Math.random()*1000000);
var row_id = "contact" + Math.floor(Math.random()*1000000);

return `<div class='contactsSingleRow row showUserModal' id='` + row_id + `' data-user-id='` + data["id"] +`' data-open-main-screen='#main_screen_user_profile'>

<div class='col l2 m3 s3 contactsAvatarRow'>
<div class='contactsAvatarContainer'>
<div class='contactsAvatarRotateContainer rotateContainer' style='margin-top:` + data["avatar_positions"][0] + `%;margin-left:` + data["avatar_positions"][1] + `%;'>
<div class='contactsAvatarRotateDiv'>
<img id='` + avatar_image_id + `' class='avatarImages' src='`+ (data["avatar_picture"] != "" ? data["avatar_picture"] : LetterAvatar(data["first_name"], 120)) +`' alt='Avatar'/>
</div>
</div>
</div><!-- end .contactsAvatarContainer -->
</div><!-- end .contactsAvatarRow -->

<div class='col l8 m7 s7 contactsInfosContainer'>
<div class='contactsInfosContainerChild'>
<div class='contactsFullName'><span class='contactsFullNameText'>` + (data["first_name"] + " " + data["last_name"]) + `</span></div>
<div class='contactsUserName'>@`+ data["user_name"] +`</div>
</div>
</div><!-- end .contactsInfosContainer -->

</div><!-- end .contactsSingleRow -->
<script>

	$('#` + avatar_image_id + `').on('load',function(){
		$(this).parent().css('transform','rotate("` + (data["rotate_degree"] != "" ? data["rotate_degree"] : 0) + `deg")');
		fitToParent($(this));
		adaptRotateWithMargin($(this),` + (data["rotate_degree"] != "" ? data["rotate_degree"] : 0) + `,false);
	});
	
	Waves.attach('#` + row_id + `', ['waves-block']);
	Waves.init();
	
</script>`;	
}



$(document).ready(function(){
	
SHOW_USER_FOLLOWERS_CONTAINER_ELEMENT = $("#followers_modal_content_child");
SHOW_USER_FOLLOWINGS_CONTAINER_ELEMENT = $("#followings_modal_content_child");
		
	
// users clicked a button that is supposed to retrieve the number of followers for the user specified by the id in the element's data-user-id attribute.
$(document).on("click",".get_followers",function(){
SHOW_USER_FOLLOWERS_CONTAINER_ELEMENT.attr("data-user-id", $(this).attr("data-user-id"))	
SHOW_USER_FOLLOWERS_CONTAINER_ELEMENT.html("");	
get_user_followers_or_followings(SHOW_USER_FOLLOWERS_CONTAINER_ELEMENT.attr("data-user-id"), 0, 0, get_user_followers_callback);
});
// user is infinite scrolling their notifications section 
SHOW_USER_FOLLOWERS_CONTAINER_ELEMENT.scroll(function(){
if(($(this)[0].scrollHeight - ($(this).scrollTop() + $(this).outerHeight()) < 100) && get_user_followers_or_followings_prevent_multiple_calls == false) {
get_user_followers_or_followings(SHOW_USER_FOLLOWERS_CONTAINER_ELEMENT.attr("data-user-id"), SHOW_USER_FOLLOWERS_CONTAINER_ELEMENT.find(".contactsSingleRow").length, 0, get_user_followers_callback);
}
});


// users clicked a button that is supposed to retrieve the number of followings for the user specified by the id in the element's data-user-id attribute.
$(document).on("click",".get_followings",function(){	
SHOW_USER_FOLLOWINGS_CONTAINER_ELEMENT.attr("data-user-id", $(this).attr("data-user-id"))	
SHOW_USER_FOLLOWINGS_CONTAINER_ELEMENT.html("");	
get_user_followers_or_followings($(this).attr("data-user-id"), 0, 1, get_user_followings_callback);
});
// user is infinite scrolling their notifications section 
SHOW_USER_FOLLOWINGS_CONTAINER_ELEMENT.scroll(function(){
if(($(this)[0].scrollHeight - ($(this).scrollTop() + $(this).outerHeight()) < 100) && get_user_followers_or_followings_prevent_multiple_calls == false) {
get_user_followers_or_followings(SHOW_USER_FOLLOWINGS_CONTAINER_ELEMENT.attr("data-user-id"), SHOW_USER_FOLLOWINGS_CONTAINER_ELEMENT.find(".contactsSingleRow").length, 1, get_user_followings_callback);
}
});






// when users want to follow/unfollow another user 
$(document).on("click","#user_profile_follow_button",function(){

if(typeof $(this).attr("data-user-id") == "undefined") {
return false;
}  


addOrRemoveContact($(this).attr("data-user-id"), addOrRemoveContactCallback);

/*
//this fixes an inconsistency where if you opened a user modal from the contacts modal, and then deleted a contact, the contacts modal would not be updated. to fix that, we 
//update the contacts modal everytime that button is clicked. 
if(typeof $(this).attr("data-not-from-contacts") != "undefined") {
get_user_followings($("#contactsModalContentChild"));
}
*/


function addOrRemoveContactCallback(newState) {

// if newState is 0, user pressed the follow button and they are now following their target
if(newState == "0") {	
$('#user_profile_follow_button').html('unfollow');
set_user_profile_followers_num(get_user_profile_followers_num() + 1);
}
// user just unfollowed the target user
else if(newState == "1") {
$('#user_profile_follow_button').html('follow +');
set_user_profile_followers_num(get_user_profile_followers_num() - 1);
}
	
}

});



// used when user blocks or unblocks contacts.
$(document).on("click","#user_profile_block_button",function(){
	
blockOrUnblockUser($(this).attr("data-user-id"),blockOrUnblockUserCallback);

function blockOrUnblockUserCallback(newState) {
// the user is now blocked	
if(newState == "0") {
Materialize.toast('User Blocked, Tap Button To Unblock',3000,'red');	
$("#user_profile_block_button").html("Unblock");	
$("#user_profile_block_button").attr("data-current-state","1");	
$("#user_profile_follow_button").html("Follow");
// since you unfollow a user when you block them, we have to decrease that user's followings by 1
var user_followers_num = get_user_profile_followers_num(); 
if(user_followers_num > 0) {
set_user_profile_followers_num(user_followers_num - 1);	
}

$("#user_profile_follow_button").css({"pointer-events":"none","opacity":".5"});
}	
else if(newState == "1") {
Materialize.toast('User Unblocked, Tap Button To Block',3000,'red');	
$("#user_profile_block_button").html("Block");	
$("#user_profile_block_button").attr("data-current-state","0");		
$("#user_profile_follow_button").css({"pointer-events":"auto","opacity":"1"});
}
}

});

/* ----- END follows and blocks ----- */
	
	
});




