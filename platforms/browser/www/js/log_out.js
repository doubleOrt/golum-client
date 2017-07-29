


function logOut() {

// when user presses the logout button 
$.get({
url:"http://192.168.1.100/golum/components/logout.php",
success:function(data) {
window.location.href = "index.html";
}	
});
	
}

$(document).ready(function() {
	 
// call the logOut() function whenever the user clicks something with the .log_out class.
$(document).on("click",".log_out",function(){
logOut();
});

});