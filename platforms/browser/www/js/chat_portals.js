

// will be set on document-ready 
var CHAT_PORTALS_CONTAINER_ELEMENT;
var CHAT_PORTALS_EMPTY_NOW_MESSAGE = "No chats started :(";



var chat_portals_prevent_multiple_calls = false;;

//this takes care of showing the chat portals
function getChatPortals(row_offset, callback) {	
	
if(typeof row_offset == "undefined") {
return false;	
}	
	
if(chat_portals_prevent_multiple_calls === false) {	
chat_portals_prevent_multiple_calls = true;	
	
$.get({
url:"http://192.168.1.100/golum/components/chat_portal.php",
data: {
"row_offset": row_offset	
},
type:"get",
success: function(data) {
if(data != "" && typeof callback == "function") {
var data_arr = JSON.parse(data);			
callback(data_arr);
}	
	
chat_portals_prevent_multiple_calls = false;	
}
});

}

}


function get_chat_portals_callback(data, empty_now_message, callback) {
																
if(data[0].length < 1 && CHAT_PORTALS_CONTAINER_ELEMENT.find(".singleChatPortal").length < 1) {
CHAT_PORTALS_CONTAINER_ELEMENT.html("<div class='emptyNowPlaceholder'><i class='material-icons'>info</i><br>" + empty_now_message + "</div>");	
}	
else if(data[0].length < 1) {
CHAT_PORTALS_CONTAINER_ELEMENT.append(get_end_of_results_mark_up("End of results"));		
CHAT_PORTALS_CONTAINER_ELEMENT.attr("data-end-of-results", "true");	
}
		
for(var i = 0; i < data[0].length; i++) {
CHAT_PORTALS_CONTAINER_ELEMENT.append(get_chat_portal_markup(data[0][i]));	
}

getChatPortalActivities(updateChatPortalActivities);

if(typeof callback == "function") {
callback();
}
}




function get_chat_portal_markup(data) {

var random_num = Math.floor(Math.random() * 1000000);

return `
<div class='singleChatPortal startChat row list_row modal-trigger' id='chatPortalTo` + data["recipient_info"]["id"] + `' data-target='chatModal' data-from='chatPortals' data-chat-id='`+ data["id"] +`' data-user-id='`+ data["recipient_info"]["id"] +`'>

<div class='col l1 m1 s3 singleChatPortalAvatarCol'>
<a href='#' class='removeChat'><i class='material-icons'>close</i></a>
<div class='singleChatPortalAvatarContainer modal-trigger showUserModal opacityChangeOnActive stopPropagationOnClick' data-target='user_modal' data-user-id='`+ data["recipient_info"]["id"] +`'>
<div class='singleChatPortalRotateContainer rotateContainer' style='margin-top:`+ data["recipient_info"]["avatar_positions"][0] +`%;margin-left:`+ data["recipient_info"]["avatar_positions"][1] +`%;'>
<div class='singleChatPortalRotateDiv'>
<img class='avatarImages' id='chat_portal_avatar` + random_num + `' src='` + (data["recipient_info"]["avatar"] != "" ? data["recipient_info"]["avatar"] : LetterAvatar(data["recipient_info"]["first_name"] , 60) ) + `' alt='Avatar'/>
</div>
</div>
</div><!-- end .contactsAvatarContainer -->
</div><!-- end .contactsAvatarRow -->


<div class='col l11 m11 s9 list_row_center_container'>
<div class='chatPortalInfosContainerChild'>
<div class='chatPortalFullName'>`+ data["recipient_info"]["first_name"] + ` ` + data["recipient_info"]["last_name"] +`<span class='custom_badge'></span></div>
<div class='chatPortalMessagePreview'></div>
</div>
</div><!-- end .chatPortalInfosContainer -->
<div class='latestMessageContainer'>
</div>
</div><!-- end .singleChatPortal -->
<script>

	$('#chat_portal_avatar` + random_num + `').on('load',function(){
		$(this).parent().css('transform','rotate(\"` + (data["recipient_info"]["rotate_degree"] != "" ? data["recipient_info"]["rotate_degree"] : 0) + ` + deg\")');
		fitToParent($(this));
		adaptRotateWithMargin($(this), ` + (data["recipient_info"]["rotate_degree"] != "" ? data["recipient_info"]["rotate_degree"] : 0) + `,false);
	});
	
</script>`;
}




function updateChatPortalActivities(chatPortalActivities) {
	
for(var i = 0;i<chatPortalActivities.length;i++) {

var elem = $(".singleChatPortal[data-chat-id='" + chatPortalActivities[i]["chatId"] + "']");

// if current row has any new messages.
if(chatPortalActivities[i]["newMessagesNum"] > 0) {
//show the number of new messages for that row using a .custom_badge
elem.find(".custom_badge").html(chatPortalActivities[i]["newMessagesNum"]).css("display", "inline-block");
}
// if current row has no new messages 
else {	
elem.find(".custom_badge").html(chatPortalActivities[i]["newMessagesNum"]).hide();
}

elem.find(".chatPortalMessagePreview").html(chatPortalActivities[i]["latestMessage"]);
elem.find(".latestMessageContainer").html(chatPortalActivities[i]["latestMessageDate"]);
}

}


// takes care of updating the chat portal.
function getChatPortalActivities(callback) {

$.get({
url:"http://192.168.1.100/golum/components/chat_portal_activities.php",
success:function(data) {
	
if(data != "") {

var dataArr = JSON.parse(data);	

var chatPortalActivities = [];	

for(var i = 0;i<dataArr.length;i++) {
chatPortalActivities.push({"chatId":dataArr[i][0],"newMessagesNum":dataArr[i][1],"latestMessage":dataArr[i][2],"latestMessageDate":dataArr[i][3]});	
}

// if the callback function has a parameter that we can pass our array to.
if(callback.length > 0) {
callback(chatPortalActivities);
}

}

}	
});

}


function hideChat(chatId,callback) {
	
$.post({
url:"http://192.168.1.100/golum/components/hide_chat.php",
data:{"chat_id":chatId},
success:function(data) {

// chat was successfully hidden
if(data == "1")	{
callback();	
}
	
}
});

}

function get_new_messages_num(callback) {
	
if(typeof callback !== "function") {
return false;	
}	
	
$.get({
url: "http://192.168.1.100/golum/components/get_new_messages_num.php",
success:function(data) {
var data_arr = JSON.parse(data);
callback(data_arr[0]);
}	
});
	
}





$(document).ready(function(){

CHAT_PORTALS_CONTAINER_ELEMENT = $("#chat_portals_modal .modal-content");

// when the user wants to go to their messages section (chat portals)
$(document).on("click",".get_chat_portals",function(){	
CHAT_PORTALS_CONTAINER_ELEMENT.html("");
CHAT_PORTALS_CONTAINER_ELEMENT.attr("data-end-of-results", "false");
showLoading(CHAT_PORTALS_CONTAINER_ELEMENT, "50%");
getChatPortals(0, function(data){
get_chat_portals_callback(data, CHAT_PORTALS_EMPTY_NOW_MESSAGE, function(){
removeLoading(CHAT_PORTALS_CONTAINER_ELEMENT);		
});
});	
});
// user is infinite scrolling their chat portals 
CHAT_PORTALS_CONTAINER_ELEMENT.scroll(function(){
if($(this).attr("data-end-of-results") === "false") {	
if($(this)[0].scrollHeight - ($(this).scrollTop() + $(this).outerHeight()) < 100) {
add_secondary_loading(CHAT_PORTALS_CONTAINER_ELEMENT);	
getChatPortals(CHAT_PORTALS_CONTAINER_ELEMENT.find(".singleChatPortal").length, function(data){
get_chat_portals_callback(data, CHAT_PORTALS_EMPTY_NOW_MESSAGE, function(){
remove_secondary_loading(CHAT_PORTALS_CONTAINER_ELEMENT);		
});
});
}
}
});



// takes care of showing the remove chat buttons on long pressing.
var removeChatToggleTimeout;
var chatPortalId;
$(document).on("touchstart",".singleChatPortal",function(){
chatPortalId = $(this).attr("id");	
removeChatToggleTimeout = setTimeout(function(){
$(".singleChatPortal[id!=" + chatPortalId + "]").find(".removeChat").fadeOut("fast");	
$(".singleChatPortal[id!=" + chatPortalId + "]").find(".singleChatPortalAvatarContainer").fadeIn("fast");	
$("#" + chatPortalId).find(".singleChatPortalAvatarContainer").fadeToggle("fast");
$("#" + chatPortalId).find(".removeChat").fadeToggle("fast");
},1200);
});
$(document).on("touchend touchmove",".singleChatPortal",function(){
clearTimeout(removeChatToggleTimeout);	
});

// when a user presses the remove chat button.
$(document).on("click",".removeChat",function(e){
e.stopPropagation();	

hideChat($(this).parents(".singleChatPortal").attr("data-chat-id"),function(){Materialize.toast("You Can Unhide a Chat By Tapping The 'Start Chat' Button In a User's Profile.",6000);});

$(this).parents(".singleChatPortal").fadeOut("fast","linear",function(){
$(this).remove();	
});

});



	
});