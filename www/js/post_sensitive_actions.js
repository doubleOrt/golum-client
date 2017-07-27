

function deletePost(postId,callback) {

if(typeof postId == "undefined") {
return false;	
}

$.post({
url:"http://192.168.1.100/golum/components/delete_post.php",
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
url:"http://192.168.1.100/golum/components/report_post.php",
data:{"post_id":postId},
success:function(data) {
eval(data);
}	
});

}

