
var CHAT_ID_HOLDER;
var CHAT_CONTENT_CONTAINER_ELEMENT;

var chat_prevent_multiple_calls = false;

var startChatId;
var startChatRecipientId;

// this function is called whenever a chat modal is opened, and whenever the user wants to see previous messages.
function get_chat(chat_id, user_id, unhide_chat_if_hidden, row_offset, callback) {	

if(typeof callback != "function" || typeof row_offset == "undefined") {
return false;
}


if(chat_prevent_multiple_calls == false) {
									
var dataObj = {};

dataObj["row_offset"] = row_offset;
dataObj["unhide_chat_if_hidden"] = unhide_chat_if_hidden;

if(typeof chat_id != "undefined") {
dataObj["chat_id"] = chat_id;	
}
if(typeof user_id != "undefined") {
dataObj["user_id"] = user_id;	
}

chat_prevent_multiple_calls = true;	

$.get({
url:PATH_TO_SERVER_PHP_FILES + "get_chat.php",
data:dataObj,
type:"get",
success: function(data) {	
var data_arr = JSON.parse(data);
callback(data_arr);
chat_prevent_multiple_calls = false;
}
});
}

}

function get_chat_callback(is_infinite_scroll, data) {
		
CHAT_CONTENT_CONTAINER_ELEMENT.fadeIn("fast");
$("#recipient_name").fadeIn("fast");
$("#recipient_current_status").fadeIn("fast");		
		
if(data.length > 1) {	
$("#recipient_name").html(data[1]["recipient_first_name"]);	
$("#recipient_name").attr("data-recipient-id", data[1]["recipient_id"]);	
$("#sendMessage").attr("data-chat-id", data[1]["chat_id"]);
CHAT_ID_HOLDER.attr("data-chat-id", data[1]["chat_id"]);
currently_opened_chat_recipient_id = data[1]["recipient_id"];
}	

// this chat has no messages
if(data[0].length < 1 && CHAT_CONTENT_CONTAINER_ELEMENT.find(".messageContainer").length < 1) {
CHAT_CONTENT_CONTAINER_ELEMENT.html("<div class='emptyNowPlaceholder'><i class='material-icons'>info</i><br>This chat has no messages</div>");	
}

/* all this (new/old)_scroll_height stuff is to take care of scrolling back to the element that was the 
oldest message before this query (because jquery scrolls to the top on prepending). */
if(is_infinite_scroll === true) {
var old_scroll_height = CHAT_CONTENT_CONTAINER_ELEMENT[0].scrollHeight;
}

/* needs to be "prepend" instead of "append", because of the scrolling nature of the chat modal, 
which is different than the rest of the modals, in that you scroll to the top to see the older messages, 
while in the other modals, you scroll to the bottom to see the older whatevers. */
for(var i = 0; i < data[0].length; i++) {	
CHAT_CONTENT_CONTAINER_ELEMENT.prepend(get_message_markup(data[0][i]));	
}

if(is_infinite_scroll === false) {
// scroll to the bottom
CHAT_CONTENT_CONTAINER_ELEMENT.scrollTop(CHAT_CONTENT_CONTAINER_ELEMENT[0].scrollHeight);	
}
else if(is_infinite_scroll === true) {
var new_scroll_height = CHAT_CONTENT_CONTAINER_ELEMENT[0].scrollHeight;
CHAT_CONTENT_CONTAINER_ELEMENT.scrollTop(new_scroll_height - old_scroll_height);
}

getChatPortalActivities(updateChatPortalActivities);
}


/* call this function to get all unread messages for a chat
newer_than should be the id of a message (usually the latest message).
*/
function get_messages_newer_than(chat_id, newer_than, callback) {

if(typeof chat_id == "undefined" || typeof newer_than == "undefined" || typeof callback != "function") {
return false;
}

$.get({
url:PATH_TO_SERVER_PHP_FILES + "get_messages_newer_than.php",
data: {
"chat_id": chat_id, 
"newer_than": newer_than
},
type:"get",
success: function(data) {
var data_arr = JSON.parse(data);
callback(data_arr);
}
});
	
}




function switchChatModalSendButton(switchButtonTo) {

// the button can now be used to send images.
if(switchButtonTo == 0) {
$("#sendMessage i").html("camera_alt");	
$("#sendMessage").attr("data-file-or-send","0");		
}
// the button can now be used to send text.
else if(switchButtonTo == 1) {
$("#sendMessage i").html("send");	
$("#sendMessage").attr("data-file-or-send","1");		
}
	
}




function sendMessage(chatId, message, messageType, callback) {

$.post({
url: PATH_TO_SERVER_PHP_FILES + 'send_message.php',
data: {
"chat_id": chatId,
"message": message,
"type": messageType
},
success: function(data){	
var data_arr = JSON.parse(data);
if(typeof callback == "function") {
callback(data_arr);	
}
}
}); 
	
}


function sendTextMessage(chatId, message, callback) {

if(typeof chatId == "undefined" || typeof message == "undefined" || message.trim() == "" || typeof $("#sendMessage").attr("data-chat-id") == "undefined") {
return false;	
}

if(message.length > 400) {
Materialize.toast("Message Must Be Smaller Than 400 Characters",4000,"red");	
return false;
}

sendMessage(chatId, message, "text-message", callback);	
}


function sendImage(callback) {
var imageSizeLimit = 5000000;

var sendImageType = $("#sendImage")[0].files[0]["type"];
var sendImageSize = $("#sendImage")[0].files[0]["size"];	

if(sendImageType == "image/jpeg" || sendImageType == "image/jpg" || sendImageType == "image/png" || sendImageType == "image/gif") {
if(sendImageSize < imageSizeLimit) {					
if(sendImageSize > 1) {

var data = new FormData();
data.append("the_file", $("#sendImage")[0].files[0]);
data.append("chat_id",$("#sendMessage").attr("data-chat-id"));

$.post({
url: PATH_TO_SERVER_PHP_FILES + 'sendFiles.php',
data: data,
cache: false,
contentType: false,
processData: false,
success: function(data){
var data_arr = JSON.parse(data);	
if(typeof callback == "function") {
callback(data_arr);	
}	
}
}); 

}
else {
Materialize.toast("Sorry, There Is Something Wrong With Your Picture",4000,"red");	
}
}
else {
Materialize.toast("Image Size Must Be Smaller Than 5MB",6000,"red");
}	
}
else {
Materialize.toast("Image Type Must Be Either \"JPG\", \"PNG\" Or \"GIF\" !",6000,"red");	
}

}



function get_message_markup(data) {

var random_num = Math.floor(Math.random()*1000000);

// text-message
if(data["message_type"] == "0") {
/* a bit weird, but that "message + 1/0" classnaming logic is months old, if i were to recreate this now, the role 
of 1 and 0 would be reverted, with 1 referring to the base user, and 0 to the recipient */
return `
<div class='messageContainer message`+ (data["message_sent_by_base_user"] != "1" ? "1" : "0") +` fade_in_fast' id='message` + random_num + `' data-message-id='` + data["message_id"] + `'>
<div class='avatarContainer chatRecipientAvatar'>
<div class='avatarContainerChild showUserModal modal-trigger' data-target='user_modal' data-user-id='` + data["sender_info"]["id"] + `'>
<div class='rotateContainer' style='margin-top:` + data["sender_info"]["avatar_positions"][0] + `%;margin-left:` + data["sender_info"]["avatar_positions"][1] +`%;'>
<div class='avatarRotateDiv' data-rotate-degree='` + data["sender_info"]["avatar_rotate_degree"] + `' style='transform: rotate(` + data["sender_info"]["avatar_rotate_degree"] + `deg)'>
<img id='chat_avatar` + random_num + `' class='avatarImages notificationAvatarImages' src='` + (data["sender_info"]["avatar"] != "" ? data["sender_info"]["avatar"] : LetterAvatar(data["sender_info"]["first_name"] , 60) ) + `' alt='Image'/>
</div>
</div>
</div>
</div>

<div class='message'>
` + data["message"] + `
</div>
<div class='messageDate'>
` + data["time_string"] + `
</div>

<script>
	$('#chat_avatar` + random_num + `').on('load',function(){
		fitToParent($(this));
		adaptRotateWithMargin($(this),` + (data["sender_info"]["avatar_rotate_degree"] != "" ? data["sender_info"]["avatar_rotate_degree"] : 0) + `,false);
	});
</script>

</div><!-- end .messageContainer -->`;
}
else if(data["message_type"] == "1") {
return `<div class='messageContainer emojiMessageContainer message`+ (data["message_sent_by_base_user"] != "1" ? "1" : "0") +` fade_in_fast' id='message` + random_num + `' data-message-id='` + data["message_id"] + `'>

<div class='avatarContainer chatRecipientAvatar'>
<div class='avatarContainerChild showUserModal modal-trigger' data-target='user_modal' data-user-id='` + data["sender_info"]["id"] + `'>
<div class='rotateContainer' style='margin-top:` + data["sender_info"]["avatar_positions"][0] + `%;margin-left:` + data["sender_info"]["avatar_positions"][1] +`%;'>
<div class='avatarRotateDiv' data-rotate-degree='` + data["sender_info"]["avatar_rotate_degree"] + `' style='transform: rotate(` + data["sender_info"]["avatar_rotate_degree"] + `deg)'>
<img id='chat_avatar` + random_num + `' class='avatarImages notificationAvatarImages' src='` + (data["sender_info"]["avatar"] != "" ? data["sender_info"]["avatar"] : LetterAvatar(data["sender_info"]["first_name"] , 60) ) + `' alt='Image'/>
</div>
</div>
</div>
</div>

<div class='message emojiMessage ` + (data["message_sent_by_base_user"] == "0" && data["read_yet"] == "0" ? "unreadEmoji" : "") + `'>
<img src='` + data["message"] + `' alt='Emoji'/>
</div>
<div class='messageDate'>
` + data["time_string"] + `
</div>

<script>
	$('#chat_avatar` + random_num + `').on('load',function(){
		fitToParent($(this));
		adaptRotateWithMargin($(this),` + (data["sender_info"]["avatar_rotate_degree"] != "" ? data["sender_info"]["avatar_rotate_degree"] : 0) + `,false);
	});
</script>

</div><!-- end .messageContainer -->
`;	
}
else if(data["message_type"] == "2") {
return `<div class='messageContainer imageMessageContainer message`+ (data["message_sent_by_base_user"] != "1" ? "1" : "0") +` fade_in_fast' id='message` + random_num + `' data-message-id='` + data["message_id"] + `'>

<div class='avatarContainer chatRecipientAvatar'>
<div class='avatarContainerChild showUserModal modal-trigger' data-target='user_modal' data-user-id='` + data["sender_info"]["id"] + `'>
<div class='rotateContainer' style='margin-top:` + data["sender_info"]["avatar_positions"][0] + `%;margin-left:` + data["sender_info"]["avatar_positions"][1] +`%;'>
<div class='avatarRotateDiv' data-rotate-degree='` + data["sender_info"]["avatar_rotate_degree"] + `' style='transform: rotate(` + data["sender_info"]["avatar_rotate_degree"] + `deg)'>
<img id='chat_avatar` + random_num + `' class='avatarImages notificationAvatarImages' src='` + (data["sender_info"]["avatar"] != "" ? data["sender_info"]["avatar"] : LetterAvatar(data["sender_info"]["first_name"] , 60) ) + `' alt='Image'/>
</div>
</div>
</div>
</div>

<div class='fileMessageContainer'>
<img id='file` + random_num + `' src='` + data["message"] + `' alt='File' />
</div><!-- end .fileMessageContainer -->
<div class='messageDate'>
` + data["time_string"] + `
</div>

<script>
	$('#chat_avatar` + random_num + `').on('load',function(){
		fitToParent($(this));
		adaptRotateWithMargin($(this),` + (data["sender_info"]["avatar_rotate_degree"] != "" ? data["sender_info"]["avatar_rotate_degree"] : 0) + `,false);
	});
</script>

</div><!-- end .messageContainer -->
`;	
}
}



var currently_opened_chat_recipient_id = 0;




// use this function to get a string of the online/offline state of a user every user_status_interval_time seconds.
var user_status_interval;
var user_status_interval_time = 4000;
function start_pinging_for_user_status(user_id, callback) {
		
if(websockets_connection_is_good !== true) {
console.warn("Websocket connection has not been established!");		
return false;
}

get_user_status(user_id, callback);	
user_status_interval = setInterval(function(){
get_user_status(user_id, callback);	
}, user_status_interval_time);

}

function stop_pinging_for_user_status() {
clearInterval(user_status_interval);	
user_status_interval = undefined;	
}

// use this function to get a user's status (online/offline)
function get_user_status(user_id, callback) {
	
if(websockets_connection_is_good !== true) {
return false;	
}
	
websockets_con.publish("user_" + BASE_USER_ID_HOLDER.attr("data-user-id"), [0,"user_" + user_id, websocket_request_id]);	
handle_user_channel_message_callbacks.push({
"request_id": websocket_request_id, 
"callback": callback
});	
websocket_request_id++;
}



// use this function to set a message from unread to read.
function set_message_read_yet_to_true(message_id) {
	
if(typeof message_id == "undefined") {
return false;	
}	

// so that a user cannot modify the read-yet of messages sent by themselves.
if(typeof $(".messageContainer[data-message-id='" + message_id + "']") != "undefined" && $(".messageContainer[data-message-id='" + message_id + "']").hasClass("message0")) {
console.warn("Users cannot modify the read-yet property of their own messages!");
return false;	
}

$.post({
url: PATH_TO_SERVER_PHP_FILES + "set_messages_read_yet_to_true.php",
data: {
"message_id": message_id
}
});

}

// use this function to set the read_yet of all a chat's messages to true.
function set_all_chat_messages_read_yet_to_true(chat_id) {

if(typeof chat_id == "undefined") {
return false;	
}

$.post({
url: PATH_TO_SERVER_PHP_FILES + "set_messages_read_yet_to_true.php",
data: {
"chat_id": chat_id
}
});
	
}


function chat_modal_visible(from_back_button) {

set_chat_constants();

if(typeof $("#recipient_name").attr("data-recipient-id") !== "undefined" && from_back_button === true) {
currently_opened_chat_recipient_id = $("#recipient_name").attr("data-recipient-id");
update_chat_with_new_messages();
stop_pinging_for_user_status();
start_pinging_for_user_status(currently_opened_chat_recipient_id, function(data){
$("#recipient_current_status").html(data["current_state"]);		
});
}


/* if you remove this conditional, a bug will occur when 
the user opens a chat from not the back-button: the 
read_yets for all the messages for the previously opened 
chat will be set to true instead of the messages for the 
chat that is to be opened (that is because this function 
is called before the data-chat-id attribute is updated). */
if(from_back_button === true) {
var chat_id = CHAT_ID_HOLDER.attr("data-chat-id");	
if(typeof chat_id != "undefined" && /^\d+$/.test(chat_id) === true) {
set_all_chat_messages_read_yet_to_true(chat_id);
}
}

CHAT_CONTENT_CONTAINER_ELEMENT.fadeIn("fast");
$("#recipient_name").fadeIn("fast");
$("#recipient_current_status").fadeIn("fast");	


/* we have to do this because of the absence of an "on" handler for the scroll event, otherwise 
whenever we opened a chat modal on top of another chat modal, after closing it we would lose 
the scroll event (because due to the architecture of the modals, we would change the html of 
the chat-modal in our modals.js page. */
CHAT_CONTENT_CONTAINER_ELEMENT.off("scroll");
CHAT_CONTENT_CONTAINER_ELEMENT.scroll(function(event){
if($(this).scrollTop() == 0) {
get_chat($("#sendMessage").attr("data-chat-id"), undefined, true, CHAT_CONTENT_CONTAINER_ELEMENT.find(".messageContainer").length, function(data){
get_chat_callback(true, data);
// we want to update the badge on the user's profile that displays the number of their unread messages each time they view some of those unread messages.
get_new_messages_num(function(num) {
if(parseFloat(num) > 0) {
USER_PROFILE_NEW_MESSAGES_NUM.html(num).css("display", "inline-block");	
}
else {
USER_PROFILE_NEW_MESSAGES_NUM.html(num).hide();	
}
});
	
});
}
});

}

function set_chat_constants() {
CHAT_ID_HOLDER = $("#chat_content_container");
CHAT_CONTENT_CONTAINER_ELEMENT = $("#chat_content_container");	
}




// this function is called whenever there is a new message, regardless of whether or not a chat is opened.
function there_are_new_messages(data) {

/* if these two conditionals evaluate to true, then it means that the user just 
saw the new message therefore we don't need to tell them that they have new messages 
by adding those badges to the components. Instead, we just append the new message */
if(CHAT_ID_HOLDER.attr("data-chat-id") == data["chat_id"]) {

CHAT_CONTENT_CONTAINER_ELEMENT.find(".emptyNowPlaceholder").remove();	
CHAT_CONTENT_CONTAINER_ELEMENT.append(get_message_markup(data));	
CHAT_CONTENT_CONTAINER_ELEMENT.scrollTop(CHAT_CONTENT_CONTAINER_ELEMENT[0].scrollHeight);		

if(check_if_modal_is_currently_being_viewed("chatModal") === true && data["message_sent_by_base_user"] != "1") {
set_message_read_yet_to_true(data["message_id"]);
}

}	

/* i know that we should probably update the char portals and user modals even when 
they are not currently being viewed, but see bugs.txt #10. */


if(check_if_modal_is_currently_being_viewed("chat_portals_modal") === true) {
getChatPortalActivities(updateChatPortalActivities);	
}
		
if(check_if_main_screen_is_open("main_screen_user_profile") === true || check_if_modal_is_currently_being_viewed("user_modal") === true) {
get_new_messages_num(function(num) {
if(parseFloat(num) > 0) {
USER_PROFILE_NEW_MESSAGES_NUM.html(num).css("display", "inline-block");	
}
else {
USER_PROFILE_NEW_MESSAGES_NUM.html(num).hide();	
}
});
}

}


// this function is clicked whenever the user clicks a "new message from x" push notification, the first parameter is the message-data.
function new_message_push_notification_received(data) {
	
var chat_modal_is_currently_being_viewed = check_if_modal_is_currently_being_viewed("chatModal");
		
/* Do note that we don't have a conditional for a "the chat-modal for the chat this message 
belongs to is already opened" case because that one will be dealt with by our websockets 
connection which calls "there_are_new_messages()". For more information on this, go to 
bugs.txt #9.
*/
		
		
if(chat_modal_is_currently_being_viewed === true) {	
/* chat-modal is open but not current chat (e.g user has opened a chat but the app 
is currently in the background, they receive a push-notification from our app and 
click it, this conditional will evaluate to true). */
if(CHAT_ID_HOLDER.attr("data-chat-id") != data["chat_id"]) {
open_chat(data["chat_id"], undefined, false);
}
}
/* if the chat-modal is not currently being viewed (e.g the user has closed our app, 
but is logged in, they receive a new message and click on it, the app will be opened 
and this conditional will evaluate to true) */
else {
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
open_chat(data["chat_id"], undefined, false);		
}

}




function open_chat(chat_id, recipient_id, unhide_chat_if_hidden) {

CHAT_CONTENT_CONTAINER_ELEMENT.html("");

get_chat(chat_id, recipient_id, unhide_chat_if_hidden, 0, function(data){
	
get_chat_callback(false, data);

// we want to update the badge on the user's profile that displays the number of their unread messages each time they view some of those unread messages.
get_new_messages_num(function(num) {
if(parseFloat(num) > 0) {
USER_PROFILE_NEW_MESSAGES_NUM.html(num).css("display", "inline-block");	
}
else {
USER_PROFILE_NEW_MESSAGES_NUM.html(num).hide();	
}
});

stop_pinging_for_user_status();
start_pinging_for_user_status(recipient_id, function(data){	
$("#recipient_current_status").html(data["current_state"]);
});

});	

}


// extracts the currently opened chat's id from the #chatModal, and then updates it with any unread messages, if any.
function update_chat_with_new_messages() {
var chat_id = CHAT_ID_HOLDER.attr("data-chat-id");
var latest_message_id = CHAT_CONTENT_CONTAINER_ELEMENT.find(".messageContainer").last().attr("data-message-id");
if(typeof chat_id != "undefined" && typeof latest_message_id != "undefined" && /^\d+$/.test(chat_id) === true && /^\d+$/.test(latest_message_id) === true) {
get_messages_newer_than(chat_id, latest_message_id, function(data){
for(var i = 0; i < data[0].length; i++) {
CHAT_CONTENT_CONTAINER_ELEMENT.append(get_message_markup(data[0][i]));	
}
if(data[0].length > 0) {
getChatPortalActivities(updateChatPortalActivities);	
}
// scroll to the bottom
CHAT_CONTENT_CONTAINER_ELEMENT.scrollTop(CHAT_CONTENT_CONTAINER_ELEMENT[0].scrollHeight);
});
}
}


function chat_modal_closed() {
/* bugs.txt #5 */
chat_prevent_multiple_calls = true;
setTimeout(function(){
chat_prevent_multiple_calls = false;	
}, 100);

CHAT_CONTENT_CONTAINER_ELEMENT.hide();
$("#recipient_name").hide();
$("#recipient_current_status").hide();
stop_pinging_for_user_status();
}



$(document).on("dom_and_device_ready", function() {

set_chat_constants();

$("#chatModal").data("on_visible", chat_modal_visible);
$("#chatModal").data("on_close", chat_modal_closed);


// we got 284 emojis in our emojis file, we load them all using this loop.
for(var i = 0;i<285;i++) {
$("#emojisContainerChild").append("<img class='emoji' src='icons/emojis/" + i + ".svg' alt='Emoji'/>");
}
 
 


// when a user clicks on the start chat button or the chat icon in the usermodals
$(document).on("click",".startChat",function(e){
	
if((typeof $(this).attr("data-chat-id") == "undefined" || typeof $(this).attr("data-user-id") == "undefined") && typeof $(this).attr("data-from") == "undefined") {
return false;	
}

var unhide_chat_if_hidden;
if($(this).attr("data-from") == "userModal") {
unhide_chat_if_hidden = true;
}
else {
unhide_chat_if_hidden = false;
}

var chat_id;
if(typeof $(this).attr("data-chat-id") != "undefined") {
chat_id = $(this).attr("data-chat-id");	
}

var recipient_id;
if(typeof $(this).attr("data-user-id") != "undefined") {
recipient_id = $(this).attr("data-user-id");
}

open_chat(chat_id, recipient_id, unhide_chat_if_hidden);
});



// on double tapping, toggle .emojisContainer's display.
$(document).on("doubletap","#" + CHAT_CONTENT_CONTAINER_ELEMENT.attr("id"),function(e){	
setTimeout(function(){
$("#emojisContainer").animate({ height: 'show', opacity: 'show' }, 400);
$("#emojisContainerChild").scrollTop(0);	
},50);
});
// hide the .emojisContainer when anything in the #chatModal except itself is clicked.	
$(document).on("click", "#chatModal *", function(event){
if(($(event.target) != $("#emojisContainer") && $(event.target).parents("#emojisContainer").length < 1) || ($(event.target) == $("#emojisContainer .close_emojis_container") || $(event.target).parents("#emojisContainer .close_emojis_container").length > 0)) {	
$("#emojisContainer").animate({ height: 'hide'}, 200);
}
});



// when a user is writing a message we call this, if the message is currently empty, we change the send message button to a send photo button, otherwise we change it to a send mesage button.
$(document).on("keyup",".messageTextarea",function(){

// if the new value of this element is empty, then we want to change our button to a send image button
if($(this).val().trim() == "") {
switchChatModalSendButton(0);	
}
// this means the user is typing in a message, so we need to change our button to a send message button.
else {	
switchChatModalSendButton(1);
}

});


// when the user presses the #chatModal's send message button.
$(document).on("click","#sendMessage",function(){

// if the user wants to send an image
if($(this).attr("data-file-or-send") == "0") {
$("#sendImage").click();
return;	
}
// user wants to send a text message
else {
switchChatModalSendButton(0);
sendTextMessage($("#sendMessage").attr("data-chat-id"), $(".messageTextarea").val(), null);
$(".messageTextarea").val("");	
}

});

// user wants to send an emoji
$(document).on("click",".emoji",function(e){	
$("#emojisContainer").fadeOut();
sendMessage($("#sendMessage").attr("data-chat-id"), $(this).attr("src"), "emoji-message", null);
});

// when users want to send files (images).
$(document).on("change","#sendImage",function(){
sendImage(function(data){
// if there were any errors	
if(data[1] != "0") {	
Materialize.toast(data[1], 6000, "red");	
}
});
});

// user wants to open an image-message in fullscreen
$(document).on("click",".fileMessageContainer",function(){
openFullScreenFileView($(this).find("img").attr("src"));
});


var message_touchdown_timeout; 
var this_message;
$(document).on("touchstart", ".message", function(){
this_message = $(this);	
message_touchdown_timeout = setTimeout(function(){
this_message.css("opacity", ".6");
this_message.parents(".messageContainer").find(".messageDate").css("display", "inline-block");		
}, 200);	
}).on("touchmove", ".message", function(){
clearTimeout(message_touchdown_timeout);	
this_message.css("opacity", "1");
this_message.parents(".messageContainer").find(".messageDate").css("display", "none");	
}).on("touchend", ".message", function(){
clearTimeout(message_touchdown_timeout);	
this_message.css("opacity", "1");
this_message.parents(".messageContainer").find(".messageDate").css("display", "none");		
});




var file_message_touchdown_timeout;
var this_message;
$(document).on("touchstart", ".fileMessageContainer", function(){
this_message = $(this);	
file_message_touchdown_timeout = setTimeout(function(){
this_message.css("filter", "brightness(50%)");
this_message.parents(".messageContainer").find(".messageDate").css("display", "inline-block");		
}, 200);	
}).on("touchmove", ".message", function(){
clearTimeout(file_message_touchdown_timeout);	
this_message.css("filter", "brightness(100%)");
this_message.parents(".messageContainer").find(".messageDate").css("display", "none");			
}).on("touchend", ".fileMessageContainer", function(){
clearTimeout(file_message_touchdown_timeout);	
this_message.css("filter", "brightness(100%)");
this_message.parents(".messageContainer").find(".messageDate").css("display", "none");		
});




	
});
