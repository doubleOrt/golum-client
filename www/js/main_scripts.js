// will be set on document load. This element will contain a "data-user-id" attribute that points to the id of the logged_in user.
var BASE_USER_ID_HOLDER;

$(document).on("dom_and_device_ready", function() {
		
BASE_USER_ID_HOLDER = $("#megaContainer");	

// we got 284 emojis in our emojis file, we need to append them all to our emojisContainerChild element.
for(var i = 0;i<285;i++) {
$("#emojisContainerChild").append("<img class='emoji' src='icons/emojis/" + i + ".svg' alt='Emoji' style='width:55px;height:55px;'/>");
}
 
 
 

// we want all images on our app to be not draggable.
$("img").on("dragstart",function(e){
e.preventDefault();
});



// whenever this element is clicked, we want to hide it.
$(document).on("click","#fullScreenFileView",function(){
closeFullScreenFileView();
});



$(document).on("click",".stopPropagationOnClick",function(event){
event.stopPropagation();	
});




// materialize initialize the select elements
$('select').material_select();


//initialize tabs
 $(".tabs").tabs();







$(".baseUserAvatarRotateDivs").each(function(){
//we are adding this because of pages where this script page is included but the page isn't a page where the user has logged in, otherwise there would be a userAvatarImageRotateDegree is not defined error.
if(typeof $(this).attr("data-rotate-degree") == "undefined") {
return false;
}
$(this).parent().css("transform","rotate(" + $(this).attr("data-rotate-degree") + "deg)");	
fitToParent("#" + $(this).attr("id"));
adaptRotateWithMargin($(this).find("img"),$(this).attr("data-rotate-degree"),false);
});








// a mini library for showing things when an element is clicked
$(document).on("click",".onclickShow",function(){	
var onclickShowElement = $(this);
var elemsArr = $(this).attr("data-onclick-show").split(",");
if(typeof $(this).attr("data-onclick-changeThis") != "undefined") {
var changeThisHtmlArr = $(this).attr("data-onclick-changeThis").split(",");	
} 
for(var i = 0;i<elemsArr.length;i++) {
if($(elemsArr[i]).is(":visible")) {
onclickShowElement.css("pointer-events","none");		
$(elemsArr[i]).fadeOut("fast",function(){
onclickShowElement.css("pointer-events","auto");	
});	
if(typeof changeThisHtmlArr != "undefined") {
$(this).html(changeThisHtmlArr[i]);	
}
}	
else {
$(elemsArr[i]).css("display","block");	
}
}
});





/* ----- post activities ----- */


/* this is used to delete posts */
$(document).on("click",".deletePost",function() {

if(typeof $(this).attr("data-actual-post-id") == "undefined") {
return false;	
}

var thisSinglePostObject = $(this).parents(".singlePost");

deletePost($(this).attr("data-actual-post-id"),function() {
Materialize.toast('Post Deleted!',3000,'red');
thisSinglePostObject.fadeOut('fast',function(){$(this).remove();});
});

});


/* when a user wants to report a post */

$(document).on("click",".reportPost",function(){
reportPost($(this).attr("data-actual-post-id"));
});





var openFullScreenFileViewTimeout;
var postSingleImageContainerObject;
var doubleClicked = false;

// when user's want to open a post's files in fullscreen
$(document).on("click",".postSingleImageContainer",function(){
if(doubleClicked == false) {
postSingleImageContainerObject = $(this);	
openFullScreenFileViewTimeout = setTimeout(function(){openFullScreenFileView(postSingleImageContainerObject.attr("data-image-path"));},300);
}
});

// when the user votes
$(document).on("doubletap",".postSingleImageContainer",function(event){
	
doubleClicked = true;	
clearTimeout(openFullScreenFileViewTimeout);
setTimeout(function(){doubleClicked = false;},600);

var thisSinglePostObject = $(this).parents(".singlePost");
var voteOptionIndex = $(this).attr("data-option-index");

if(thisSinglePostObject.find(".vote_holder .totalVotesNumber[data-user-vote='true']").parents(".vote_holder").attr("data-option-index") == voteOptionIndex) {
return false;	
}	

// show the votes for this post.	
showNewPostVotes(thisSinglePostObject,voteOptionIndex);	
reactToVote(thisSinglePostObject, event.pageX, event.pageY);
postVote(thisSinglePostObject,voteOptionIndex);
thisSinglePostObject.find(".post_images_container_bottom_overlay").animate({"height": "100%"}, 200);
});


/* ----- END post activities ----- */







// these two are used mainly by input elements so that when they are focused they don't look messy (because when they are focused the keyboard becomes visible which causes everything to resize)
$(document).on("focus","[data-onfocus-toggle]",function(){
$($(this).attr("data-onfocus-toggle")).hide();
});
$(document).on("focusout","[data-onfocus-toggle]",function(){
$($(this).attr("data-onfocus-toggle")).fadeIn();
});



/* main screens and their relation to the #bottomNav */

$(document).on("click", "[data-open-main-screen]" , function() {
open_main_screen($($(this).attr("data-open-main-screen")));
});


var non_activatable_item_class_name = "bottom_nav_static_item";
$(document).on("click",".bottomTabsItem",function(){
if(!$(this).hasClass(non_activatable_item_class_name)) { 	
$(".bottomTabsItem").removeClass("active");
$(this).addClass("active");
}
});
$(document).on("touchstart",".bottomTabsItem",function(){
$(this).addClass("bottomTabsItemActiveColor");
});
$(document).on("touchend",".bottomTabsItem",function(){
$(this).removeClass("bottomTabsItemActiveColor");
});






/* this whole thing is so that rows don't change their background color due to event 
bubblings that would be outside of our control if we didn't implement the active things 
with the following snippet (e.g "follow +" button would be clicked, and the event would 
bubble to the row, which would then be :active-ed, there seemed to be no way around 
that, event.stopPropagation() did not work, and there was no css way to do it) */
var add_active_class_to_this_row_timeout;
var this_row;
$(document).on("touchstart", ".dont_change_parent_background_when_clicked_parent", function(event){
if(!$(event.target).hasClass("dont_change_parent_background_when_clicked") && $(event.target).parents(".dont_change_parent_background_when_clicked").length < 1) {
this_row = $(this);	
add_active_class_to_this_row_timeout = setTimeout(function(){
this_row.addClass("lightgrey_background_on_active");	
}, 200);
}
}).on("touchend", function(){
if(typeof this_row != "undefined") {	
this_row.removeClass("lightgrey_background_on_active");	
}
});








});

