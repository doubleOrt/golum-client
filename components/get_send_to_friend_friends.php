<?php
/* we make a call to this page whenever a user wants types in the send to friend modal */

require_once "common_requires.php";
require_once "logged_in_importants.php";

$echo_arr = [];


if(isset($_GET["search_term"]) && filter_var($_GET["post_id"], FILTER_VALIDATE_INT) !== "" && filter_var($_GET["row_offset"], FILTER_VALIDATE_INT) !== "") {

$prepared = $con->prepare("select * from (select id, first_name, last_name, avatar_picture, (select case when count(id) > 0 then 1 when count(id) < 1 then 0 end as user_is_following_base_user from contacts where contact_of = users.id and contact = :user_id) as user_is_following_base_user, (select case when count(id) > 0 then 1 when count(id) < 1 then 0 end as current_state from notifications where notification_from = :user_id and notification_to = users.id and type = 4 and extra = :post_id) as current_state from users) t1 where user_is_following_base_user != '' and concat(first_name, ' ', last_name) like concat(:search_term,'%') limit 15 offset :row_offset");
$prepared->bindParam(":user_id", $_SESSION["user_id"], PDO::PARAM_INT);
$prepared->bindParam(":post_id", $_GET["post_id"], PDO::PARAM_INT);
$prepared->bindParam(":search_term", $_GET["search_term"]);
$_GET["row_offset"] = (int) $_GET["row_offset"];
$prepared->bindParam(":row_offset", $_GET["row_offset"], PDO::PARAM_INT);
$prepared->execute();

$results_arr = $prepared->fetchAll();

foreach($results_arr as $friend_arr) {

// if target has delete or deactivated their account, or the current user has been blocked by the target.
if($con->query("select id from account_states where user_id = ". $friend_arr["id"])->fetch()[0] != "" || $con->query("select id from blocked_users where user_ids = '".$friend_arr["id"]. "-" . $_SESSION["user_id"]."'")->fetch() != "") {	
continue;
}

$friend_avatar_arr = $con->query("SELECT positions, rotate_degree FROM avatars WHERE id_of_user = ". $friend_arr["id"] ." order by id desc limit 1")->fetch();

$friend_avatar_positions = explode(",",$friend_avatar_arr["positions"]);
//if avatar positions does not exist 
if(count($friend_avatar_positions) < 2) {
$friend_avatar_positions = [0,0];
}

array_push($echo_arr, [
"id" => $friend_arr["id"],
"first_name" => $friend_arr["first_name"],
"last_name" => $friend_arr["last_name"],
"avatar_picture" => $friend_arr["avatar_picture"],
"avatar_rotate_degree" => $friend_avatar_arr["rotate_degree"],
"avatar_positions" => $friend_avatar_positions,
"current_state" => $friend_arr["current_state"]
]);

}

}

echo json_encode($echo_arr);

unset($con);


?>