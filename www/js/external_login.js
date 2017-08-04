
/*  (Google sign-in)-related */

function google_login() {
	
try {	
	
trySilentLogin();
logout();

window.plugins.googleplus.login(
{
"webClientId": "567008101486-pq9v5tecvnvk1fehkk2g9hmqh4pti30q.apps.googleusercontent.com"
},
function (user_info) {
	
alert("User data\n:" + JSON.stringify(user_info));	
	
//show the loading bar and hide the document body
$("#page_loading").show();
$("#showOnBodyLoad").hide();
	
$.post({
url:"http://192.168.1.100/golum/components/external_login.php",
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
alert("Google sign-in error: " + msg);
}
);		

}
catch(error) {
console.warn("Something went wrong - Probably related to the loading of the cordova-plugin-googleplus plugin.");		
}
	
}

function trySilentLogin(callback) {
window.plugins.googleplus.trySilentLogin(
{
"webClientId": "567008101486-pq9v5tecvnvk1fehkk2g9hmqh4pti30q.apps.googleusercontent.com"
},
function (obj) {
},
function (msg) {
console.log(msg);
}
);
}

function logout(callback) {
window.plugins.googleplus.logout(
function (msg) {
},
function (msg) {
console.log(msg);
}
);
}


/* end (google-sign-in)-related */

