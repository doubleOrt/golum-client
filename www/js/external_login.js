
/*  (Google sign-in)-related */

function google_login() {
	
try {	
	
trySilentLogin(function(){
logout(function(){

window.plugins.googleplus.login(
{
"webClientId": "567008101486-pq9v5tecvnvk1fehkk2g9hmqh4pti30q.apps.googleusercontent.com"
},
function (user_info) {
				
alert(JSON.stringify(user_info));
				
//show the loading bar and hide the document body
$("#page_loading").show();
$("#showOnBodyLoad").hide();
	
$.post({
url:PATH_TO_SERVER_PHP_FILES + "external_login.php",
data: {
"id": user_info["idToken"]
},
success:function(data){
		
alert(data);	
		
var data_arr = JSON.parse(data);
if(data_arr[0] === 1) {
window.location.href = "logged_in.html";
}
else {	
Materialize.toast(data_arr[1], 6000, "red");
//hide the loading bar and show the document body
$("#page_loading").hide();
$("#showOnBodyLoad").show();
}
}
});
	
},
function (msg) {
console.error("Google sign-in error: " + msg);
console.log("Google sign-in error: " + msg);
}
);		
	
});	
});

}
catch(error) {
console.warn("Something went wrong - Probably related to the loading of the cordova-plugin-googleplus plugin.");		
}
	
}


/* we are calling the callback function passed as the parameter 
of the 2 functions below because we want to call the callback 
function after the Google things in those functions are DONE, 
not after they have SUCCEEDED, so we are calling the callback 
even if there was an error. This shouldn't be the case naturally, 
but we have added this callbacks so that each function call executes 
only after the Google thing from the previous has been done, this 
seemed to fix a Google-sign-in bug that would occur roughly once in
8 times. So, perhaps naming these callback parameters "callback" wasn't 
a very bright idea, but this comment should have brightened it up even 
if it weren't so initially.git */

function trySilentLogin(callback) {
window.plugins.googleplus.trySilentLogin(
{
"webClientId": "567008101486-pq9v5tecvnvk1fehkk2g9hmqh4pti30q.apps.googleusercontent.com"
},
function (obj) {
callback();	
},
function (msg) {
console.log("Silent logout error: " + msg);
callback();
}
);
}

function logout(callback) {
window.plugins.googleplus.logout(
function (msg) {
callback();
},
function (msg) {
console.log("Logout error" + msg);
callback();
}
);
}


/* end (google-sign-in)-related */

