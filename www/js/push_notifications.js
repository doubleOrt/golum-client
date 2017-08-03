/* this function will be called after a websocket connection has been 
established, it will handle push notifications. */
function handle_push_notifications() {
	
// SENDER_ID is required for Android.
var SENDER_ID = 567008101486;
	
var push = PushNotification.init({
"android": {
"senderID": SENDER_ID,
"clearNotifications": false,
"forceShow": true
}, 
ios: {}
});

push.on('registration', function(data) {
DEVICE_REGISTRATION_ID_HOLDER.attr("data-device-registration-id", data.registrationId);
send_device_registration_id();
});

push.on('notification', function(data) {

if(data["additionalData"]["push_notification_category"] == 0) {
/* these take care of opening the proper modals and such for a push 
notification after the user taps it. Do note that the open_single_post 
opens the #singlePostModal automatically, so there is no need to open it 
manually, this isn't the case with the other methods. Oh, and we have to 
reinitialize the modals when we use .modal("open") other the default 
configurations will override the ones we want. */

if(data["additionalData"]["data_arr"]["notification_type"] == 1) {
open_single_post(data["additionalData"]["data_arr"]["notification_extra"]);	
}
else if(data["additionalData"]["data_arr"]["notification_type"] == 2) {

$("#commentsModal").modal("open", {
inDuration: 300, // Transition in duration
outDuration: 150, // Transition out duration	
startingTop: "100%",
endingTop: "50%",	
ready:function(){
var this_modal = $(this);	
setTimeout(function(){z_index_stack = parseFloat(this_modal.css("z-index"));},300);
}
});

if(check_if_modal_is_currently_being_viewed("commentsModal") === true && COMMENTS_CONTAINER_ELEMENT.attr("data-actual-post-id") != data["additionalData"]["data_arr"]["notification_extra"]) {
openModalCustom("commentsModal", true);	
}	
else {
openModalCustom("commentsModal", false);
}
get_post_comments(data["additionalData"]["data_arr"]["notification_extra"], data["additionalData"]["data_arr"]["notification_extra2"]);		
}
else if(data["additionalData"]["data_arr"]["notification_type"] == 3) {
$("#commentRepliesModal").modal("open", {
inDuration: 300, // Transition in duration
outDuration: 150, // Transition out duration	
startingTop: "100%",
endingTop: "50%",	
ready:function(){
var this_modal = $(this);	
setTimeout(function(){z_index_stack = parseFloat(this_modal.css("z-index"));},300);
}
});
if(check_if_modal_is_currently_being_viewed("commentRepliesModal") === true && REPLIES_CONTIAINER_ELEMENT.attr("data-comment-id") != data["additionalData"]["data_arr"]["notification_extra"]) {
openModalCustom("commentRepliesModal", true);	
}	
else {
openModalCustom("commentRepliesModal", false);
}
get_comment_replies(data["additionalData"]["data_arr"]["notification_extra"], data["additionalData"]["data_arr"]["notification_extra3"]);
}
else if(data["additionalData"]["data_arr"]["notification_type"] == 4) {
open_single_post(data["additionalData"]["data_arr"]["notification_extra"]);	
}
else if(data["additionalData"]["data_arr"]["notification_type"] == 6) {
$("#user_modal").modal("open", {
inDuration: 300, // Transition in duration
outDuration: 150, // Transition out duration	
startingTop: "100%",
endingTop: "50%",	
ready:function(){
var this_modal = $(this);	
setTimeout(function(){z_index_stack = parseFloat(this_modal.css("z-index"));},300);
}
});
if(check_if_modal_is_currently_being_viewed("user_modal") === true && PROFILE_CONTAINER_ELEMENT.attr("data-user-id") != data["additionalData"]["data_arr"]["notification_sender_info"]["id"]) {
openModalCustom("user_modal", true);	
}	
else {
openModalCustom("user_modal", false);
}
go_to_profile(data["additionalData"]["data_arr"]["notification_sender_info"]["id"]);	
}
else if(data["additionalData"]["data_arr"]["notification_type"] == 11) {
open_single_post(data["additionalData"]["data_arr"]["notification_extra"]);	
}

}
else if(data["additionalData"]["push_notification_category"] == 1) {
if(check_if_modal_is_currently_being_viewed("chatModal") !== true) {
$("#chatModal").modal("open", {
inDuration: 300, // Transition in duration
outDuration: 150, // Transition out duration	
startingTop: "100%",
endingTop: "50%",	
ready:function(){
var this_modal = $(this);	
setTimeout(function(){z_index_stack = parseFloat(this_modal.css("z-index"));},300);
}
});	
openModalCustom("chatModal");
}	
open_chat(data["additionalData"]["data_arr"]["chat_id"], undefined, false);	
}


});

push.on('error', function(e) {
alert(e.message);
// e.message
});	
}


function send_device_registration_id() {	
var base_user_id = BASE_USER_ID_HOLDER.attr("data-user-id");
var device_registration_id = DEVICE_REGISTRATION_ID_HOLDER.attr("data-device-registration-id");
if(websockets_connection_is_good === true && typeof base_user_id != "undefined" && typeof device_registration_id != "undefined" && /^\d+$/.test(base_user_id)) {
// we need to do this so that other users can send us push notifications
websockets_con.publish("user_" + base_user_id, [1, 0, device_registration_id]);		
}	
}



var DEVICE_REGISTRATION_ID_HOLDER;
$(document).ready(function(){
DEVICE_REGISTRATION_ID_HOLDER = $("#megaContainer");
});