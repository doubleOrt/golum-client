


  

/* (make-sure-android-keyboard-is-not-overlapping-focused-input)-related */

function handle_keyboard_overlaps_if_android() {
	
try {	
/* make sure the device is actually an Android device before attaching the 
make-sure-android-keyboard-is-not-overlapping-focused-input events, since the 
keyboard-overlapping issue seems to be Android-specific. */
if(device.platform == "Android") {	
window.addEventListener('native.keyboardshow', keyboard_show_handler);
window.addEventListener('native.keyboardhide', keyboard_hide_handler);	

/* this handles a case where a user has focused in an input, and then immediately, 
without focusing out that input (therefore closing the keyboard as well), focuses 
in another input, in which case, our keyboard_show_handler() method won't be called, 
which means the newly focused in input may be partly out of view. */
$(document).on("focus", "input, textarea, div[contenteditable='true']", function(){
if(cordova.plugins.Keyboard.isVisible === true) {
if(typeof last_opened_keyboard_height != "undefined") {	
show_input_if_out_of_view($(this), last_opened_keyboard_height);
}
}	
});
}
}
catch(error) {
console.warn("Something went wrong - Probably related to the loading of the Cordova Keyboard plugin.");	
}

}

var last_opened_keyboard_height;
function keyboard_show_handler(e){
show_input_if_out_of_view($(document.activeElement), e.keyboardHeight);
last_opened_keyboard_height = e.keyboardHeight;	
}

function keyboard_hide_handler() {
/* whenever the keyboard gets hidden, we need to revert whatever modifications we made 
to make the focused input in-view and not out-of-view. */	
if(typeof last_translate_target != "undefined" && typeof last_translate_target.data("old_translate_value") != "undefined") {
last_translate_target.each(function(){
this.style.setProperty("transform", last_translate_target.data("old_translate_value"), "important");		
});
last_translate_target.removeData("old_translate_value");
}	
}

/* ensures that any input that is focused in is visible to the user and not out of view (overlapped by the keyboard). */
var last_translate_target;
function show_input_if_out_of_view(target, keyboard_height) {

var document_height = $(document).height();
var target_height = target.outerHeight();
var target_offset_top = target.offset().top;

// check if the focused input is being overlapped by the keyboard
if((target_offset_top + target_height) > (document_height - keyboard_height)) {
	
// These conditionals give us the element we want to translate.
// translate_target should be non-fullscreen .modal:
if(target.parents(".modal").length > 0 && target.parents(".fullScreenModal").length < 1) {	
var translate_target = target.parents(".modal");	
}
// translate_target should be .fullScreenModal
else if(target.parents(".fullScreenModal").length > 0) {
var translate_target = target.parents(".modal-content");	
}
// translate_target should be .main_screen_child
else if(target.parents(".main_screen_child").length > 0){
var translate_target = target.parents(".main_screen_child");	
}
// translate_target should be #megaContainer
else if(target.parents("#megaContainer").length > 0){
var translate_target = target.parents("#megaContainer");		
}
else {
console.warn("No translate-target elements found in the ancestor tree of the currently focused element!");	
return false;
}

// just make sure that the translate_target element exists
if(translate_target.length > 0) {
translate_target.data("old_translate_value", translate_target.css("transform"));	
var new_translate_value = (target_offset_top - (($(document).height() - keyboard_height) - target_height)) * -1;	

/* get the translateY value of the element if it exists and add it 
to the new_translate_value. Because if the translate_target already 
has a translateY, and we merely overwrite it with the new_translate_value, 
then the input's position will be wrong, meaning that this whole function 
would be useless, to fix that, we merge the new_translate_value with the 
current translateY of the element, if it exists. */
var transformMatrix = translate_target.css("-webkit-transform") ||
translate_target.css("-moz-transform")    ||
translate_target.css("-ms-transform")     ||
translate_target.css("-o-transform")      ||
translate_target.css("transform");
var matrix = transformMatrix.replace(/[^0-9\-.,]/g, '').split(',');
var y = parseFloat(matrix[13]) || parseFloat(matrix[5]);//translate y
// check if the element does have a translateY property
if(!isNaN(y) && y != 0) {
new_translate_value += y;	
}

/* we are saying "translate_target.each(function....." because otherwise JQuery 
would not understand "!important", but this way, it does understand the "important". */
translate_target.each(function(){
this.style.setProperty("transform", "translate(0, " + new_translate_value + "px)", "important");	
});
last_translate_target = translate_target;
}
}


}


/* end (make-sure-android-keyboard-is-not-overlapping-focused-input)-related */



