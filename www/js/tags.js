
var USER_TAGS_CONTAINER;

var get_user_tags_prevent_multiple_calls = false;

function get_user_tags(user_id, row_offset, callback) {
		
if(typeof user_id == "undefined" || typeof row_offset == "undefined") {
return false;	
}	


if(get_user_tags_prevent_multiple_calls == false) {
get_user_tags_prevent_multiple_calls = true;

$.get({
url:"http://192.168.1.100/golum/components/get_user_tags.php",
data: {
"user_id": user_id,
"row_offset": row_offset	
},
success: function(data) {
console.log(data);	
var data_arr = JSON.parse(data);
if(typeof callback == "function") {
callback(data_arr);	
}	
get_user_tags_prevent_multiple_calls = false;
}
});

}
	
}



function get_user_tags_callback(data, callback) {

// if the user is not infinite scrolling and there have been no results, add a placeholder div to tell the user there have been no results.
if( data.length < 1 && USER_TAGS_CONTAINER.find(".list_row").length < 1) {
USER_TAGS_CONTAINER.html("<div class='emptyNowPlaceholder'><i class='material-icons'>error</i><br>This loser is not following a single tag :(</div>");
} 
else if(data.length < 1) {
USER_TAGS_CONTAINER.attr("data-end-of-results", "true");
USER_TAGS_CONTAINER.append(get_end_of_results_mark_up());	
}

for(var i = 0;i < data.length; i++) {
USER_TAGS_CONTAINER.append(
generate_tag_row_mark_up( 
data[i]["tag"], 
data[i]["total_posts"], 
data[i]["total_followers"],
data[i]["sample_image_path"]
)
);
}
	
if(typeof callback == "function") {
callback();	
}	
	
}



function addTagsToUserById(tag,callback) {

$.post({
data:{"tag":tag},	
url:"http://192.168.1.100/golum/components/add_tags.php",
success:function(data) {
callback(data);
}
});

}

function removeTagsFromUserById(tag,callback) {

$.post({
data:{"tag":tag},	
url:"http://192.168.1.100/golum/components/remove_tags.php",
success:function(data) {
callback(data);
}
});

}


function generate_tag_row_mark_up(tag, total_posts, total_followers, sample_image_path, current_state) {

return `<div class='row tag_row list_row getTagPosts modal-trigger dont_change_parent_background_when_clicked_parent' data-tag='` + tag + `' data-target='tagPostsModal'>

<div class='col l1 m1 s3 tag_sample_image_container opacityChangeOnActive stopPropagationOnClick'>
<div class='tag_sample_image row_list_left_child fadeIn dont_change_parent_background_when_clicked' style='background:url(\"` + sample_image_path + `\"); background-size:cover; background-position:center;'>
</div>
</div>

<div class='col l11 m11 s9 list_row_center_container'>
<div class='col l9 m9 s7 row_infos_container'>
<div class='row_names_container'>
<div class='row_name tag_name flow-text fadeIn opacityChangeOnActive'>` + tag + `</div>
<div class='row_secondary_text tag_row_secondary_text flow-text fadeIn'>` + total_followers + (total_followers != 1 ? " Followers" : " Follower") + `</div>
<div class='row_secondary_text tag_row_secondary_text flow-text fadeIn'>` + total_posts + (total_posts != 1 ? " Posts" : " Post") + `</div>
</div>
</div>

<div class='col l3 m3 s5 list_row_right_container skewScaleItem'>
` + (typeof current_state != "undefined" ? (`<a href='#' class='row_button myBackground opacityChangeOnActive addTagFromTagPostsModal stopPropagationOnClick dont_change_parent_background_when_clicked' data-tag='` + tag + `' data-current-state='` + current_state + `'>` + (current_state == 0 ? "Follow +" : "Unfollow") + `</a>`) : "") + `
</div>

</div>

</div><!-- end .list_row -->`;
}



$(document).ready(function(){
	
USER_TAGS_CONTAINER = $("#user_tags_modal_content_child");
	
	
/* when users want to see the tags that another user or they are following */	
$(document).on("click", ".get_user_tags", function(){

if(typeof $(this).attr("data-user-id") == "undefined") {
return false;	
}
	
USER_TAGS_CONTAINER.html("");	
USER_TAGS_CONTAINER.attr("data-user-id", $(this).attr("data-user-id"));	
USER_TAGS_CONTAINER.attr("data-end-of-results", "false");

showLoading(USER_TAGS_CONTAINER, "50%");
	
get_user_tags($(this).attr("data-user-id"), 0, function(data){
get_user_tags_callback(data, function(){
removeLoading(USER_TAGS_CONTAINER);	
}); 
});	
});
// infinite scrolling the tags followed by a user
USER_TAGS_CONTAINER.scroll(function(){
if($(this).attr("data-end-of-results") === "false") {	
if(($(this)[0].scrollHeight - ($(this).scrollTop() + $(this).outerHeight()) == 0) && $(this).find(".list_row").length > 0) {
add_secondary_loading(USER_TAGS_CONTAINER);	
get_user_tags(USER_TAGS_CONTAINER.attr("data-user-id"), USER_TAGS_CONTAINER.find(".list_row").length, function(data){
get_user_tags_callback(data, function(){
remove_secondary_loading(USER_TAGS_CONTAINER);	
});
});	
}
}
});
	
	
	
	
	

// when users want to follow or unfollow tags

$(document).on("click",".addTagFromTagPostsModal",function(){
	
var tag = $(this).attr("data-tag").toLowerCase();	
var this_tag_buttons = $(".addTagFromTagPostsModal[data-tag='" + tag + "']");	
this_tag_buttons.addClass("disabledButton");	

if($(this).attr("data-current-state") == "0") {	
addTagsToUserById(tag,function(){
// if the base user's profile is open, then we need to update its "tags" counter. else we just do nothing 	
if(PROFILE_CONTAINER_ELEMENT.attr("data-is-base-user") == "1") {
set_user_profile_tags_num(get_user_profile_tags_num() + 1);	
}	
this_tag_buttons.removeClass("disabledButton");
this_tag_buttons.attr("data-current-state","1");
this_tag_buttons.html("Unfollow");
});	

}
else {	
removeTagsFromUserById(tag,function(){
// if the base user's profile is open, then we need to update its "tags" counter. else we just do nothing 	
if(PROFILE_CONTAINER_ELEMENT.attr("data-is-base-user") == "1") {
set_user_profile_tags_num(get_user_profile_tags_num() - 1);	
}		
this_tag_buttons.removeClass("disabledButton");	
this_tag_buttons.attr("data-current-state","0");	
this_tag_buttons.html("Follow +");
});		

}

});	
	
	
});