


function logOut() {

var base_user_id = BASE_USER_ID_HOLDER.attr("data-user-id");
var device_registration_id = DEVICE_REGISTRATION_ID_HOLDER.attr("data-device-registration-id");
if(websockets_connection_is_good === true && typeof base_user_id != "undefined" && typeof device_registration_id != "undefined" && /^\d+$/.test(base_user_id)) {
// we need to do this so that the user does not get notifications after they log out.
websockets_con.publish("user_" + base_user_id, [1, 1, device_registration_id]);		
}

// when user presses the logout button 
$.get({
url:PATH_TO_SERVER_PHP_FILES + "logout.php",
success:function(data) {
window.location.href = "index.html";
}	
});

}	


$(document).on("dom_and_device_ready", function() {
	 
// call the logOut() function whenever the user clicks something with the .log_out class.
$(document).on("click",".log_out",function(){
logOut();
});

});