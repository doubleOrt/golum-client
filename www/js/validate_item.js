
// this little function facilitates our work with inputs and validation a bit.

function ValidateItem(ref,regEx,onWrong) {
// a reference to the element (document.getElementById for example)	
this.ref = ref;
// a regex to test the above element's value against
this.regEx = regEx;
// the message that should be toasted to the page when the value does not match the regex
this.onWrong = onWrong;	

this.validate = function(make_toasts, change_borders) {
if(this.regEx.test(this.ref.value) == false) {

if(change_borders === true) {
/* if "input_error" class has not been added already add it,
this check is performed to prevent duplicate "input_error" 
classes from being added to an element. */
if(this.ref.className.indexOf('input_error') === -1){
this.ref.className = this.ref.className + " input_error";		
}
}
	
if(make_toasts === true) {
Materialize.toast(this.onWrong, 5000,"red");
}
return false;	
}
/* this is necessary to override the red borders, e.g you have 2 form elements you click submit, they're both false, now they have red borders, you correct one, 
click on submit again, now without this the border would still be red, but with this the border's going to be green. */
else {
if(change_borders === true) {	
// removes the elements "input_error" class, if there is one.	
this.ref.className = this.ref.className.replace("input_error", "");
}
return true;	
}		
}

}
