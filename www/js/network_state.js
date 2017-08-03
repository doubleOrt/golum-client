
var user_was_offline = false;
function handle_offline() {
if(user_was_offline === false) {	
$(".toast").remove();
$("body").css("filter", "grayscale(100%)");
$("body").append("<div id='offline_overlay' style='display:none;background:rgba(0,0,0,.8);width:100%;height:100%;position:fixed;top:0;left:0;margin:0;padding:0;z-index:999'></div>");
$("#offline_overlay").fadeIn();
Materialize.toast("Not connected to the internet!", 50000000, "black");
$("body").append("<div id='offline_transparent_overlay' style='width:100%;height:100%;position:fixed;top:0;left:0;margin:0;padding:0;z-index:9999999'></div>");
user_was_offline = true;
}
}

function handle_online() {
if(user_was_offline === true) {	
$("body").css("filter", "grayscale(0%)");	
$("#offline_overlay").fadeOut("fast", function(){
$(this).remove();	
});
$("#offline_transparent_overlay").remove();
$(".toast").remove();
user_was_offline = false;
}
}
