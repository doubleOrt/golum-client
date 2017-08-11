
$(document).ready(function(){
		
document.addEventListener("deviceready", function(){	

$.event.trigger({
type: "dom_and_device_ready"
});

});


// this snippet is so that we can test our app on a browser.
window.isphone = false;
if(document.URL.indexOf("http://") === -1 && document.URL.indexOf("https://") === -1) {
window.isphone = true;
}
if(!window.isphone) {
$.event.trigger({
type: "dom_and_device_ready"
});
}


});