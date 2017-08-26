
var handle_offline_is_initial_call = true;
var user_was_offline = false;
function handle_offline() {
if(user_was_offline === false) {	
$(".toast").remove();
$("body").css("filter", "grayscale(100%)");
$("body").append("<div id='offline_overlay' style='display:none;background:rgba(0,0,0,.9);width:100%;height:100%;position:fixed;top:0;left:0;margin:0;padding:0;z-index:999999999'><div class='emptyNowPlaceholder' style='color: white;width: 70%;line-height:24px;'><i class='material-icons' style='font-size: 450%;'>wifi</i><br>No Internet Connectivity!</div></div>");
$("#offline_overlay").fadeIn();
user_was_offline = true;
if(handle_offline_is_initial_call === true && user_authenticated === false && CURRENT_PAGE === "LOGIN") {
$("#offline_overlay").before("<div id='offline_overlay_white_background' style='display:none;background:white;width:100%;height:100%;position:fixed;top:0;left:0;margin:0;padding:0;z-index:999999999'></div>");	
$("#offline_overlay_white_background").fadeIn();
}
handle_offline_is_initial_call = false;
}
}

function handle_online() {
				
if(user_was_offline === true) {
	
$("body").css("filter", "grayscale(0%)");	
$("#offline_overlay, #offline_overlay_white_background").fadeOut("fast", function(){
$(this).remove();	
});

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

user_was_offline = false;
}

authenticate_user();	
}