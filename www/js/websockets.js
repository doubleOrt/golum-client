
var websockets_con;
var websockets_connection_is_good = false;


var websocket_request_id = 0;
var handle_user_channel_message_callbacks = [];
function handle_user_channel_message(topic, data) {
	
var data_arr = JSON.parse(data);	
	
if(typeof data_arr["type"] == "undefined") {
return false;
}

if(data_arr["type"] == "0") {
for(var i = 0; i < handle_user_channel_message_callbacks.length; i++) {
if(handle_user_channel_message_callbacks[i]["request_id"] == data_arr["data"]["request_id"]) {
handle_user_channel_message_callbacks[i]["callback"](data_arr["data"]);	
}	
}
}
else if(data_arr["type"] == "1") {
there_are_new_messages(data_arr["data"]);	
}
else if(data_arr["type"] == "2") {
there_are_new_notifications(data_arr["data"]);	
}


}


function open_web_socket_connection(base_user_id) {
	
if(typeof base_user_id == "undefined" || /^\d+$/.test(base_user_id) === false) {
return false;	
}	
	
websockets_con = new ab.Session('ws://192.168.1.100:8080',
function() {
console.warn("Websocket connection opened");	
websockets_connection_is_good = true;
open_user_channel(base_user_id);
// this call will send an "online now" message to all users who want to receive it.
websockets_con.publish("user_" + base_user_id, [2,"user_state_" + base_user_id]);	
/* registers to push notifications and uses our newly 
established websocket connection to send the registration 
id to the server-side so that the user can be sent push 
notifications. */
handle_push_notifications();
},
function() {
console.warn('WebSocket connection closed');
websockets_connection_is_good = false;
},
{'skipSubprotocolCheck': true}
);
}

function open_user_channel(user_id) {
if(websockets_connection_is_good === true && /^\d+$/.test(user_id) === true) {
websockets_con.subscribe('user_' + user_id, handle_user_channel_message);
}	
}


