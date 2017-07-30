


/* to use Cordova plugins, we have to wait until the "deviceready" event is called, 
the following lines take care of that. */

window.addEventListener("load", attach_device_ready_event,false);

function attach_device_ready_event() {
document.addEventListener("deviceready", on_device_ready, false);
}

function on_device_ready() {	
// Register the event listener
document.addEventListener("backbutton", on_back_key_pressed, false);
$(document).on("click", "#google_login", google_login);
handle_keyboard_overlaps_if_android();
handle_push_notifications();
}

/* end Cordova related */
		 	 