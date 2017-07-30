
/*  (Google sign-in)-related */

function google_login() {
	
trySilentLogin();
logout();

window.plugins.googleplus.login(
{
"webClientId": "567008101486-pq9v5tecvnvk1fehkk2g9hmqh4pti30q.apps.googleusercontent.com"
},
function (user_info) {
$.post({
url:"http://192.168.1.100/golum/components/external_login.php",
data: {
"id": user_info["idToken"]
},
success:function(data){
var data_arr = JSON.parse(data);
if(data_arr[0] === 1) {
window.location.href = "logged_in.html";
}
else {	
Materialize.toast(data_arr[1], 6000, "green");
}
}
});
	
},
function (msg) {
console.log("error: " + msg);
}
);		
	
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

