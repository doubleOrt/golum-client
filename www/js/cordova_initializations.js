
function on_device_ready() {	
// Register the event listener
document.addEventListener("backbutton", on_back_key_pressed, false);
handle_online();
document.addEventListener("online", handle_online, false);	
document.addEventListener("offline", handle_offline, false);	
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
