/* this is the element that you want to be used to contain the search results, this one is also the one that should be scrolled, 
since we are capturing infinite scrolling on this element.	
the element won't exist until the document is ready, so we set this variable to the actual contianer of the elements then.	*/
var SEARCH_USERS_RESULTS_CONTAINER;
var SEARCH_TAGS_RESULTS_CONTAINER;
var SEARCH_BOX;
var SEARCH_TABS_STATE_HOLDER;


var prevent_multiple_calls_to_search_for_user = false;	
var prevent_multiple_calls_to_search_for_tag = false;	


function search_section_tabs_changed() {

var active_tab = SEARCH_TABS_STATE_HOLDER.attr("data-active-tab");

SEARCH_USERS_RESULTS_CONTAINER.attr("data-end-of-results", "false");
SEARCH_TAGS_RESULTS_CONTAINER.attr("data-end-of-results", "false");

// user switched to the PEOPLE tab
if(active_tab == "0") {
SEARCH_TAGS_RESULTS_CONTAINER.hide();
SEARCH_USERS_RESULTS_CONTAINER.show();
}
// user switched to the TAGS tab
else if(active_tab == "1"){
SEARCH_USERS_RESULTS_CONTAINER.hide();	
SEARCH_TAGS_RESULTS_CONTAINER.show();
}

// if the search box is currently empty, we just have to toggle the tab divs.
if(SEARCH_BOX.val().trim() != "") {

if(active_tab == "0") {
// empty the SEARCH_USERS_RESULTS_CONTAINER of the last search's markup
SEARCH_USERS_RESULTS_CONTAINER.html("");
showLoading(SEARCH_USERS_RESULTS_CONTAINER, "55%");
search_for_user(SEARCH_BOX.val() , 0 , function(data) {
search_for_user_callback(data, function(){
removeLoading(SEARCH_USERS_RESULTS_CONTAINER);
})
});
}
else if(active_tab == "1") {
// empty the SEARCH_TAGS_RESULTS_CONTAINER of the last search's markup	
SEARCH_TAGS_RESULTS_CONTAINER.html("");
showLoading(SEARCH_TAGS_RESULTS_CONTAINER, "55%");
search_for_tag(SEARCH_BOX.val() , 0 , function(data) {
search_for_tag_callback(data, function(){
removeLoading(SEARCH_TAGS_RESULTS_CONTAINER);
})
});	
}

}

}






$(document).ready(function() {
	
SEARCH_USERS_RESULTS_CONTAINER = $("#search_users_results_column");	
SEARCH_TAGS_RESULTS_CONTAINER = $("#search_tags_results_column");	
SEARCH_BOX = $("#searchForUser");
SEARCH_TABS_STATE_HOLDER = $("#search_container");	
	
	
$(document).on("click", "#search_tabs .tab", function() {
SEARCH_TABS_STATE_HOLDER.attr("data-active-tab", $(this).attr("data-tab-index"));	
search_section_tabs_changed();
});
	
	

var search_timeout;	
// the search box used by users to search for other users or tags
SEARCH_BOX.keyup(function(e){

SEARCH_USERS_RESULTS_CONTAINER.attr("data-end-of-results", "false");
SEARCH_TAGS_RESULTS_CONTAINER.attr("data-end-of-results", "false");

var active_tab = SEARCH_TABS_STATE_HOLDER.attr("data-active-tab");

clearTimeout(search_timeout);

if(active_tab == "0") {
SEARCH_USERS_RESULTS_CONTAINER.html(`<div class='emptyNowPlaceholder'>
<div class='preloader-wrapper active' style='margin:15px 0;'>
<div class='spinner-layer'>
<div class='circle-clipper left'>
<div class='circle'></div>
</div><div class='gap-patch'>
<div class='circle'></div>
</div><div class='circle-clipper right'>
<div class='circle'></div>
</div>
</div>
</div><br>Loading results for "` + SEARCH_BOX.val() + `"</div>`);
}
else if(active_tab == "1") {
SEARCH_TAGS_RESULTS_CONTAINER.html(`<div class='emptyNowPlaceholder'>
<div class='preloader-wrapper active' style='margin:15px 0;'>
<div class='spinner-layer'>
<div class='circle-clipper left'>
<div class='circle'></div>
</div><div class='gap-patch'>
<div class='circle'></div>
</div><div class='circle-clipper right'>
<div class='circle'></div>
</div>
</div>
</div><br>Loading results for "` + SEARCH_BOX.val() + `"</div>`);
}

search_timeout = setTimeout(function(){// if empty, toggle #searchResultsContainer
if(SEARCH_BOX.val().trim() == "") {
SEARCH_USERS_RESULTS_CONTAINER.html("<div class='emptyNowPlaceholder'><i class='material-icons'>search</i><br>Please type in something in the search box :)</div>")	
SEARCH_TAGS_RESULTS_CONTAINER.html("<div class='emptyNowPlaceholder'><i class='material-icons'>search</i><br>Please type in something in the search box :)</div>")	
return false;
}	

if(active_tab == "0") {	
// empty the SEARCH_USERS_RESULTS_CONTAINER of the last search's markup
SEARCH_USERS_RESULTS_CONTAINER.html("");
search_for_user(SEARCH_BOX.val() , 0 , search_for_user_callback);
}
else if(active_tab == "1") {
// empty the SEARCH_TAGS_RESULTS_CONTAINER of the last search's markup	
SEARCH_TAGS_RESULTS_CONTAINER.html("");
search_for_tag(SEARCH_BOX.val() , 0 , search_for_tag_callback);
}
}, 250);

});
// infinite scrolling
SEARCH_USERS_RESULTS_CONTAINER.scroll(function(){
if($(this).attr("data-end-of-results") === "false") {	
if($(this).scrollTop() > ($(this)[0].scrollHeight - 650) && $(this).find(".list_row").length > 0) {	
add_secondary_loading(SEARCH_USERS_RESULTS_CONTAINER);
search_for_user( SEARCH_BOX.val() , $(this).find(".list_row").length , function(data){
search_for_user_callback(data, function(){
remove_secondary_loading(SEARCH_USERS_RESULTS_CONTAINER);	
});	
});
}
}
});
// infinite scrolling
SEARCH_TAGS_RESULTS_CONTAINER.scroll(function(){
if($(this).attr("data-end-of-results") === "false") {	
if(($(this)[0].scrollHeight - ($(this).scrollTop() + $(this).outerHeight()) == 0) && $(this).find(".list_row").length > 0) {	
add_secondary_loading(SEARCH_TAGS_RESULTS_CONTAINER);
search_for_tag( SEARCH_BOX.val() , $(this).find(".list_row").length , function(data){
search_for_tag_callback(data, function(){
remove_secondary_loading(SEARCH_TAGS_RESULTS_CONTAINER);	
});	
});
}
}
});



});










function search_for_user(search_term , offset , callback) {
	
if(prevent_multiple_calls_to_search_for_user != false) {	
return false;
}


prevent_multiple_calls_to_search_for_user = true;

$.get({
url: 'http://192.168.1.100/golum/components/search_users.php',
data: {
"search_value": search_term,
"row_offset": offset
},
success: function(data){

var data_arr = JSON.parse(data);

if(typeof callback == "function") {
callback(data_arr);
}

prevent_multiple_calls_to_search_for_user = false;

}
}); 
	
}

function search_for_user_callback(data, callback) {

// if the user is not infinite scrolling and there have been no results, add a placeholder div to tell the user there have been no results.
if( data.length < 1 && SEARCH_USERS_RESULTS_CONTAINER.find(".list_row").length < 1) {
SEARCH_USERS_RESULTS_CONTAINER.html("<div class='emptyNowPlaceholder'><i class='material-icons'>error</i><br>Sorry, there were no results for your search term :(</div>")	
return false;	
}
else if(data.length < 1) {
SEARCH_USERS_RESULTS_CONTAINER.append(get_end_of_results_mark_up("End of results"));	
SEARCH_USERS_RESULTS_CONTAINER.attr("data-end-of-results", "true");
} 


for(var i = 0;i < data.length; i++) {
SEARCH_USERS_RESULTS_CONTAINER.append(generate_search_result_user_row_markup(data[i]));
}

if(typeof callback == "function") {
callback();	
}

}


function search_for_tag(search_term , offset , callback) {
	
if(prevent_multiple_calls_to_search_for_tag != false) {	
return false;
}

// remove a potential hashtag that a user would add since they assume that they should insert a hashtag before their search term since it's a tag search.
search_term[0] != "#" ? search_term : search_term.substring(1, search_term.length);

prevent_multiple_calls_to_search_for_tag = true;

$.get({
url: 'http://192.168.1.100/golum/components/search_tags.php',
data: {
"search_value": search_term,
"row_offset": offset
},
success: function(data){

var data_arr = JSON.parse(data);

if(typeof callback == "function") {
callback(data_arr);
}

prevent_multiple_calls_to_search_for_tag = false;
}
}); 
	
}



function search_for_tag_callback(data, callback) {

// if the user is not infinite scrolling and there have been no results, add a placeholder div to tell the user there have been no results.
if( data.length < 1 && SEARCH_TAGS_RESULTS_CONTAINER.find(".list_row").length < 1) {
SEARCH_TAGS_RESULTS_CONTAINER.html("<div class='emptyNowPlaceholder'><i class='material-icons'>error</i><br>Sorry, there were no results for your search term :(</div>")	
return false;	
} 
else if(data.length < 1) {
SEARCH_TAGS_RESULTS_CONTAINER.append(get_end_of_results_mark_up("End of results"));	
SEARCH_TAGS_RESULTS_CONTAINER.attr("data-end-of-results", "true");
} 

for(var i = 0;i < data.length; i++) {
SEARCH_TAGS_RESULTS_CONTAINER.append(
generate_tag_row_mark_up( 
data[i]["tag"], 
data[i]["total_posts"], 
data[i]["total_followers"],
data[i]["sample_image_path"],
data[i]["current_state"]
)
);
}

if(typeof callback == "function") {
callback();	
}
	
}




// used to generate the markup for user rows when a user searches for other rows
// avatar_object must be in this format: {"avatar": "xyz" , "avatar_positions" : [x,y] , "avatar_rotate_degree" : x} 
function generate_search_result_user_row_markup(data) {

var full_name = data["first_name"] + " " + data["last_name"];

// need the avatar to have an id so that we can identify it successfully, fit it to its parent and then find its .searchResultRow parent so we can initialize the special waves on it.
var result_row_element_id = "searchResultRow" + data["id"];

var user_row_markup = `

<div id='` + result_row_element_id + `' class='row list_row showUserModal modal-trigger dont_change_parent_background_when_clicked_parent' data-target='user_modal' data-user-id='` + data["id"] + `'>

<div class='col l1 m1 s2'>

<div class='row_avatar_container avatarContainer row_list_left_child dont_change_parent_background_when_clicked'>
<div class='avatarContainerChild'>
<div class='rotateContainer' style='position:relative;transform:none;display:inline-block;width:100%;height:100%;margin-top: ` + data["avatar_positions"][0] + `%;margin-left:` + data["avatar_positions"][1] + `%;'>
<div class='avatarRotateDiv' style='transform: rotate(` + data["avatar_rotate_degree"] + `deg);'>
<img class='avatarImages' src='` + (data["avatar"] != "" ? data["avatar"] : LetterAvatar(data["first_name"] , 60)) + `' alt='Avatar Picture'/>
</div><!-- end .avatarRotateDiv -->
</div><!-- end .rotateContainer -->
</div><!-- end avatarContainerChild -->
</div><!-- end .avatarContainer -->

</div>

<div class='col l11 m11 s10 list_row_center_container'>
<div class='col l9 m9 s7 row_infos_container'>
<div class='row_names_container'>
<div class='row_name flow-text'>` + full_name + `</div>
<div class='row_secondary_text flow-text'>@` + data["user_name"] + `</div>
</div>
</div><!-- end .row_infos_container -->

<div class='col l3 m3 s5 list_row_right_container skewScaleItem'>
<button class='row_button myBackground opacityChangeOnActive follow_user dont_change_parent_background_when_clicked stopPropagationOnClick ` + (data["blocked_by_base_user"] != "0" ? "semi_transparent" : "") + `' ` + (data["blocked_by_base_user"] != "0" ? "disabled='disabled' data-blocked-by-base-user='1'" : "") + ` data-user-id='` + data["id"] + `'>` + (data["current_state"] == 0 ? "Follow +" : "Unfollow") + `</button>
</div>
</div>

<script>

	$("#` + result_row_element_id + `").find('.avatarImages').on('load',function(){
		fitToParent($(this));
		adaptRotateWithMargin($(this), ` + (data["avatar_rotate_degree"] != "" ? data["avatar_rotate_degree"] : 0) + `,false);
	});
	
</script>
</div><!-- end .list_row -->`;
	
return user_row_markup;	
}



