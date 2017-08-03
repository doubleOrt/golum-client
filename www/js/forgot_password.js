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




$(document).on("dom_and_device_ready", function() {

var new_password = new ValidateItem(document.getElementById("new_password_input"), /^(?=.*[A-Za-z])(?=.*\d)(?=.*([$@$!%*#?& ]*))[A-Za-z\d($@$!%*#?& )*]{8,50}$/i, "Password Must Contain At Least 1 Digit And Must Be Between 8-50 Characters, Special Characters And Spaces Are Optional");

$(document).on("click","#forgot_password_button",function(){

var current_step = parseFloat($(this).attr("data-current-step"));
	
var data_object = {};
	
if(current_step == 0) {
data_object["user_name_or_email_address"] = $("#forgot_password_username_or_email_address").val();
}
else if(current_step == 1) {
data_object["user_name_or_email_address"] = $("#forgot_password_username_or_email_address").val();
data_object["reset_code"] = $("#password_reset_code").val();
}
else if(current_step == 2) {
data_object["user_name_or_email_address"] = $("#forgot_password_username_or_email_address").val();
data_object["reset_code"] = $("#password_reset_code").val();
data_object["new_password"] = $("#new_password_input").val();
if(new_password.validate() === false) {
return false;	
}
}

// don't move this to the top without looking at the logic of the conditionals
$(this).addClass("disabledButton");
	
$.post({
url:"http://192.168.1.100/golum/components/forgot_password.php",
data: data_object,
success:function(data) {
				
var data_arr = JSON.parse(data);

$("#forgot_password_button").removeClass("disabledButton");

// the user passed the current step, take them to the next one.
if(data_arr[0] == "1") {
$(".forgot_password_input_containers").hide();

$("#forgot_password_button").attr("data-current-step",  current_step + 1);

if(current_step == 0) {	
$("#password_reset_code_container").fadeIn();
}	
else if(current_step == 1) {
$("#new_password_input_container").fadeIn();	
}
else if(current_step == 2) {
$("#forgot_password_username_or_email_address_container").fadeIn();
reset_forgot_password_modal();
closeModal("forgotPasswordModal");
}
	
Materialize.toast(data_arr[1], 5000, "green");
}
// the user failed to pass this step
else if(data_arr[0] == "0") {	
Materialize.toast(data_arr[1], 8000, "red");	
}

}
});
	
});

function reset_forgot_password_modal() {
$("#forgot_password_username_or_email_address").val("");
$("#password_reset_code").val("");
$("#new_password_input").val("");	
$("#forgot_password_button").attr("data-current-step", "0");
}



	
});