<?php

require_once "common_requires.php";
require_once "logged_in_importants.php";
require_once "file_upload_custom_functions.php";


if(isset($_POST["title"]) && isset($_POST["type"]) && filter_var($_POST["type"], FILTER_VALIDATE_INT) !== false && count($_FILES) > 0) {

//this is the path of the images after upload
$upload_to = "../posts/";
$counter = 0;
$file_types = "";

//what is going to be the id of the new post ? we get this by getting the id of the last row and adding 1 to it.
$what_id_query = $con->query("SHOW TABLE STATUS LIKE 'posts'")->fetch();
$what_id = $what_id_query["Auto_increment"];

foreach($_FILES as $file) {

$storagePath = '../posts/'; // this is relative to this script, better use absolute path.
$new_name = $what_id . "-" . $counter;
$allowedMimes = array('image/png', 'image/jpg', 'image/gif', 'image/pjpeg', 'image/jpeg');

$upload_result = upload($file["tmp_name"], $storagePath, $new_name, $allowedMimes, 5000000);
if(!is_array($upload_result) || count($upload_result) < 2 || $upload_result[0] !== true) {
echo $upload_result;
die();
} 
else {	
if($counter != 0) {
$file_types .= ",";	
}
$file_types .= $upload_result[1];	
}

$counter++;
}
   
$post_time = time();

// output the post tags from the title into $post_tags
$matches = [];
preg_match_all("/(#\w+)/", $_POST["title"], $matches, PREG_PATTERN_ORDER);
$post_tags = implode("," , $matches[0]);

$prepared = $con->prepare("insert into posts (title,tags,type,file_types,time,posted_by) values(:title,:tags,:type,:file_types,:time,:posted_by)");
$prepared->bindParam(":title",$_POST["title"]);
$prepared->bindParam(":tags",$post_tags);
$prepared->bindParam(":type",$_POST["type"]);
$prepared->bindParam(":file_types",$file_types);
$prepared->bindParam(":time",$post_time);
$prepared->bindParam(":posted_by",$_SESSION["user_id"]);

if($prepared->execute()) {
echo $con->lastInsertId();	
}
	
}




?>