$(document).ready(function() {
		
	
function ValidateItem(ref,regEx,onWrong) {
// a reference to the element (document.getElementById for example)	
this.ref = ref;
// a regex to test the above element's value against
this.regEx = regEx;
// the message that should be toasted to the page when the value does not match the regex
this.onWrong = onWrong;	

this.validate = function() {
if(this.regEx.test(this.ref.value) == false) {
this.ref.style.borderBottom = "1px solid red";		
Materialize.toast(this.onWrong, 5000,"red")
return false;	
}
/* this is necessary to override the red borders, e.g you have 2 form elements you click submit, they're both false, now they have red borders, you correct one, 
click on submit again, now without this the border would still be red, but with this the border's going to be green. */
else {
this.ref.style.borderBottom = "1px solid #42dc12";
return true;	
}		
}

}


var firstName = new ValidateItem(document.getElementById("first_name"), /^[a-zA-Z\s]{3,18}$/i,"First Name Must Only Contain Letters And Spaces And Must Be Longer Than 3 And Shorter Than 18 Characters");
var lastName = new ValidateItem(document.getElementById("last_name"), /^[a-zA-Z\s]{3,18}$/i,"Last Name Must Only Contain Letters And Spaces And Must Be Longer Than 3 And Shorter Than 18 Characters");
//note that even if you change the username regex to allow more than 36 characters, it won't work because the sql username column's length is set to 36.
var userName = new ValidateItem(document.getElementById("user_name"), /^([a-zA-Z]+[0-9 ]*){6,36}$/i,"Username Must Be A Combination Of Letters, Numbers And Spaces And Must Be Between 6-36 Characters In Length");
var password = new ValidateItem(document.getElementById("password"), /^(?=.*[A-Za-z])(?=.*\d)(?=.*([$@$!%*#?& ]*))[A-Za-z\d($@$!%*#?& )*]{8,50}$/i, "Password Must Contain At Least 1 Digit And Must Be Between 8-50 Characters, Special Characters And Spaces Are Optional");


document.getElementsByName("sign_up")[0].parentElement.addEventListener("click",function(event){signUpValidate(event);},false);
function signUpValidate(event) {
event.preventDefault();

//if an element does not match our criteria, this variable is set to false. at the end we check if this variable is equal to true, if it is, we manually click the submit button.
var everythingMatches = true;	
	
var checkFirstName = firstName.validate();
var checkLastName = lastName.validate();
var checkUserName = userName.validate();
var checkPassword = password.validate();
	
if(checkFirstName == false || checkLastName == false || checkUserName == false || checkPassword == false) {
everythingMatches = false;
}

/* we are doing this because of a css error, where we make the submit buttons 100% width but instead their wrapper wave containers become 100% width and because the actual submit 
button is the only the submit text and not all the red space around it, this produces a bug where a user thinks they are clicking the button (they aren't, they are clicking the
wrapper), but the form won't be submitted */
if(everythingMatches == true) {
$("#sign_up").parent().css({"opacity":".4","pointer-events":"none"});

$.ajax({
url:"http://192.168.1.100/golum/components/sign_up.php",
data:{
first_name:$("#first_name").val(),
last_name:$("#last_name").val(),
user_name:$("#user_name").val(),
password:$("#password").val()
},
type:"post",
success:function(data){

	if(data == "success") {
	window.location.href = "logged_in.html";	
	}
	else {
	eval(data);
	$("#sign_up").parent().css({"opacity":"1","pointer-events":"all"});	
	$("#sign_up").css({"opacity":"1","pointer-events":"all"});	
	}
	
}
}); 

}

}









//note that even if you change the username regex to allow more than 36 characters, it won't work because the sql username column's length is set to 36.
var loginUsername = new ValidateItem(document.getElementById("login_user_name_or_email"),/^([a-zA-Z]+[0-9 ]*){6,36}$/i,"");
var loginEmail = new ValidateItem(document.getElementById("login_user_name_or_email"),	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,"");
var loginPassword = new ValidateItem(document.getElementById("login_password"),/^(?=.*[A-Za-z])(?=.*\d)(?=.*([$@$!%*#?& ]*))[A-Za-z\d($@$!%*#?& )*]{8,50}$/i,"");

// add a click listener to the login button so whenever it is clicked we call the validate function on it.
document.getElementsByName("login")[0].parentElement.addEventListener("click",function(event){loginValidate(event);},false);

function loginValidate(event) {
event.preventDefault();

var checkLoginUserName = loginUsername.validate();
var checkLoginEmail = loginEmail.validate();
var checkLoginPassword = loginPassword.validate();

//without this, if the user provided us with a correct full name, the fullname_or_email field's border-bottom-color would be set to red because then the loginEmail.validate() function which we call after the loginFullName.validate() would override the loginFullName.validate()'s effects.
if(checkLoginUserName == true || checkLoginEmail == true) {
document.getElementById("login_user_name_or_email").style.borderBottom = "1px solid #42dc12";
}

if ((checkLoginUserName == false && checkLoginEmail == false) || checkLoginPassword == false) {
Materialize.toast("Wrong Login Info",5000,'red')
}	
//if everything is ok, submit the form.
else {	
// materialize edits our button so we have to make our edits on the parent instead.
$("#login").parent().addClass("disabledButton");
$("#login").val("Logging in...");

$.post({
url:"http://192.168.1.100/golum/components/login.php",
data:{
login_user_name_or_email:$("#login_user_name_or_email").val(),
login_password: $("#login_password").val()
},
success:function(data){

var data_arr = JSON.parse(data);

if(data_arr[0] == "1") {
window.location.href = "logged_in.html";	
}
else {
eval(data_arr[1]);
$("#login").parent().css({"opacity":"1","pointer-events":"all"});	
$("#login").removeClass("disabledButton");	
$("#login").val("Login");
}

}
}); 
}
	
}





$(document).on("click", "#switchFormsButton", function(){
// the login form is now visible
if(switch_forms() == 0) {
$(this).html("Sign Up");
} 
// the sign-up form is now visible
else {
$(this).html("Login");	
}
});

function switch_forms() {

if($("#loginForm").is(":visible") === true) {
$("#loginForm").hide();	
$("#signUpForm").fadeIn();	
return 1;
}
else if($("#signUpForm").is(":visible") === true) {
$("#signUpForm").hide();	
$("#loginForm").fadeIn();	
return 0;
}
	
}


});