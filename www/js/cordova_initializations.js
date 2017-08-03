

function on_device_ready() {	
// Register the event listener
document.addEventListener("backbutton", on_back_key_pressed, false);
document.addEventListener("offline", handle_offline, false);	
document.addEventListener("online", handle_online, false);	
$(document).on("click", "#google_login", google_login);
handle_keyboard_overlaps_if_android();
handle_push_notifications();
}
		 	 	

$(document).on("dom_and_device_ready", function(){
on_device_ready();
});
