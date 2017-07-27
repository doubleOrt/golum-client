var openedModals = [];

var marks_stack = [];

var z_index_stack = 1001;
var longpollingVar; 

function openModalCustom(modalId, callback) {

/* if modal is currently on top and it is open, then just return false. Useful in cases like 
when the user presses a tag in the tagPostsModal which refers to itself (for example i press the gollum tag when 
i am in the tagPostsModal modal for all posts with the gollum tag, without these conditional, the modal would be 
closed and then re-opened, which is inconsistent. */
if(openedModals.length > 0 && modalId == openedModals[openedModals.length - 1]) {
if(typeof callback == "function") {	
callback();	
}
return false;	
}


var this_modal_modal_overlay;

setTimeout(function(){
$(".modal-overlay").last().attr("data-modal", modalId);
this_modal_modal_overlay = $(".modal-overlay[data-modal='" + modalId + "']");
if($("#" + modalId).hasClass("dismissible_false")) {
var handle_dismissible_false_id = "handle_dismissible_false" + Math.floor(Math.random() * 1000000);	
this_modal_modal_overlay.after("<div id='" + handle_dismissible_false_id + "' style='width:100%;height:100%;position:absolute;top:0;left:0;bottom:0;right:0;background:transparent;z-index:" + this_modal_modal_overlay.css("z-index") +"'></div>");	
$("#" + modalId).attr("data-handle-dismissible-false", handle_dismissible_false_id);
}
},300);

$("#" + modalId).css("opacity", 1);

var is_not_already_opened = true;

for(var i = 0;i<openedModals.length;i++) {
if(openedModals[i] == modalId) {	
$("#" + modalId).attr("data-marked", $("#" + modalId).css("z-index"));
marks_stack.push({"modal_id": "#" + modalId, "z-index": $("#" + modalId).css("z-index"), "state": $("#" + modalId).html()});
$("#" + modalId).hide();
$("#" + modalId).css("z-index", z_index_stack + 4);
$("#" + modalId).fadeIn(300);
var modal_overlay_new_zindex = z_index_stack + 3;
z_index_stack += 4;
is_not_already_opened = false;
break;
}
}


if(is_not_already_opened == true) {	
var modal_overlay_new_zindex = z_index_stack + 1;
var modal_new_zindex = z_index_stack + 2;
$("#" + modalId).hide();
$("#" + modalId).fadeIn(300);
setTimeout(function(){this_modal_modal_overlay.css("z-index", modal_overlay_new_zindex);$("#" + modalId).css("z-index",modal_new_zindex);},300);
} else {
setTimeout(function(){
this_modal_modal_overlay.css("z-index", modal_overlay_new_zindex);
}, 300);	
}




openedModals.push(modalId);
// if a callback has been set for whenever the modal is set to visible, call it.
if(typeof $("#" + openedModals[openedModals.length - 1]).data("on_visible") == "function") {
$("#" + openedModals[openedModals.length - 1]).data("on_visible")(false);
}

/* the callback for this function, note that this is different from the callback 
above in that this one is unique to this function, while the callback defined above
is different for each modal */
if(typeof callback == "function") {	
callback();
}
		
}

function closeModal(modalId, callback) {
		
var this_modal_modal_overlay = $(".modal-overlay[data-modal=" + modalId + "]");

if(typeof $("#" + modalId).attr("data-handle-dismissible-false") != "undefined") {
$("#" + $("#" + modalId).attr("data-handle-dismissible-false")).remove();	
}

for(var i = openedModals.length - 1;i > -1; i--) {
if(openedModals[i] == modalId) {
openedModals.splice(i,1);
break;
}	
}

if(openedModals.length > 0) {
// if a callback has been set for whenever the modal is set to visible, call it.
if(typeof $("#" + openedModals[openedModals.length - 1]).data("on_visible") == "function") {
$("#" + openedModals[openedModals.length - 1]).data("on_visible")(true);
}
} 

// if only one element is remaining from the stack, then remove its data-marked attribute
for(var i = marks_stack.length - 1; i > -1; i--) {
if(marks_stack[i]["modal_id"] == ("#" + modalId)) {	
var zindex = marks_stack[i]["z-index"];
this_modal_modal_overlay.css("z-index", zindex - 1);	
$("#" + modalId).animate({"top": "100%", "opacity": "0"}, 150, function(){
$("#" + modalId).css("opacity", "1");		
$("#" + modalId).css("z-index", zindex);		
$("#" + modalId).show();		
});		

$("#" + modalId).html(marks_stack[marks_stack.length - 1]["state"]);	
if(modalId == "user_modal") {	
// see bug 3 in the bugs.txt file.
my_hotfix_for_bug_3();
}
initialize_all_things_again();
marks_stack.splice(i,1);
if(typeof callback == "function") {	
callback();
}
return;
}	
}



$("#" + modalId).modal('close');

if(typeof callback == "function") {	
callback();
}

}


function check_if_modal_is_currently_being_viewed(modal_id) {
return openedModals[openedModals.length - 1] === modal_id;
}




function initialize_all_things_again() {
		
$('.dropdown-button').dropdown({
inDuration: 300,
outDuration: 225,
constrainWidth: false, // Does not change width of dropdown to that of the activator
hover: true, // Activate on hover
gutter: 0, // Spacing from edge
belowOrigin: false, // Displays dropdown below the button
alignment: 'left', // Displays dropdown with edge aligned to the left of button
stopPropagation: false // Stops event propagation
}
);

// initialize the #birthdate datepicker and preselect it with the user's birthdate. in case you need to make some modifications, go to the documentation for pickadate.js
$('#birthdate').pickadate({
max:-3939,
selectMonths: true,
selectYears: 80,
today: null,
clear: null
});

}




$(document).ready(function(){
	
	
// initialize the modals
$('.modal').modal({
inDuration: 300, // Transition in duration
outDuration: 150, // Transition out duration	
startingTop: "100%",
endingTop: "50%",	
ready:function(){
var this_modal_id = $(this).attr("id");	
setTimeout(function(){
z_index_stack = parseFloat($("#" + this_modal_id).css("z-index"));
},300);
}
});


$(document).on("click",".modal-trigger",function(){
	
// we need to disable the button so the user cannot make multiple calls to openModalCustom
$(this).css("pointer-events","none");
var thisModalTrigger = $(this);	
setTimeout(function(){thisModalTrigger.css("pointer-events","auto");},500);
	
// grab the modal's id
var modalId = ( typeof $(this).attr("data-target") != "undefined" ? $(this).attr("data-target") : $(this).attr("href").substr(1,this.length));

openModalCustom(modalId);
});


$(document).on("click", ".modal-overlay", function(){
	
if($("#" + $(this).attr("data-modal")).hasClass("dismissible_false")) {
return false;	
}	
				
closeModal($(this).attr("data-modal"), function(){
/* See bugs.txt: bug 2 */	
if($(".modal.open").length < 1 && PROFILE_CONTAINER_ELEMENT.parents("#main_screen_user_profile").length < 1 && $("#bottom_nav_user_profile").hasClass("active")) {
$("#bottomNav #bottom_nav_user_profile").click();	
}
});	
});

/* bugs.txt bug-4 */
var click_on_touch_end;
$(document).on("touchstart", ".modalCloseButton", function(){
click_on_touch_end = true;
}).on("touchmove", ".modalCloseButton", function(event){
var mouse_x_pos = event.originalEvent.touches[0].pageX;	
var mouse_y_pos = event.originalEvent.touches[0].pageY;	
var this_x_pos = $(this).offset().left;
var this_y_pos = $(this).offset().top;
var this_width = $(this).innerWidth();
var this_height = $(this).innerHeight();

if(mouse_x_pos > (this_x_pos + this_width) || mouse_y_pos > (this_y_pos + this_height) || mouse_x_pos < this_x_pos || mouse_y_pos < this_y_pos) {
click_on_touch_end = false;	
}
}).on("touchend", ".modalCloseButton", function(){
if(click_on_touch_end == true) {	

closeModal($(this).attr("data-modal"), function(){
/* See bugs.txt: bug 2 */	
if($(".modal.open").length < 1 && PROFILE_CONTAINER_ELEMENT.parents("#main_screen_user_profile").length < 1 && $("#bottom_nav_user_profile").hasClass("active")) {
$("#bottomNav #bottom_nav_user_profile").click();	
}
});

}
});


});

function inViewport($el) {
    var elH = $el.outerHeight(),
        H   = $(window).height(),
        r   = $el[0].getBoundingClientRect(), t=r.top, b=r.bottom;
    return Math.max(0, t>0? Math.min(elH, H-t) : (b<H?b:H));
}