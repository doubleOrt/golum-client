
var websockets_con;
var websockets_connection_is_good = false;
var WEBSOCKET_SERVER_URL = 'ws://192.168.1.100:8080';
var RECONNECT_TO_WEBSOCKET_ON_CLOSE_TIMEOUT = 5000;
var PING_SERVER_TIMEOUT = 2000;


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


/* without this variable, everytime we closed the websocket connection 
it would be reopened, this is a great thing that we want to occur in 
normal situations, but not when the user tries to open a websocket 
connection when it is already opened (else there would be duplicates). */
execute_code_in_websocket_connection_closed_function = true;
/* if we don't do this, there will be duplicate connections hanging there, 
so each time there is a message, it will be sent to both connections. */
if(websockets_connection_is_good !== false) {
execute_code_in_websocket_connection_closed_function = false;
websockets_con.close();	
/* we cannot set execute_code_in_websocket_connection_closed_function to 
true right away because the close function is not called right away it 
appears, so we set it to true inside the .close() function. */
}
		
websockets_con = new ab.Session(WEBSOCKET_SERVER_URL,
function() {
console.warn("Websocket connection opened");	
websockets_connection_is_good = true;
open_user_channel(base_user_id);
/* registers to push notifications and uses our newly 
established websocket connection to send the registration 
id to the server-side so that the user can be sent push 
notifications. */
handle_push_notifications();
start_pinging_server(base_user_id);
},
function() {
if(execute_code_in_websocket_connection_closed_function === true) {
console.warn('WebSocket connection closed');
websockets_connection_is_good = false;
setTimeout(function(){
open_web_socket_connection(base_user_id);	
}, RECONNECT_TO_WEBSOCKET_ON_CLOSE_TIMEOUT);
}
else {
execute_code_in_websocket_connection_closed_function = true;	
}
},
{'skipSubprotocolCheck': true}
);
}

function open_user_channel(user_id) {
if(websockets_connection_is_good === true && /^\d+$/.test(user_id) === true) {
websockets_con.subscribe('user_' + user_id, handle_user_channel_message);
}	
}


/* this whole thing takes care of pinging the server so that 
our websocket server can determine whether or not a connection 
still exists. And all this is because Ratchet's onClose event 
does not get called when a user's connection changes (e.g they 
go from online to offline), so we have to implement the 
architecture ourselves. */
var server_pinging_interval;
var last_ping_time = 0;
function start_pinging_server(user_id) {
				
if(websockets_connection_is_good !== true || typeof user_id === "undefined") {
return false;	
}

/* just in case we call this function when an interval is 
already set, we don't want to end up with multiple intervals.*/
if(typeof server_pinging_interval !== "undefined") {
clearInterval(server_pinging_interval);	
server_pinging_interval = undefined;
}	

if(last_ping_time != 0) {
last_ping_time = 0;	
}

server_pinging_interval = setInterval(function(){
if(websockets_connection_is_good === true) {	
var current_time = new Date().getTime();	
if((current_time - last_ping_time) < (PING_SERVER_TIMEOUT + 1000) || last_ping_time === 0) {
websockets_con.publish("user_" + user_id, [2]);
}
}
else {
clearInterval(server_pinging_interval);
server_pinging_interval = undefined;	
}
last_ping_time = new Date().getTime();
}, PING_SERVER_TIMEOUT);

}


