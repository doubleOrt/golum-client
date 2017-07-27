
function openFullScreenFileView(imgSrc) {
$("#fullScreenFileViewFile").attr("src",imgSrc).parents("#fullScreenFileView").fadeIn("fast");
}

function closeFullScreenFileView() {
$("#fullScreenFileView").fadeOut('fast',function(){
$("#fullScreenFileView").find("#fullScreenFileViewFile").attr("src","");	
});		
}
