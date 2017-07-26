<?php
require_once "common_requires.php";

// deal with session fixation
session_regenerate_id(true);

$echo_arr = [0,""];

if(isset($_POST["login_user_name_or_email"]) && isset($_POST["login_password"])) {
	
$login_user_name_or_email = trim($_POST["login_user_name_or_email"]);
$login_password = $_POST["login_password"];

$bad_login_limit = 6;// if user tries 6 times to login and fails, prevent him from retrying.
$lockout_time = 300; //the number of seconds the user will be locked out.

//current info about user login fails and login counts.
$first_failed_login = custom_pdo("select first_failed_login from users where user_name = :user_name_or_email or email_address = :user_name_or_email", [":user_name_or_email" => $login_user_name_or_email])->fetch()[0];
$failed_login_count = custom_pdo("select failed_login_count from users where user_name = :user_name_or_email or email_address = :user_name_or_email", [":user_name_or_email" => $login_user_name_or_email])->fetch()[0];

//if user is currently locked out.
if(($failed_login_count >= $bad_login_limit) && (time() - $first_failed_login < $lockout_time)) {
$echo_arr[1] = "Materialize.toast('Please Try Again In ". date("i:s", (($first_failed_login + $lockout_time)-time())) ." Minute(s).',5000,'red');";		
}	
else {	

// initialize the login regex checks
$check_login_user_name_or_email = new ValidateItem($login_user_name_or_email,"/^([a-zA-Z]+[0-9 ]*){6,36}$/i","Wrong info"); 
$check_login_email_address = new ValidateItem(
$login_user_name_or_email,
<<<'EOT'
/^(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){255,})(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){65,}@)(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22))(?:\.(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22)))*@(?:(?:(?!.*[^.]{64,})(?:(?:(?:xn--)?[a-z0-9]+(?:-[a-z0-9]+)*\.){1,126}){1,}(?:(?:[a-z][a-z0-9]*)|(?:(?:xn--)[a-z0-9]+))(?:-[a-z0-9]+)*)|(?:\[(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7})|(?:(?!(?:.*[a-f0-9][:\]]){7,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?)))|(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){5}:)|(?:(?!(?:.*[a-f0-9]:){5,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3}:)?)))?(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))(?:\.(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))){3}))\]))$/i
EOT
,"Wrong info"); 
$check_login_password = new ValidateItem($login_password,"/^(?=.*[A-Za-z])(?=.*\d)(?=.*([$@$!%*#?& ]*))[A-Za-z\d($@$!%*#?& )*]{8,50}$/i","Wrong info"); 

// if the login_user_name_or_email is neither a valid  username or a valid email address or the password is invalid, append a toast to the "toasts" session.
if(($check_login_user_name_or_email->validate() == false && $check_login_email_address->validate() == false) || $check_login_password->validate() == false) {
$echo_arr[1] = "Materialize.toast('Wrong info',5000,'red');";		

if(time() - $first_failed_login > $lockout_time) {
// first unsuccessful login since $lockout_time on the last one expired
custom_pdo("update users set first_failed_login = :time where user_name = :user_name_or_email or email_address = :user_name_or_email", [":time" => time(), ":user_name_or_email" => $login_user_name_or_email]);
custom_pdo("update users set failed_login_count = 1 where user_name = :user_name_or_email or email_address = :user_name_or_email", [":user_name_or_email" => $login_user_name_or_email]);
} 
else {
custom_pdo("update users set failed_login_count = (failed_login_count + 1) where user_name = :user_name_or_email or email_address = :user_name_or_email", [":user_name_or_email" => $login_user_name_or_email]);
}	
}
else {
$prepared = $con->prepare("SELECT * FROM users WHERE user_name = :user_name_or_email or (email_address = :user_name_or_email and activated = 'true')");
$prepared->bindParam(":user_name_or_email",$login_user_name_or_email);
$prepared->execute();
$login_arr = $prepared->fetch();

if( $login_arr[0] == "" || !password_verify($login_password,$login_arr["password"])) {
$echo_arr[1] = "Materialize.toast('Wrong info',5000,'red');";	
if(time() - $first_failed_login > $lockout_time) {
// first unsuccessful login since $lockout_time on the last one expired
custom_pdo("update users set first_failed_login = :time where user_name = :user_name_or_email or email_address = :user_name_or_email", [":time" => time(), ":user_name_or_email" => $login_user_name_or_email]);
custom_pdo("update users set failed_login_count = 1 where user_name = :user_name_or_email or email_address = :user_name_or_email", [":user_name_or_email" => $login_user_name_or_email]);
} 
else {
custom_pdo("update users set failed_login_count = (failed_login_count + 1) where user_name = :user_name_or_email or email_address = :user_name_or_email", [":user_name_or_email" => $login_user_name_or_email]);
}	

}	
else {
	
$_SESSION["user_id"] = $login_arr["id"];

if(custom_pdo("SELECT * FROM account_states WHERE (type = 'deactivate' or type = 'delete') AND user_id = :user_id", [":user_id" => $login_arr["id"]])->fetch()[0] != "") {
custom_pdo("DELETE FROM account_states WHERE (type = 'deactivate' or type = 'delete') AND user_id = :user_id limit 1", [":user_id" => $login_arr["id"]]);	
}
else {
$echo_arr[0] = 1;	
}

}

}

}

}


echo json_encode($echo_arr);

unset($con);


?>