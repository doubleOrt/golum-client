function favoritePost(postId, callback) {

if(typeof postId == "undefined") {
return false;	
}

$.post({
url:PATH_TO_SERVER_PHP_FILES + "favorite_post.php",
data:{"post_id":postId},
success:function(data) {
if(typeof callback != "undefined") {	
callback(data);
}
}	
});
	
}


$(document).on("dom_and_device_ready", function() {
	

/* when a user wants to favorite a post */

$(document).on("click",".favoritePost",function(){

if(typeof $(this).attr("data-actual-post-id") == "undefined") {
return false;
}	

var thisPostElement = $(this).parents(".singlePost");

favoritePost($(this).attr("data-actual-post-id"),favoritePostCallback);


function favoritePostCallback(postIsNowFavorited) {
if(postIsNowFavorited == "1") {
thisPostElement.find('.favoritePost').find('i').html('bookmark');	
}	
else {
thisPostElement.find('.favoritePost').find('i').html('bookmark_border');	
}
}


});

	
});