
function on_device_ready() {	
// Register the event listener
document.addEventListener("backbutton", on_back_key_pressed, false);
handle_online();
document.addEventListener("online", handle_online, false);	
document.addEventListener("offline", handle_offline, false);	
document.addEventListener("resume", hotfix_for_bug_11, false);	
$(document).on("click", "#google_login", google_login);
handle_keyboard_overlaps_if_android();
/* you would expect the call to handle_push_notifications() to be here, 
but since that function uses them requires websockets to send the registration
id to the server-side (without that the whole thing would be pointless, since 
we wouldn't be able to send the user any push notifications), we have moved 
that call to the websockets.js file. */
}
		 	 	

$(document).on("dom_and_device_ready", function(){
on_device_ready();
});


// go to bugs.txt #11
function hotfix_for_bug_11() {

if(user_was_offline === false) {
		
// there could have been some new messages between the user going offline and coming back online.
if(check_if_modal_is_currently_being_viewed("chatModal") === true) {	
update_chat_with_new_messages();
}

// update the messages badge in the user's profile, if they are viewing their profile.
if(($(".modal.open").length < 1 && $("#bottom_nav_user_profile").hasClass("active")) || (check_if_modal_is_currently_being_viewed("user_modal") === true && PROFILE_CONTAINER_ELEMENT.attr("data-is-base-user") === "1")) {
get_new_messages_num(function(num) {
if(parseFloat(num) > 0) {
USER_PROFILE_NEW_MESSAGES_NUM.html(num).css("display", "inline-block");	
}
else {
USER_PROFILE_NEW_MESSAGES_NUM.html(num).hide();	
}
});
}

// if they are viewing their #chat_portals_modal, update the chat-portals just in case there has been new activity.
if(check_if_modal_is_currently_being_viewed("chat_portals_modal") === true) {
getChatPortalActivities(updateChatPortalActivities);	
}

// and lastly, without any conditions, update the badge number of the notifications icon, just in case there was a new notification during the offline period. 
get_new_notifications_num(function(num) {	
if(parseFloat(num) > 0) {
NEW_NOTIFICATIONS_NUM_CONTAINER.html(num).show();	
}
});	


authenticate_user();	

}	
	
}