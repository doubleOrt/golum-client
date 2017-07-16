<?php
// when a user wants to see his posts, we make a call to this page.

require_once "common_requires.php";
require_once "logged_in_importants.php";
require_once "post_markup_function.php";


$echo_arr = [];	

if(isset($_GET["row_offset"]) && filter_var($_GET["row_offset"], FILTER_VALIDATE_INT) !== false) {	
	
	
$prepared = $con->prepare("select *, (select count(id) from post_votes where post_votes.post_id = posts.id) as total_votes, (select count(id) from favorites where favorites.post_id = posts.id) as total_favorites, (select count(id) from notifications where type = 5 and notifications.extra = posts.id) as total_sends from posts order by total_votes desc, total_favorites desc limit 3 ". ($_GET["row_offset"] > 0 ? "OFFSET ". $_GET["row_offset"] : ""));
$prepared->execute();
$my_posts_arr = $prepared->fetchAll();


if(count($my_posts_arr) > 0) {
for($i = 0;$i<count($my_posts_arr);$i++) {
array_push($echo_arr, get_post_markup($my_posts_arr[$i]));
}
}

}

echo json_encode($echo_arr);


unset($con);

?>