<?php
//users use this file whenever they change their avatar, this file is called via ajax.

require_once "common_requires.php";
require_once "logged_in_importants.php";
require_once "file_upload_custom_functions.php";


$MAXIMUM_USER_PROFILE_AVATAR_IMAGE_SIZE = 5000000;

$MAXIMUM_DAILY_AVATAR_UPLOADS = 15;



$echo_arr = ["" , ""];

if(isset($_FILES["new_avatar"])) {

$daily_avatar_uploads_limit_exceeded = daily_avatar_uploads_limit_exceeded($MAXIMUM_DAILY_AVATAR_UPLOADS);

// the avatar upload limit has not been exceeded.
if($daily_avatar_uploads_limit_exceeded === false) {


//what is going to be the id of the new avatar picture ? we get this by getting the id of the last row and adding 1 to it.
$what_id_query = custom_pdo("SELECT id FROM AVATARS where id_of_user = :base_user_id", [":base_user_id" => $_SESSION["user_id"]])->fetchAll();
$what_id = count($what_id_query) > 0 ? $what_id_query[count($what_id_query)-1]["id"] + 1 : 1;


$storagePath = "../users/". $_SESSION["user_id"] ."/media/"; // this is relative to this script, better use absolute path.
$new_name = $what_id;
$allowedMimes = array('image/png', 'image/jpg', 'image/gif', 'image/pjpeg', 'image/jpeg');

$upload_result = upload($_FILES["new_avatar"]["tmp_name"], $storagePath, $new_name, $allowedMimes, $MAXIMUM_USER_PROFILE_AVATAR_IMAGE_SIZE);

// if upload failed
if(!is_array($upload_result) || count($upload_result) < 2 || $upload_result[0] !== true) {
$echo_arr[1] = $upload_result;
} 
else {
	
// this is supposed to be the new path to the uploaded file, if the upload is successful.
$new_path = "users/". $_SESSION["user_id"] ."/media/" . $new_name . "." . $upload_result[1];	

//add a new row to the avatars table, check if it is successful.
$insert_into_avatars = custom_pdo("INSERT INTO AVATARS (id_of_user,avatar_path,date_of) values(:base_user_id, :new_path, :date_of)", [":base_user_id" => $_SESSION["user_id"], ":new_path" => $new_path, ":date_of" => date("Y/m/d H:i")]);

//if query was successful
if($insert_into_avatars->rowCount() > 0) {
	
//change the user's avatar_picture column in the users table
$update_users = custom_pdo("UPDATE USERS SET avatar_picture = :new_path where id = :base_user_id", [":new_path" => $new_path, ":base_user_id" => $_SESSION["user_id"]]);

//if query was successful
if($update_users->rowCount() > 0) {
$echo_arr[0] = htmlspecialchars($new_path, ENT_QUOTES, "utf-8");
}	
else {
$echo_arr[1] = "Something Went Wrong, Sorry :(";
}
}
// if there was an sql error
else {
$echo_arr[1] = "Something Went Wrong, Sorry :(";
}

}

}
// the avatar upload limit has been exceeded.
else {
$echo_arr[1] = "You are uploading too many avatars, which costs us a lot! Please wait until tomorrow before you upload another avatar!";	
}
	
}


echo json_encode($echo_arr);



/* if the user has uploaded more than $amount images in less than $period seconds, returns the time the user has to wait before they can upload another image in seconds, otherwise
returns false. */
function daily_avatar_uploads_limit_exceeded($limit) {
global $con;	
$background_uploads_today = custom_pdo("SELECT count(*) from avatars where id_of_user = :base_user_id and date_of like concat(:date_of,' %')", [":base_user_id" => $_SESSION["user_id"], ":date_of" => date("Y/m/d")])->fetch()[0];
return ($background_uploads_today >= $limit ? true : false);
}


unset($con);

?>