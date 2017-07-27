

function fitToParent(ref) {

//if element is undefined, return false.
if($(ref).length == 0) {
return false;	
}

$(ref).css({"width":"auto","height":"auto"});
if($(ref).prop("naturalWidth") >= $(ref).prop("naturalHeight")) {
$(ref).css({"min-height":"100%","max-height":"100%","min-width":"100%","max-width":"none"});
}
else {
$(ref).css({"min-width":"100%","max-width":"100%","min-height":"100%","max-height":"none"});
}
}



/* adds some css so that you can use margin-top and margin-left on rotated elements correctly, without this everything would be reversed, for example margin-left
would become margin-bottom, and so on, depending on the rotate angle */
function adaptRotateWithMargin(elem,rotationDegree,changeRotate) {

if(rotationDegree == 90) {
elem.parent().css({"left":"100%","top":"0%"});elem.css({"top":"auto","bottom":"0","left":"0"});
}
else if(rotationDegree == 180) {
elem.parent().css({"left":"100%","top":"100%"});elem.css({"top":"auto","bottom":"0","right":"0","left":"auto"});
}
else if(rotationDegree == 270) {
elem.parent().css({"left":"0%","top":"100%"});elem.css({"top":"0","bottom":"auto","right":"0","left":"auto"});
}
else {
elem.parent().css({"left":"0%","top":"0%"});elem.css({"top":"0","left":"0"});
}

if(changeRotate == true) {
$(elem).parent().parent().css({"margin-left":"0","margin-top":"0"});	
}

}


/* this function we will use to get the rotate css value */
function getRotationDegrees(obj) {
var matrix = obj.css("-webkit-transform") ||
obj.css("-moz-transform")    ||
obj.css("-ms-transform")     ||
obj.css("-o-transform")      ||
obj.css("transform");
if(matrix !== 'none') {
var values = matrix.split('(')[1].split(')')[0].split(',');
var a = values[0];
var b = values[1];
var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
} else { var angle = 0; }
return (angle < 0) ? angle + 360 : angle;
}








// for giving a preview of an image before it is uploaded
function imagePreview(input,elem,background_or_src) {

var reader = new FileReader();


var inputElement = input; 

reader.onload = function (e) {

// all EXIF related things deal with EXIF-orientation issues
var EXIF_adaptation_rotate_degree = 0;
// these methods are from the EXIF library.
EXIF.getData(input, function() {
var orientation = EXIF.getTag(this, "Orientation");
switch(orientation) {
case 3:
EXIF_adaptation_rotate_degree = 180;
break;
case 6:
EXIF_adaptation_rotate_degree = 90;
break;
case 8:
EXIF_adaptation_rotate_degree = -90;
break;
}
elem.css({"transform": "translate(-50%,-50%) rotate(" + EXIF_adaptation_rotate_degree + "deg)"});
fitToParent("#shareNewImagesContainer .col:nth-child(" + (elem.parent().index() + 1) + ") img");
});

	

if(background_or_src == "background") {
elem.css('background', "url(" + e.target.result + ")");
elem.css('background-size', "cover");
elem.css('background-position', "center center");
}
if(background_or_src == "src") {
elem.attr('src', e.target.result);
}

}

reader.readAsDataURL(input);
}



// takes an element that has a numeric attribute (which has to be passed to this function as well), and returns that attribute's value incremented or decremented by 1.
function setNewNumber(elem, totalNumberAttrName, isIncrement, addParenthesis, extraString) {
var currentNum = elem.attr(totalNumberAttrName);	
var newNum = parseFloat(currentNum) + (isIncrement == true ? 1 : -1);	
if(addParenthesis == true) {
elem.html("(" + newNum + extraString + ")");
}
else {
elem.html(newNum + extraString);	
}	
elem.attr(totalNumberAttrName,newNum);
return newNum;	
}




// just a function useful for taking the pointer to the end of content-editables when focusing them in, because the default is the beginning. (usually you will need function when you programatically modify the innerHTML of one of these content-editable divs)
function movePointerToEnd(el) {
el.focus();
if (typeof window.getSelection != "undefined"
&& typeof document.createRange != "undefined") {
var range = document.createRange();
range.selectNodeContents(el);
range.collapse(false);
var sel = window.getSelection();
sel.removeAllRanges();
sel.addRange(range);
} else if (typeof document.body.createTextRange != "undefined") {
var textRange = document.body.createTextRange();
textRange.moveToElementText(el);
textRange.collapse(false);
textRange.select();
}
}


/* takes an image as a parameter and its size limit as a parameter, checks if it is either "JPEG", "JPG", "PNG" or "GIF", 
along with some other checks and if the image doesn't pass one of these checks, it will return the corresponding message. */
function checkImageFile(inputElement,sizeLimit) {

if(typeof inputElement[0].files[0] != "undefined") {

if(inputElement[0].files[0]["type"] != "image/jpeg" && inputElement[0].files[0]["type"] != "image/jpg" && inputElement[0].files[0]["type"] != "image/png" && inputElement[0].files[0]["type"] != "image/gif") {
return "Image Type Must Be Either \"JPEG\", \"JPG\", \"PNG\" Or \"GIF\" !";
}
if(inputElement[0].files[0]["size"] >= sizeLimit) {	
return "Image Size Must Be Smaller Than " + (sizeLimit / 1000000) + "MB";
}
if(inputElement[0].files[0]["size"] < 1) {	
return "Sorry, There Is Something Wrong With Your Picture";
}

}
// if image is undefined
else {
return "Sorry, There Is Something Wrong With Your Picture";	
}

return true;
}




// enhanced intervals we use for getting comment dates every 2 mins for example.	
function EnhancedInterval(intervalVar,intervalTime,callback) {
clearInterval(intervalVar);	
intervalVar = setInterval(callback,intervalTime);	
this.intervalFunction = callback;
}	


// takes a value and an array, returns true if the value is in the array, and false if it is not.
function checkIfValueIsInArray(val,arr) {
for(var i = 0;i<arr.length;i++) {
if(arr[i] == val) {
return true;	
}	
}
return false;	
}



/* we make a call to this function whenever the user wants to see different types of posts (favorites, my posts, posts by tag, etc...), you are supposed to make a call 
to this function directly when the invoker element is clicked. and please don't confuse this with deleting posts, this one is merely a client side function that removes html elements */
function emptyAllPostsContainer() {
$("#allPostsContainer").html("");
}




// call this function to properly format all the tags in a string
function handle_tags(target_string) {
return target_string = target_string.replace(/(#\w+)/gi, function func(tag){
return "<span class='hashtag getTagPosts opacityChangeOnActive modal-trigger' data-target='tagPostsModal' data-tag='" + tag + "'>" + tag + "</span>";
});
}





// adds the loading spinner
function showLoading(target_element, top_position) {
target_element.prepend(`<div class='preloader-wrapper_container' style='position:fixed;top:` + top_position + `;left:50%;transform:translate(-50%,-50%);z-index:99999;'>
<div class='preloader-wrapper active'>
<div class='spinner-layer'>
<div class='circle-clipper left'>
<div class='circle'></div>
</div><div class='gap-patch'>
<div class='circle'></div>
</div><div class='circle-clipper right'>
<div class='circle'></div>
</div>
</div>
</div>
</div>`);
}
// hides the loading spinner.
function removeLoading(target_element) {
target_element.find(".preloader-wrapper_container").remove();	
}



function add_secondary_loading(target_element) {
if(target_element.find(".preloader-wrapper_container").length < 1) {	
target_element.append(`<div class='preloader-wrapper_container' style='display:inline-block;position:relative;top:0%;left:50%;transform:translate(-50%,0%);margin:40px 0 40px 0;z-index:99999;'>
<div class='preloader-wrapper active'>
<div class='spinner-layer'>
<div class='circle-clipper left'>
<div class='circle'></div>
</div><div class='gap-patch'>
<div class='circle'></div>
</div><div class='circle-clipper right'>
<div class='circle'></div>
</div>
</div>
</div>
</div>`);	
}
else {
target_element.find(".preloader-wrapper_container").css("opacity", "1");	
}
}

function remove_secondary_loading(target_element) {	
target_element.find(".preloader-wrapper_container").remove();
add_secondary_loading(target_element);
target_element.find(".preloader-wrapper_container").css("opacity", "0");	
}



function get_end_of_results_mark_up(message) {
return "<div class='end_of_results'><i class='material-icons'>info</i><br>" + (typeof message != "undefined" ? message : "End of results") + "</div>";
}


function check_if_main_screen_is_open(main_screen_id) {
return $("#" + main_screen_id).hasClass("main_screen_active");
}

