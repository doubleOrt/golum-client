

function register_to_do_things_on_scroll(scroll_target, scroll_is_at_least, scroll_top_threshold, scroll_bottom_threshold, smaller_than_is_at_least_callback, scroll_top_callback, scroll_bottom_callback) {

var this_element = scroll_target;
this_element.data("is_being_scrolled", false);

this_element.scroll(function(event){
$(this).data("is_being_scrolled", true);
});

setInterval(function() {
if (this_element.data("is_being_scrolled") == true) {
hasScrolled(scroll_target, scroll_is_at_least, scroll_top_threshold, scroll_bottom_threshold, smaller_than_is_at_least_callback, scroll_top_callback, scroll_bottom_callback);
this_element.data("is_being_scrolled", false);
}
}, 250);
	
}


function hasScrolled(scroll_target, scroll_is_at_least, scroll_top_threshold, scroll_bottom_threshold, smaller_than_is_at_least_callback, scroll_top_callback, scroll_bottom_callback) {

var last_scroll_top = scroll_target.data("last_scroll_top");
var scroll_top = scroll_target.scrollTop();

if(scroll_top > scroll_is_at_least) {
	
if(last_scroll_top - scroll_top > scroll_top_threshold) {
scroll_top_callback();
}	
else if(scroll_top - last_scroll_top > scroll_bottom_threshold) {
scroll_bottom_callback();
}
	
}
else {
smaller_than_is_at_least_callback();	
}

scroll_target.data("last_scroll_top", scroll_top);
}


