

/* this function takes care of adding back-button functionality to the app. */
function on_back_key_pressed() {

if(openedModals.length > 0) {
var modal_id = openedModals[openedModals.length - 1];	
if($("#" + modal_id).hasClass("dismissible_false")) {
return false;	
}		
closeModal(modal_id, function(){
/* See bugs.txt: bug 2 */	
if($(".modal.open").length < 1 && PROFILE_CONTAINER_ELEMENT.parents("#main_screen_user_profile").length < 1 && $("#bottom_nav_user_profile").hasClass("active")) {
$("#bottomNav #bottom_nav_user_profile").click();	
}
});
}
else {
if(confirm("Do you want to exit ?") == true) {
navigator.app.exitApp();	
}
}	

}



