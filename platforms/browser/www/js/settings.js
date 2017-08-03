
var SETTINGS_CONFIRM_EMAIL_SECTION_CONTAINER;



function ValidateItem(ref,regEx,onWrong) {
// a reference to the element (document.getElementById for example)	
this.ref = ref;
// a regex to test the above element's value against
this.regEx = regEx;
// the message that should be toasted to the page when the value does not match the regex
this.onWrong = onWrong;	

this.validate = function(make_toasts) {
if(this.regEx.test(this.ref.value) == false) {
this.ref.style.borderBottom = "2px solid red";		
if(make_toasts === true) {
Materialize.toast(this.onWrong, 5000,"red");
}
return false;	
}
/* this is necessary to override the red borders, e.g you have 2 form elements you click submit, they're both false, now they have red borders, you correct one, 
click on submit again, now without this the border would still be red, but with this the border's going to be green. */
else {
this.ref.style.borderBottom = "2px solid #42dc12";
return true;	
}		
}

}



// if the user has requested to link their account with an email address, then show them the confirmation code things. 
function show_email_confirmation() {
// if user has requested us to link his account with an email address and we have sent him a confirmation code, show him the enter confirmation code form.
$.get({
url:"http://192.168.1.100/golum/components/show_confirmation_code_form.php",
success:function(data) {	

var data_arr = JSON.parse(data);

if(data_arr[0] === "1") {
$("#confirm_email_modal").modal("open", {
inDuration: 300, // Transition in duration
outDuration: 150, // Transition out duration	
startingTop: "100%",
endingTop: "50%",	
ready:function(){
var this_modal = $(this);	
setTimeout(function(){z_index_stack = parseFloat(this_modal.css("z-index"));},300);
}
});
openModalCustom("confirm_email_modal");
$("#confirm_email_modal_email_address_in_text").html(data_arr[1]);
SETTINGS_CONFIRM_EMAIL_SECTION_CONTAINER.show();
}
else if(data_arr[0] === "0") {
return false;	
}

}	
});	

}


function resend_confirmation_code(callback) {
$.post({
url: "http://192.168.1.100/golum/components/resend_confirmation_code.php",
success: function(data) {
var data_arr = JSON.parse(data);
callback(data_arr);	
}	
});	
}






$(document).ready(function(){


SETTINGS_CONFIRM_EMAIL_SECTION_CONTAINER = $("#settings_email_confirmation_section");


// if the user has requested to link their account with an email address, then show them the confirmation code modal on logging in.
show_email_confirmation();

$(document).on("click", "#resend_confirmation_code", function(){
var this_element = $(this);
this_element.addClass("disabledButton");
resend_confirmation_code(function(data){
this_element.removeClass("disabledButton");	
if(data[0] == "1") {
Materialize.toast("We just sent you another confirmation code :)", 5000, "green");	
show_email_confirmation();
}	
else {
Materialize.toast("Sorry, we weren't able to send you another confirmation code :(", 5000, "red");		
}
});	
});





var default_first_name;
var default_last_name;
var default_user_name;
var default_email_address;

var defaultCheckObject;

$.get({
url:"http://192.168.1.100/golum/components/user_modal_variables.php",
success:function(data) {
eval(data);
$("#change_first_name").val(default_first_name);
$("#change_last_name").val(default_last_name);
$("#change_user_name").val(default_user_name);
$("#add_email").val(default_email_address);

//update the fields
Materialize.updateTextFields();

defaultCheckObject = {
"change_first_name":{
"value": default_first_name,
"regexHandler": check_change_first_name
},	
"change_last_name":{
"value": default_last_name,
"regexHandler": check_change_last_name
},	
"change_user_name":{
"value": default_user_name,
"regexHandler": check_change_user_name
},	
"change_password":{
"value": "",
"regexHandler": check_change_password
},	
"add_email":{
"value": default_email_address,
"regexHandler": check_add_email
}
};

}	
});	




var check_change_first_name = new ValidateItem(document.getElementById("change_first_name"),/^[a-zA-Z\s]{3,18}$/i,"First Name Must Only Contain Letters And Spaces And Must Be Longer Than 3 And Shorter Than 18 Characters");
var check_change_last_name = new ValidateItem(document.getElementById("change_last_name"),/^[a-zA-Z\s]{3,18}$/i,"Last Name Must Only Contain Letters And Spaces And Must Be Longer Than 3 And Shorter Than 18 Characters");
var check_change_user_name = new ValidateItem(document.getElementById("change_user_name"),/^([a-zA-Z]+[0-9 ]*){6,36}$/i,"Username Must Be A Combination Of Letters, Numbers And Spaces And Muse Be Between 6-36 Characters In Length");
var check_change_password = new ValidateItem(document.getElementById("change_password"),/^(?=.*[A-Za-z])(?=.*\d)(?=.*([$@$!%*#?& ]*))[A-Za-z\d($@$!%*#?& )*]{8,50}$/i,"Password Must Contain At Least 1 Digit And Must Be Between 8-50 Characters, Special Characters And Spaces Are Optional");
var check_add_email = new ValidateItem(document.getElementById("add_email"),/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"Your Email Address Is Invalid");
var check_current_password = new ValidateItem(document.getElementById("current_password"),/^(?=.*[A-Za-z])(?=.*\d)(?=.*([$@$!%*#?& ]*))[A-Za-z\d($@$!%*#?& )*]{8,50}$/i,"Wrong Password");


var should_enable_save_changes_button_timeout;
$("#change_first_name, #change_last_name, #change_user_name, #change_password, #add_email").on("change",function(){
if(typeof should_enable_save_changes_button_timeout != "undefined") {
clearTimeout(should_enable_save_changes_button_timeout);	
}	
should_enable_save_changes_button(true);
}).on("keyup", function(){
should_enable_save_changes_button(false);	
if(typeof should_enable_save_changes_button_timeout != "undefined") {
clearTimeout(should_enable_save_changes_button_timeout);	
}
should_enable_save_changes_button_timeout = setTimeout(function(){should_enable_save_changes_button(true);}, 1500);	
});


function should_enable_save_changes_button(make_toasts) {

var anything_changed = false;
for(var prop in defaultCheckObject) {
if($("#" + prop).val().trim() != defaultCheckObject[prop]["value"]) {	
anything_changed = true;
$("#saveChangesModalOpener").removeClass("disabledButton");		
if(defaultCheckObject[prop]["regexHandler"] != undefined) {	
if(defaultCheckObject[prop]["regexHandler"].validate(make_toasts) == false) {
$("#saveChangesModalOpener").addClass("disabledButton");	
break;
}
}
}
else if(anything_changed == false) {
$("#saveChangesModalOpener").addClass("disabledButton");		
}
}
	
}


$("#deactivateButton").click(function(){
$("#deactivateOrDelete").val("deactivate");
});


$("#deleteButton").click(function(){
$("#deactivateOrDelete").val("delete");
});


$("#cancelChanges").click(function(){
$("#deactivateOrDelete").val("");
});


$(document).on("click","#saveChanges",function(){
	
if(check_current_password.validate(true) === true) {

$("#saveChanges").html("Saving").addClass("disabledButton");

$.post({
url: 'http://192.168.1.100/golum/components/change_settings.php',
data: {
"current_password":$("#current_password").val(),
"change_first_name":$("#change_first_name").val(),
"change_last_name":$("#change_last_name").val(),
"change_user_name":$("#change_user_name").val(),
"change_password":$("#change_password").val(),
"add_email":$("#add_email").val(),
"deactivate_or_delete":$("#deactivateOrDelete").val()
},
success:function(data) {

$("#saveChanges").html("Save").removeClass("disabledButton");

var dataArr = JSON.parse(data);

/* if the user inserted the right save-changes password, then we want to close the confirm-password 
modal, regardless of the success of the settings changes. */
if(dataArr[2] == "true") {
closeModal("modal2");	
}

eval(dataArr[0]);

$("#saveChangesModalOpener").addClass("disabledButton");

defaultCheckObject['change_first_name'].value = $("#change_first_name").val();
defaultCheckObject['change_last_name'].value = $("#change_last_name").val();
defaultCheckObject['change_user_name'].value = $("#change_user_name").val();
if(defaultCheckObject["add_email"].value != $("#add_email").val() && $(".confirmEmailContainer").length == 0) {
show_email_confirmation();
}

defaultCheckObject['add_email'].value = $("#add_email").val();

$(".baseUserFullNameContainers").html(defaultCheckObject['change_first_name'].value + " " + defaultCheckObject['change_last_name'].value);
$(".baseUserUserNameContainers").html(defaultCheckObject['change_user_name'].value);
$("#current_password").val("");
$("#change_password").val("");

}
});
}

});



/* we want to prevent the default action for linkless links. */
$("a[href='#']").click(function(event){
event.preventDefault();
});




	
	
	
	
	
$(document).on("click","#confirmEmail",function(){

var confirmation_code = $("#confirmation_code").val().trim();

var regex = /^\d+$/i;

if(regex.test(confirmation_code) == false) {
Materialize.toast("Confirmation Code Must Contain Numbers Only",3000,"red");		
return;
}
else {

$.post({
url:"http://192.168.1.100/golum/components/confirm_email.php",
data:{
"confirmation_code":confirmation_code
},
success:function(data) {

var data_arr = JSON.parse(data);

if(data_arr[0] === 1) {
Materialize.toast("Email address successfully linked with your account :)", 5000, "green");	
closeModal("confirm_email_modal");
$("#confirmation_code").val("");
SETTINGS_CONFIRM_EMAIL_SECTION_CONTAINER.hide();
}
else {
Materialize.toast('Invalid confirmation code :(',5000,'red');
}

}	
});
}
});


$(document).on("click", "#set_password_for_first_time_modal_confirm", function(){

var password_regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*([$@$!%*#?& ]*))[A-Za-z\d($@$!%*#?& )*]{8,50}$/;

var set_password_password = $("#set_password_for_first_time_modal_password").val();

if(password_regex.test(set_password_password) === true) {
	
$.post({
url: "http://192.168.1.100/golum/components/set_password_for_first_time.php",	
data: {
"password": set_password_password	
},
success: function(data) {

var data_arr = JSON.parse(data);

if(data_arr[0] == 1) {
closeModal("set_password_for_first_time_modal");	
}
else {
Materialize.toast(data_arr[1], 5000, "red");	
}

}
});

}
else {
Materialize.toast("Password Must Contain At Least 1 Digit And Must Be Between 8-50 Characters, Special Characters And Spaces Are Optional", 5000, "red");	
}

});
	

})



