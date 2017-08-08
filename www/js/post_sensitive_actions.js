

function deletePost(postId,callback) {

if(typeof postId == "undefined") {
return false;	
}

$.post({
url:PATH_TO_SERVER_PHP_FILES + "delete_post.php",
data:{"post_id":postId},
success:function(data) {
if(data == "1") {
if(typeof callback != "undefined") {	
callback();	
}
}	
}
});

}


/* when a user wants to report a post */
function reportPost(postId) {
	
if(typeof postId == "undefined") {
return false;	
}
	
$.post({
url:PATH_TO_SERVER_PHP_FILES + "report_post.php",
data:{"post_id":postId},
success:function(data) {
eval(data);
}	
});

}

