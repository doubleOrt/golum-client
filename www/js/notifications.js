
// value will be set on document load
var NOTIFICATIONS_CONTAINER_ELEMENT;
var NOTIFICATIONS_TABS_STATE_HOLDER;
var NOTIFICATIONS_IMPORTANT_CONTAINER;
var NOTIFICATIONS_ALL_CONTAINER;

var FIRST_TAB_EMPTY_NOW_MESSAGE = "No unread notifications :)";
var SECOND_TAB_EMPTY_NOW_MESSAGE = "No notifications :(";


var notificationsPreventMultipleCalls = false;

function getNotifications(row_offset, type, callback) {
notificationsPreventMultipleCalls = true;	

$.get({
url:PATH_TO_SERVER_PHP_FILES + "notifications.php",
data:{
"row_offset":row_offset,
"type": type
},
success:function(data) {

var data_arr = JSON.parse(data);

if(typeof callback == "function") {
callback(data_arr);
}

notificationsPreventMultipleCalls = false;
} 
});

}


function get_new_notifications_num(callback) {

if(typeof callback !== "function") {
return false;	
}	
	
$.get({
url: PATH_TO_SERVER_PHP_FILES + "get_new_notifications_num.php",
success:function(data) {
var data_arr = JSON.parse(data);
callback(data_arr[0]);
}	
});

}


/*

1 = voted on your post

2 = commented on your post

3 = replied to your comment

4 = sent you a post

5 = faved your post

6 = started following you

7 = upvoted your comment 

8 = downvoted your comment

9 = upvoted your reply 

10 = downvoted your reply 

11 = reacted to the post you sent him
	
*/
function get_notification_markup(notification_arr) {

var notification_sender_full_name = notification_arr["notification_sender_info"]["first_name"] + " " + notification_arr["notification_sender_info"]["last_name"];
var random_num = Math.floor(Math.random() * 1000000);

// user reacting to your post (voting)
if(notification_arr["notification_type"] == 1) {
return `
<div class='singleNotification scaleHorizontallyCenteredItem lightgrey_background_on_active openSinglePost modal-trigger' data-read-yet='`+ (notification_arr[`read_yet`] != `` ? `true` : `false`) +`' data-target='singlePostModal' data-notification-id='`+ notification_arr["notification_id"] +`' data-actual-post-id='`+ notification_arr["notification_extra"] +`' data-notification-extra='` + notification_arr["notification_extra"] + `' data-notification-extra2='` + notification_arr["notification_extra2"] + `' data-notification-extra3='` + notification_arr["notification_extra3"] + `'>
<div class='notificationsAvatarContainer'>
<div class='avatarContainer'>
<div class='avatarContainerChild showUserModal modal-trigger' data-target='user_modal' data-user-id='` + notification_arr["notification_sender_info"]["id"] + `' ` + notification_arr[`notification_from`] + `'>
<div class='rotateContainer' style='margin-top:`+notification_arr["notification_sender_info"]["avatar_positions"][0]+`%;margin-left:`+notification_arr["notification_sender_info"]["avatar_positions"][1]+`%;'>
<div class='avatarRotateDiv' data-rotate-degree='`+notification_arr["notification_sender_info"]["avatar_rotate_degree"]+`' style='transform: rotate(` + notification_arr["notification_sender_info"]["avatar_rotate_degree"] + `deg)'>
<img id='avatar` + random_num + `' class='avatarImages notificationAvatarImages' src='` + (notification_arr["notification_sender_info"]["avatar"] != "" ? notification_arr["notification_sender_info"]["avatar"] : LetterAvatar(notification_arr["notification_sender_info"]["first_name"] , 60) ) + `' alt='Image'/>
</div>
</div>

</div><!-- end +avatarContainerChild -->
</div><!-- end +avatarContainer -->
</div> 

<div class='notificationTextContainer'>
<div class='notificationText'>
<a href='#modal1' class='commonLink notificationFromFullName showUserModal modal-trigger' data-target='user_modal' data-user-id='` + notification_arr["notification_sender_info"]["id"] + `'>`+ notification_sender_full_name +`</a>  `+ (notification_arr["notification_and_others"] > 0 ?  `And ` + notification_arr["notification_and_others"] + ` Other` + (notification_arr["notification_and_others"] == 1 ? `` : `s`) : ``) +` Voted on Your Post.
</div>
<div class='notificationTime'>` + notification_arr["notification_time_string"] + `</div>
</div>

</div>`;
}


// user commented on your post
if(notification_arr["notification_type"] == 2) {
return `
<div class='singleNotification scaleHorizontallyCenteredItem lightgrey_background_on_active showPostComments modal-trigger' data-target='commentsModal' data-notification-id='`+ notification_arr["notification_id"] +`' data-pin-comment-to-top='`+ notification_arr["notification_extra2"]  +`' data-actual-post-id='`+ notification_arr["notification_extra"] +`' data-notification-extra='` + notification_arr["notification_extra"] + `' data-notification-extra2='` + notification_arr["notification_extra2"] + `' data-notification-extra3='` + notification_arr["notification_extra3"] + `'>
<div class='notificationsAvatarContainer'>
<div class='avatarContainer'>
<div class='avatarContainerChild showUserModal modal-trigger' data-target='user_modal' data-user-id='` + notification_arr["notification_sender_info"]["id"] + `' ` + notification_arr[`notification_from`] + `'>
<div class='rotateContainer' style='margin-top:`+notification_arr["notification_sender_info"]["avatar_positions"][0]+`%;margin-left:`+notification_arr["notification_sender_info"]["avatar_positions"][1]+`%;'>
<div class='avatarRotateDiv' data-rotate-degree='`+notification_arr["notification_sender_info"]["avatar_rotate_degree"]+`' style='transform: rotate(` + notification_arr["notification_sender_info"]["avatar_rotate_degree"] + `deg)'>
<img id='avatar` + random_num + `' class='avatarImages notificationAvatarImages' src='` + (notification_arr["notification_sender_info"]["avatar"] != "" ? notification_arr["notification_sender_info"]["avatar"] : LetterAvatar(notification_arr["notification_sender_info"]["first_name"] , 60) ) + `' alt='Image'/>
</div>
</div>

</div><!-- end +avatarContainerChild -->
</div><!-- end +avatarContainer -->
</div> 

<div class='notificationTextContainer'>
<div class='notificationText'>
<a href='#modal1' class='commonLink notificationFromFullName showUserModal modal-trigger' data-target='user_modal' data-user-id='` + notification_arr["notification_sender_info"]["id"] + `'>`+ notification_sender_full_name +`</a> `+ (notification_arr["notification_and_others"] > 0 ?  `And ` + notification_arr["notification_and_others"] + ` Other` + (notification_arr["notification_and_others"] == 1 ? `` : `s`) : ``) +` Commented On Your <a href='#singlePostModal' class='commonLink openSinglePost modal-trigger' data-actual-post-id='`+ notification_arr["notification_extra"] +`'>Post</a>.
</div>
<div class='notificationTime'>` + notification_arr["notification_time_string"] + `</div>
</div>

</div>`;
}

// replies
if(notification_arr["notification_type"] == 3) {
return `
<div class='singleNotification scaleHorizontallyCenteredItem lightgrey_background_on_active  modal-trigger addReplyToComment' data-target='commentRepliesModal' data-notification-id='`+ notification_arr["notification_id"] +`' data-pin-comment-to-top='`+ notification_arr["notification_extra3"]  +`' data-comment-id='`+ notification_arr["notification_extra"] +`' data-actual-post-id='`+ notification_arr["notification_extra2"] +`' data-notification-extra='` + notification_arr["notification_extra"] + `' data-notification-extra2='` + notification_arr["notification_extra2"] + `' data-notification-extra3='` + notification_arr["notification_extra3"] + `'>
<div class='notificationsAvatarContainer'>
<div class='avatarContainer'>
<div class='avatarContainerChild showUserModal modal-trigger' data-target='user_modal' data-user-id='` + notification_arr["notification_sender_info"]["id"] + `' ` + notification_arr[`notification_from`] + `'>
<div class='rotateContainer' style='margin-top:`+notification_arr["notification_sender_info"]["avatar_positions"][0]+`%;margin-left:`+notification_arr["notification_sender_info"]["avatar_positions"][1]+`%;'>
<div class='avatarRotateDiv' data-rotate-degree='`+notification_arr["notification_sender_info"]["avatar_rotate_degree"]+`' style='transform: rotate(` + notification_arr["notification_sender_info"]["avatar_rotate_degree"] + `deg)'>
<img id='avatar` + random_num + `' class='avatarImages notificationAvatarImages' src='` + (notification_arr["notification_sender_info"]["avatar"] != "" ? notification_arr["notification_sender_info"]["avatar"] : LetterAvatar(notification_arr["notification_sender_info"]["first_name"] , 60) ) + `' alt='Image'/>
</div>
</div>

</div><!-- end +avatarContainerChild -->
</div><!-- end +avatarContainer -->
</div> 

<div class='notificationTextContainer'>
<div class='notificationText'>
<a href='#modal1' class='commonLink notificationFromFullName showUserModal modal-trigger' data-target='user_modal' data-user-id='` + notification_arr["notification_sender_info"]["id"] + `'>`+ notification_sender_full_name +`</a> `+ (notification_arr["notification_and_others"] > 0 ?  `And ` + notification_arr["notification_and_others"] + ` Other` + (notification_arr["notification_and_others"] == 1 ? `` : `s`) : ``) +` Replied To Your Comment. <br><span class='smallerFontSize boldText'>(<a href='#singlePostModal' class='commonLink openSinglePost modal-trigger' data-actual-post-id='`+ notification_arr["notification_extra2"] +`'>View Post</a>)</span>
</div>
<div class='notificationTime'>` + notification_arr["notification_time_string"] + `</div>
</div>

</div>`;
}


// user sent you a post (wants to share a post with you)
if(notification_arr["notification_type"] == 4) {
return `
<div class='singleNotification scaleHorizontallyCenteredItem lightgrey_background_on_active openSinglePost modal-trigger' data-target='singlePostModal' data-notification-id='`+ notification_arr["notification_id"] +`' data-actual-post-id='`+ notification_arr["notification_extra"] +`' data-notification-extra='` + notification_arr["notification_extra"] + `' data-notification-extra2='` + notification_arr["notification_extra2"] + `' data-notification-extra3='` + notification_arr["notification_extra3"] + `'>
<div class='notificationsAvatarContainer'>
<div class='avatarContainer'>
<div class='avatarContainerChild showUserModal modal-trigger' data-target='user_modal' data-user-id='` + notification_arr["notification_sender_info"]["id"] + `' ` + notification_arr[`notification_from`] + `'>
<div class='rotateContainer' style='margin-top:` + notification_arr["notification_sender_info"]["avatar_positions"][0] + `%;margin-left:`+notification_arr["notification_sender_info"]["avatar_positions"][1]+`%;'>
<div class='avatarRotateDiv' data-rotate-degree='` + notification_arr["notification_sender_info"]["avatar_rotate_degree"] + `' style='transform: rotate(` + notification_arr["notification_sender_info"]["avatar_rotate_degree"] + `deg)'>
<img id='avatar` + random_num + `' class='avatarImages notificationAvatarImages' src='` + (notification_arr["notification_sender_info"]["avatar"] != "" ? notification_arr["notification_sender_info"]["avatar"] : LetterAvatar(notification_arr["notification_sender_info"]["first_name"] , 60) ) + `' alt='Image'/>
</div>
</div>

</div><!-- end +avatarContainerChild -->
</div><!-- end +avatarContainer -->
</div> 

<div class='notificationTextContainer'>
<div class='notificationText'>
<a href='#modal1' class='commonLink notificationFromFullName showUserModal modal-trigger' data-target='user_modal' data-user-id='` + notification_arr["notification_sender_info"]["id"] + `'>`+ notification_sender_full_name +`</a> Wants You To See This Post.
</div>
<div class='notificationTime'>` + notification_arr["notification_time_string"] + `</div>
</div>

</div>`;
}

// user favorited your post
if(notification_arr["notification_type"] == 5) {
return `
<div class='singleNotification scaleHorizontallyCenteredItem lightgrey_background_on_active openSinglePost modal-trigger' data-target='singlePostModal' data-notification-id='`+ notification_arr["notification_id"] +`' data-actual-post-id='`+ notification_arr["notification_extra"] +`' data-notification-extra='` + notification_arr["notification_extra"] + `' data-notification-extra2='` + notification_arr["notification_extra2"] + `' data-notification-extra3='` + notification_arr["notification_extra3"] + `'>
<div class='notificationsAvatarContainer'>
<div class='avatarContainer'>
<div class='avatarContainerChild showUserModal modal-trigger' data-target='user_modal' data-user-id='` + notification_arr["notification_sender_info"]["id"] + `' ` + notification_arr[`notification_from`] + `'>
<div class='rotateContainer' style='margin-top:`+notification_arr["notification_sender_info"]["avatar_positions"][0]+`%;margin-left:`+notification_arr["notification_sender_info"]["avatar_positions"][1]+`%;'>
<div class='avatarRotateDiv' data-rotate-degree='`+notification_arr["notification_sender_info"]["avatar_rotate_degree"]+`' style='transform: rotate(` + notification_arr["notification_sender_info"]["avatar_rotate_degree"] + `deg)'>
<img id='avatar` + random_num + `' class='avatarImages notificationAvatarImages' src='` + (notification_arr["notification_sender_info"]["avatar"] != "" ? notification_arr["notification_sender_info"]["avatar"] : LetterAvatar(notification_arr["notification_sender_info"]["first_name"] , 60) ) + `' alt='Image'/>
</div>
</div>

</div><!-- end +avatarContainerChild -->
</div><!-- end +avatarContainer -->
</div> 

<div class='notificationTextContainer'>
<div class='notificationText'>
<a href='#modal1' class='commonLink notificationFromFullName showUserModal modal-trigger' data-target='user_modal' data-user-id='` + notification_arr["notification_sender_info"]["id"] + `'>`+ notification_sender_full_name +`</a> `+ (notification_arr["notification_and_others"] > 0 ?  `And ` + notification_arr["notification_and_others"] + ` Other` + (notification_arr["notification_and_others"] == 1 ? `` : `s`) : ``) +` Favorited Your Post.
</div>
<div class='notificationTime'>` + notification_arr["notification_time_string"] + `</div>
</div>

</div>`;
}

// user started following you
if(notification_arr["notification_type"] == 6) {
return `
<div class='singleNotification scaleHorizontallyCenteredItem lightgrey_background_on_active showUserModal modal-trigger' data-notification-id='`+ notification_arr["notification_id"] +`' data-target='user_modal' data-user-id='`+ notification_arr["notification_sender_info"]["id"] +`' data-notification-extra='` + notification_arr["notification_extra"] + `' data-notification-extra2='` + notification_arr["notification_extra2"] + `' data-notification-extra3='` + notification_arr["notification_extra3"] + `'>
<div class='notificationsAvatarContainer'>
<div class='avatarContainer'>
<div class='avatarContainerChild showUserModal modal-trigger' data-target='user_modal' data-user-id='` + notification_arr["notification_sender_info"]["id"] + `' ` + notification_arr[`notification_from`] + `'>
<div class='rotateContainer' style='margin-top:` + notification_arr["notification_sender_info"]["avatar_positions"][0] + `%;margin-left:`+notification_arr["notification_sender_info"]["avatar_positions"][1]+`%;'>
<div class='avatarRotateDiv' data-rotate-degree='` + notification_arr["notification_sender_info"]["avatar_rotate_degree"] + `' style='transform: rotate(` + notification_arr["notification_sender_info"]["avatar_rotate_degree"] + `deg)'>
<img id='avatar` + random_num + `' class='avatarImages notificationAvatarImages' src='` + (notification_arr["notification_sender_info"]["avatar"] != "" ? notification_arr["notification_sender_info"]["avatar"] : LetterAvatar(notification_arr["notification_sender_info"]["first_name"] , 60) ) + `' alt='Image'/>
</div>
</div>

</div><!-- end +avatarContainerChild -->
</div><!-- end +avatarContainer -->
</div> 

<div class='notificationTextContainer'>
<div class='notificationText'>
<a href='#modal1' class='commonLink notificationFromFullName showUserModal modal-trigger' data-target='user_modal' data-user-id='` + notification_arr["notification_sender_info"]["id"] + `'>`+ notification_sender_full_name +`</a>  `+ (notification_arr["notification_and_others"] > 0 ?  `And ` + notification_arr["notification_and_others"] + ` Other` + (notification_arr["notification_and_others"] == 1 ? `` : `s`) : ``) +` Started Following You.
</div>
<div class='notificationTime'>` + notification_arr["notification_time_string"] + `</div>
</div>

</div>`;
}

// user upvoted your comment to a post
if(notification_arr["notification_type"] == 7) {
return `
<div class='singleNotification scaleHorizontallyCenteredItem lightgrey_background_on_active showPostComments modal-trigger' data-target='commentsModal' data-notification-id='`+ notification_arr["notification_id"] +`' data-pin-comment-to-top='`+ notification_arr["notification_extra2"]  +`' data-actual-post-id='`+ notification_arr["notification_extra"] +`' data-notification-extra='` + notification_arr["notification_extra"] + `' data-notification-extra2='` + notification_arr["notification_extra2"] + `' data-notification-extra3='` + notification_arr["notification_extra3"] + `'>
<div class='notificationsAvatarContainer'>
<div class='avatarContainer'>
<div class='avatarContainerChild showUserModal modal-trigger' data-target='user_modal' data-user-id='` + notification_arr["notification_sender_info"]["id"] + `' ` + notification_arr[`notification_from`] + `'>
<div class='rotateContainer' style='margin-top:`+notification_arr["notification_sender_info"]["avatar_positions"][0]+`%;margin-left:`+notification_arr["notification_sender_info"]["avatar_positions"][1]+`%;'>
<div class='avatarRotateDiv' data-rotate-degree='`+notification_arr["notification_sender_info"]["avatar_rotate_degree"]+`' style='transform: rotate(` + notification_arr["notification_sender_info"]["avatar_rotate_degree"] + `deg)'>
<img id='avatar` + random_num + `' class='avatarImages notificationAvatarImages' src='` + (notification_arr["notification_sender_info"]["avatar"] != "" ? notification_arr["notification_sender_info"]["avatar"] : LetterAvatar(notification_arr["notification_sender_info"]["first_name"] , 60) ) + `' alt='Image'/>
</div>
</div>

</div><!-- end +avatarContainerChild -->
</div><!-- end +avatarContainer -->
</div> 

<div class='notificationTextContainer'>
<div class='notificationText'>
<a href='#modal1' class='commonLink notificationFromFullName showUserModal modal-trigger' data-target='user_modal' data-user-id='` + notification_arr["notification_sender_info"]["id"] + `'>`+ notification_sender_full_name +`</a> `+ (notification_arr["notification_and_others"] > 0 ?  `And ` + notification_arr["notification_and_others"] + ` Other` + (notification_arr["notification_and_others"] == 1 ? `` : `s`) : ``) +` Upvoted Your Comment.<br><span class='smallerFontSize boldText'>(<a href='#singlePostModal' class='commonLink openSinglePost modal-trigger' data-actual-post-id='`+ notification_arr["notification_extra"] +`'>View Post</a>)</span>
</div>
<div class='notificationTime'>` + notification_arr["notification_time_string"] + `</div>
</div>

</div>`;
}

// user downvoted your comment to a post
if(notification_arr["notification_type"] == 8) {
return `
<div class='singleNotification scaleHorizontallyCenteredItem lightgrey_background_on_active showPostComments modal-trigger' data-target='commentsModal' data-notification-id='`+ notification_arr["notification_id"] +`' data-pin-comment-to-top='`+ notification_arr["notification_extra2"]  +`' data-actual-post-id='`+ notification_arr["notification_extra"] +`' data-notification-extra='` + notification_arr["notification_extra"] + `' data-notification-extra2='` + notification_arr["notification_extra2"] + `' data-notification-extra3='` + notification_arr["notification_extra3"] + `'>
<div class='notificationsAvatarContainer'>
<div class='avatarContainer'>
<div class='avatarContainerChild showUserModal modal-trigger' data-target='user_modal' data-user-id='` + notification_arr["notification_sender_info"]["id"] + `' ` + notification_arr[`notification_from`] + `'>
<div class='rotateContainer' style='margin-top:`+notification_arr["notification_sender_info"]["avatar_positions"][0]+`%;margin-left:`+notification_arr["notification_sender_info"]["avatar_positions"][1]+`%;'>
<div class='avatarRotateDiv' data-rotate-degree='`+notification_arr["notification_sender_info"]["avatar_rotate_degree"]+`' style='transform: rotate(` + notification_arr["notification_sender_info"]["avatar_rotate_degree"] + `deg)'>
<img id='avatar` + random_num + `' class='avatarImages notificationAvatarImages' src='` + (notification_arr["notification_sender_info"]["avatar"] != "" ? notification_arr["notification_sender_info"]["avatar"] : LetterAvatar(notification_arr["notification_sender_info"]["first_name"] , 60) ) + `' alt='Image'/>
</div>
</div>

</div><!-- end +avatarContainerChild -->
</div><!-- end +avatarContainer -->
</div> 

<div class='notificationTextContainer'>
<div class='notificationText'>
<a href='#modal1' class='commonLink notificationFromFullName showUserModal modal-trigger' data-target='user_modal' data-user-id='` + notification_arr["notification_sender_info"]["id"] + `'>`+ notification_sender_full_name +`</a> `+ (notification_arr["notification_and_others"] > 0 ?  `And ` + notification_arr["notification_and_others"] + ` Other` + (notification_arr["notification_and_others"] == 1 ? `` : `s`) : ``) +` Downvoted Your Comment. <br><span class='smallerFontSize boldText'>(<a href='#singlePostModal' class='commonLink openSinglePost modal-trigger' data-actual-post-id='`+ notification_arr["notification_extra"] +`'>View Post</a>)</span>
</div>
<div class='notificationTime'>` + notification_arr["notification_time_string"] + `</div>
</div>

</div>`;
}

// user upvoted your reply to a comment or reply
if(notification_arr["notification_type"] == 9) {
return `
<div class='singleNotification scaleHorizontallyCenteredItem lightgrey_background_on_active  modal-trigger addReplyToComment' data-target='commentRepliesModal' data-notification-id='`+ notification_arr["notification_id"] +`' data-pin-comment-to-top='`+ notification_arr["notification_extra3"]  +`' data-comment-id='`+ notification_arr["notification_extra"] +`' data-actual-post-id='`+ notification_arr["notification_extra2"] +`' data-notification-extra='` + notification_arr["notification_extra"] + `' data-notification-extra2='` + notification_arr["notification_extra2"] + `' data-notification-extra3='` + notification_arr["notification_extra3"] + `'>
<div class='notificationsAvatarContainer'>
<div class='avatarContainer'>
<div class='avatarContainerChild showUserModal modal-trigger' data-target='user_modal' data-user-id='` + notification_arr["notification_sender_info"]["id"] + `' ` + notification_arr[`notification_from`] + `'>
<div class='rotateContainer' style='margin-top:`+notification_arr["notification_sender_info"]["avatar_positions"][0]+`%;margin-left:`+notification_arr["notification_sender_info"]["avatar_positions"][1]+`%;'>
<div class='avatarRotateDiv' data-rotate-degree='`+notification_arr["notification_sender_info"]["avatar_rotate_degree"]+`' style='transform: rotate(` + notification_arr["notification_sender_info"]["avatar_rotate_degree"] + `deg)'>
<img id='avatar` + random_num + `' class='avatarImages notificationAvatarImages' src='` + (notification_arr["notification_sender_info"]["avatar"] != "" ? notification_arr["notification_sender_info"]["avatar"] : LetterAvatar(notification_arr["notification_sender_info"]["first_name"] , 60) ) + `' alt='Image'/>
</div>
</div>

</div><!-- end +avatarContainerChild -->
</div><!-- end +avatarContainer -->
</div> 

<div class='notificationTextContainer'>
<div class='notificationText'>
<a href='#modal1' class='commonLink notificationFromFullName showUserModal modal-trigger' data-target='user_modal' data-user-id='` + notification_arr["notification_sender_info"]["id"] + `'>`+ notification_sender_full_name +`</a> `+ (notification_arr["notification_and_others"] > 0 ?  `And ` + notification_arr["notification_and_others"] + ` Other` + (notification_arr["notification_and_others"] == 1 ? `` : `s`) : ``) + ` Upvoted Your Reply.  <br><span class='smallerFontSize boldText'>(<a href='#singlePostModal' class='commonLink openSinglePost modal-trigger' data-actual-post-id='`+ notification_arr["notification_extra2"] +`'>View Post</a>)</span>
</div>
<div class='notificationTime'>` + notification_arr["notification_time_string"] + `</div>
</div>

</div>`;
}

// user downvoted your reply to a comment
if(notification_arr["notification_type"] == 10) {
return `
<div class='singleNotification scaleHorizontallyCenteredItem lightgrey_background_on_active  modal-trigger addReplyToComment' data-target='commentRepliesModal' data-notification-id='`+ notification_arr["notification_id"] +`' data-pin-comment-to-top='`+ notification_arr["notification_extra3"]  +`' data-comment-id='`+ notification_arr["notification_extra"] +`' data-actual-post-id='`+ notification_arr["notification_extra2"] +`' data-notification-extra='` + notification_arr["notification_extra"] + `' data-notification-extra2='` + notification_arr["notification_extra2"] + `' data-notification-extra3='` + notification_arr["notification_extra3"] + `'>
<div class='notificationsAvatarContainer'>
<div class='avatarContainer'>
<div class='avatarContainerChild showUserModal modal-trigger' data-target='user_modal' data-user-id='` + notification_arr["notification_sender_info"]["id"] + `' ` + notification_arr[`notification_from`] + `'>
<div class='rotateContainer' style='margin-top:`+notification_arr["notification_sender_info"]["avatar_positions"][0]+`%;margin-left:` + notification_arr["notification_sender_info"]["avatar_positions"][1] + `%;'>
<div class='avatarRotateDiv' data-rotate-degree='`+notification_arr["notification_sender_info"]["avatar_rotate_degree"]+`' style='transform: rotate(` + notification_arr["notification_sender_info"]["avatar_rotate_degree"] + `deg)'>
<img id='avatar` + random_num + `' class='avatarImages notificationAvatarImages' src='` + (notification_arr["notification_sender_info"]["avatar"] != "" ? notification_arr["notification_sender_info"]["avatar"] : LetterAvatar(notification_arr["notification_sender_info"]["first_name"] , 60) ) + `' alt='Image'/>
</div>
</div>

</div><!-- end +avatarContainerChild -->
</div><!-- end +avatarContainer -->
</div> 

<div class='notificationTextContainer'>
<div class='notificationText'>
<a href='#modal1' class='commonLink notificationFromFullName showUserModal modal-trigger' data-target='user_modal' data-user-id='` + notification_arr["notification_sender_info"]["id"] + `'>`+ notification_sender_full_name +`</a> `+ (notification_arr["notification_and_others"] > 0 ?  `And ` + notification_arr["notification_and_others"] + ` Other` + (notification_arr["notification_and_others"] == 1 ? `` : `s`) : ``) +` Downvoted Your Reply.  <br><span class='smallerFontSize boldText'>(<a href='#singlePostModal' class='commonLink openSinglePost modal-trigger' data-actual-post-id='`+ notification_arr["notification_extra2"] +`'>View Post</a>)</span>
</div>
<div class='notificationTime'>` + notification_arr["notification_time_string"] + `</div>
</div>

</div>`;
}

// user reacted to a post you sent to him
if(notification_arr["notification_type"] == 11) {
return `
<div class='singleNotification scaleHorizontallyCenteredItem lightgrey_background_on_active openSinglePost modal-trigger' data-target='singlePostModal' data-notification-id='`+ notification_arr["notification_id"] +`' data-actual-post-id='`+ notification_arr["notification_extra"] +`' data-notification-extra='` + notification_arr["notification_extra"] + `' data-notification-extra2='` + notification_arr["notification_extra2"] + `' data-notification-extra3='` + notification_arr["notification_extra3"] + `'>
<div class='notificationsAvatarContainer'>
<div class='avatarContainer'>
<div class='avatarContainerChild showUserModal modal-trigger' data-target='user_modal' data-user-id='` + notification_arr["notification_sender_info"]["id"] + `' ` + notification_arr[`notification_from`] + `'>
<div class='rotateContainer' style='margin-top:`+ notification_arr["notification_sender_info"]["avatar_positions"][0]+`%;margin-left:`+notification_arr["notification_sender_info"]["avatar_positions"][1]+`%;'>
<div class='avatarRotateDiv' data-rotate-degree='`+ notification_arr["notification_sender_info"]["avatar_rotate_degree"]+`' style='transform: rotate(` + notification_arr["notification_sender_info"]["avatar_rotate_degree"] + `deg)'>
<img id='avatar` + random_num + `' class='avatarImages notificationAvatarImages' src='` + (notification_arr["notification_sender_info"]["avatar"] != "" ? notification_arr["notification_sender_info"]["avatar"] : LetterAvatar(notification_arr["notification_sender_info"]["first_name"] , 60) ) + `' alt='Image'/>
</div>
</div>

</div><!-- end .avatarContainerChild -->
</div><!-- end .avatarContainer -->
</div> 

<div class='notificationTextContainer'>
<div class='notificationText'>
<a href='#modal1' class='commonLink notificationFromFullName showUserModal modal-trigger' data-target='user_modal' data-user-id='` + notification_arr["notification_sender_info"]["id"] + `'>`+ notification_sender_full_name +`</a> Reacted To The Post You Sent Him.
</div>
<div class='notificationTime'>` + notification_arr["notification_time_string"] + `</div>
</div>

</div>`;
}

}



function get_notification_callback(notifications_arr, empty_now_message, container_element, callback) {

/* if the user is not infinite scrolling and they have no notifications (only supposed to happen when the user has never had a notification, 
not when they don't have any new notifications), add a placeholder div to tell the user there have been no results. */
if(notifications_arr.length < 1 && container_element.find(".singleNotification").length < 1) {
container_element.html("<div class='emptyNowPlaceholder'><i class='material-icons'>info</i><br>" + empty_now_message + "</div>");	
}
else if(notifications_arr.length < 1) {
container_element.append(get_end_of_results_mark_up("End of notifications"));	
container_element.attr("data-end-of-results", "true");	
}

for(var i = 0; i < notifications_arr.length; i++) {	
container_element.append( get_notification_markup(notifications_arr[i]) );
}

container_element.find(".avatarImages").on("load", function(){
fitToParent($(this));
adaptRotateWithMargin($(this), $(this).parent().attr("data-rotate-degree"), false);	
});

if(typeof callback == "function") {
callback(notifications_arr);	
}

}



function notifications_section_tabs_changed() {

var active_tab = NOTIFICATIONS_TABS_STATE_HOLDER.attr("data-active-tab");

FIRST_TAB_NOTIFICATIONS_CONTAINER.html("");
FIRST_TAB_NOTIFICATIONS_CONTAINER.scrollTop("0");
FIRST_TAB_NOTIFICATIONS_CONTAINER.attr("data-end-of-results", "false");
SECOND_TAB_NOTIFICATIONS_CONTAINER.html("");
SECOND_TAB_NOTIFICATIONS_CONTAINER.scrollTop("0");
SECOND_TAB_NOTIFICATIONS_CONTAINER.attr("data-end-of-results", "false");


// user switched to the PEOPLE tab
if(active_tab == "0") {
SECOND_TAB_NOTIFICATIONS_CONTAINER.hide();
FIRST_TAB_NOTIFICATIONS_CONTAINER.show();
showLoading(FIRST_TAB_NOTIFICATIONS_CONTAINER, "50%");
getNotifications(0, 0, function(data){
get_notification_callback(data, FIRST_TAB_EMPTY_NOW_MESSAGE, FIRST_TAB_NOTIFICATIONS_CONTAINER, function(){
removeLoading(FIRST_TAB_NOTIFICATIONS_CONTAINER);
});
});
}
// user switched to the TAGS tab
else if(active_tab == "1"){
FIRST_TAB_NOTIFICATIONS_CONTAINER.hide();	
SECOND_TAB_NOTIFICATIONS_CONTAINER.show();
showLoading(SECOND_TAB_NOTIFICATIONS_CONTAINER, "50%");
getNotifications(0, 1, function(data){
get_notification_callback(data, SECOND_TAB_EMPTY_NOW_MESSAGE, SECOND_TAB_NOTIFICATIONS_CONTAINER, function(){
removeLoading(SECOND_TAB_NOTIFICATIONS_CONTAINER);
});
});
}



}



/* we are adding this timeout thing to the notifications because of notifications 
that have an on/off nature such as favoriting a post, without the timeout, if a user
favorited your post and then removed it a notification would weirdly appear and then 
not disappear, or the new-notifications badge would become "1" and then when you went
to the notifications there would be no new ones, it is just more consistent to have 
a timeout before you get the notifications just to make up for cases where the user 
on the other end changes their mind. */
var NEW_NOTIFICATIONS_TIMEOUT_TIME = 5000;
var new_notifications_timeout = 0;
function there_are_new_notifications(data) {


// if the user is not in the notifications section, then just update the new-notifications badge.
if(check_if_main_screen_is_open("main_screen_notifications") == false) {
	
if(new_notifications_timeout === 0) {	
new_notifications_timeout = setTimeout(
function(){get_new_notifications_num(function(num) {	
if(parseFloat(num) > 0) {
NEW_NOTIFICATIONS_NUM_CONTAINER.html(num).show();	
}
});	
new_notifications_timeout = 0;
}, NEW_NOTIFICATIONS_TIMEOUT_TIME);
}

}
else {

if(new_notifications_timeout === 0) {		
new_notifications_timeout = setTimeout(function() {	

var active_tab = NOTIFICATIONS_TABS_STATE_HOLDER.attr("data-active-tab");

// user switched to the PEOPLE tab
if(active_tab == "0") {
getNotifications(0, 0, function(data){
new_notifications_callback(data, FIRST_TAB_NOTIFICATIONS_CONTAINER);
});
}
// user switched to the TAGS tab
else if(active_tab == "1"){
getNotifications(0, 0, function(data){
new_notifications_callback(data, SECOND_TAB_NOTIFICATIONS_CONTAINER);
});
}

new_notifications_timeout = 0;
}, NEW_NOTIFICATIONS_TIMEOUT_TIME);
}

}

}

function new_notifications_callback(notifications_arr, container_element) {
if(notifications_arr.length > 0) {
container_element.scrollTop("0");
container_element.find(".emptyNowPlaceholder").remove();

for(var i = 0; i < notifications_arr.length; i++) {
/* prepend_ok and everything associated with it is used to 
prevent duplicate notifications, for example without prepend_ok,
you could follow a user, and a new notification would be added, 
all good, but then if you unfollowed the user and then followed 
them again, a duplicate notification would be added. */	
var prepend_ok = true;	
container_element.find(".singleNotification").each(function(){
if(notifications_arr[i]["notification_extra"] == $(this).attr("data-notification-extra") && 
notifications_arr[i]["notification_extra2"] == $(this).attr("data-notification-extra2") && 
notifications_arr[i]["notification_extra3"] == $(this).attr("data-notification-extra3")) {
prepend_ok = false;
}	
});
prepend_ok == true ? container_element.prepend( get_notification_markup(notifications_arr[i]) ) : null;
}

container_element.find(".avatarImages").on("load", function(){
fitToParent($(this));
adaptRotateWithMargin($(this), $(this).parent().attr("data-rotate-degree"), false);	
});

set_notifications_read_yet_to_true();	
}	
}



// use this function to set a message from unread to read.
function set_notifications_read_yet_to_true(notification_id) {
		
if(typeof notification_id == "undefined") {
return false;	
}	

$.post({
url: PATH_TO_SERVER_PHP_FILES + "set_notifications_read_yet_to_true.php",
data: {
"notification_id": notification_id
}
});

}



$(document).on("dom_and_device_ready", function() {
	
FIRST_TAB_NOTIFICATIONS_CONTAINER = $("#first_tab_notifications_container");
SECOND_TAB_NOTIFICATIONS_CONTAINER = $("#second_tab_notifications_container");
NOTIFICATIONS_TABS_STATE_HOLDER = $("#notifications_container");
NOTIFICATIONS_IMPORTANT_CONTAINER = $("#notifications_important_container");
NOTIFICATIONS_ALL_CONTAINER = $("#notifications_all_container");
NEW_NOTIFICATIONS_NUM_CONTAINER = $("#new_notifications_num");

get_new_notifications_num(function(num) {	
if(parseFloat(num) > 0) {
NEW_NOTIFICATIONS_NUM_CONTAINER.html(num).show();	
}
});


$(document).on("click", "#notifications_tabs .tab", function() {
NOTIFICATIONS_TABS_STATE_HOLDER.attr("data-active-tab", $(this).attr("data-tab-index"));		
notifications_section_tabs_changed();
});


// the user wants to see their unread notifications
$(document).on("click",".openNotificationsModal",function(){	
	
// empty the notification container element	
FIRST_TAB_NOTIFICATIONS_CONTAINER.html("");	
SECOND_TAB_NOTIFICATIONS_CONTAINER.html("");	
FIRST_TAB_NOTIFICATIONS_CONTAINER.attr("data-end-of-results", "false");
SECOND_TAB_NOTIFICATIONS_CONTAINER.attr("data-end-of-results", "false");

var notifications_active_tab = parseFloat(NOTIFICATIONS_TABS_STATE_HOLDER.attr("data-active-tab"));

var notifications_container;
var request_notifications_type;
var empty_now_message;

if(notifications_active_tab == "0") {
request_notifications_type = 0;	
notifications_container = FIRST_TAB_NOTIFICATIONS_CONTAINER;
empty_now_message = FIRST_TAB_EMPTY_NOW_MESSAGE;
}
else if(notifications_active_tab == "1") {
request_notifications_type = 1;
notifications_container = SECOND_TAB_NOTIFICATIONS_CONTAINER;
empty_now_message = SECOND_TAB_EMPTY_NOW_MESSAGE;
}

showLoading(notifications_container, "50%");

getNotifications(0, request_notifications_type, function(data){
get_notification_callback(data, empty_now_message, notifications_container, function(){
removeLoading(notifications_container);
// remove the new notifications badge
NEW_NOTIFICATIONS_NUM_CONTAINER.hide();
});
});
$("#newNotificationsNumber").find(".notificationNumContainer").remove();
});
// user is infinite scrolling their notifications section 
FIRST_TAB_NOTIFICATIONS_CONTAINER.scroll(function(){
if($(this).attr("data-end-of-results") === "false") {	
if(($(this)[0].scrollHeight - ($(this).scrollTop() + $(this).outerHeight()) < 100) && notificationsPreventMultipleCalls == false) {
add_secondary_loading(FIRST_TAB_NOTIFICATIONS_CONTAINER);	
getNotifications(FIRST_TAB_NOTIFICATIONS_CONTAINER.find(".singleNotification").length, 0, function(data){
get_notification_callback(data, FIRST_TAB_EMPTY_NOW_MESSAGE,  FIRST_TAB_NOTIFICATIONS_CONTAINER, function(){
remove_secondary_loading(FIRST_TAB_NOTIFICATIONS_CONTAINER);	
});
});
}
}
});


// user is infinite scrolling their notifications section 
SECOND_TAB_NOTIFICATIONS_CONTAINER.scroll(function(){
if($(this).attr("data-end-of-results") === "false") {	
if(($(this)[0].scrollHeight - ($(this).scrollTop() + $(this).outerHeight()) < 100) && notificationsPreventMultipleCalls == false) {
add_secondary_loading(SECOND_TAB_NOTIFICATIONS_CONTAINER);	
getNotifications(SECOND_TAB_NOTIFICATIONS_CONTAINER.find(".singleNotification").length, 1, function(data){
get_notification_callback(data, SECOND_TAB_EMPTY_NOW_MESSAGE, SECOND_TAB_NOTIFICATIONS_CONTAINER, function(){
remove_secondary_loading(SECOND_TAB_NOTIFICATIONS_CONTAINER);	
});
});
}
}
});


	
	
});