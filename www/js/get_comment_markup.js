
/* we have moved this function to a separate file because it is called by 2 different files, it would be inappropriate if 2 
files used a function equally but it belonged to one of them, it makes more sense if it it belongs to its own file */

var comment_owner_vote = ["a","b","c","d"];


// potential bug awaiting (data['comment_by_base_user'] == true)
function get_comment_markup(data, comment_or_reply) {
																
var random_num = Math.floor(Math.random() * 1000000);	

var commenter_avatar_id = "avatar" + random_num;
var comment_settings_id = "commentSettings" + random_num;

var comment_owner_full_name = data["comment_owner_info"]["first_name"] + " " + data["comment_owner_info"]["last_name"];
	
return `<div class='singleComment scaleHorizontallyCenteredItem row dont_change_parent_background_when_clicked_parent' data-actual-comment-id='` + data["comment_id"] + `'>
` + (data["comment_by_base_user"] == true ? 
`<a href='#' class='dropdown-button deleteCommentButton' data-activates='` + comment_settings_id + `'></a>
<!-- Dropdown Structure -->
<ul id='` + comment_settings_id + `' class='dropdown-content'>
<li><a href='#!' class='` + (comment_or_reply == 0 ? "deleteComment" : "deleteReply") + `' data-comment-id='` + data["comment_id"] + `'>Delete</a></li>
</ul>` : "") + `
<div class='commenterAvatarContainerParent col l1 m1 s2'>
<div class='avatarContainer commenterAvatarContainer dont_change_parent_background_when_clicked'>
<div class='avatarContainerChild commenterAvatarContainerChild showUserModal modal-trigger' data-user-id='` + data["comment_owner_info"]["id"] + `' data-target='user_modal'>
<div class='rotateContainer' style='margin-top:` + data["comment_owner_info"]["avatar_positions"][0] + `%;margin-left:` + data["comment_owner_info"]["avatar_positions"][1] + `%;'>
<div class='avatarRotateDiv ` + (data["comment_by_base_user"] == true ? `baseUserAvatarRotateDivs` : ``) + `' data-rotate-degree='` + data["comment_owner_info"]["avatar_rotate_degree"] + `' style='transform:rotate(` + data["comment_owner_info"]["avatar_rotate_degree"] + `deg)'>
<img id='` + commenter_avatar_id + `' class='avatarImages commenterAvatarImages' src='` + (data["comment_owner_info"]["avatar_picture"] != "" ? data["comment_owner_info"]["avatar_picture"] : LetterAvatar(data["comment_owner_info"]["first_name"], 120)) + `' alt='Image'/>
</div></div>
</div><!-- end .avatarContainerChild -->
</div><!-- end .avatarContainer -->
</div><!-- end .commenterAvatarContainerParent -->

<div class='actualComment col l10 m10 s10'>
<a href='#modal1' class='commenterFullName showUserModal dont_change_parent_background_when_clicked modal-trigger ` + (data["comment_by_poster"] == true ? "commentByPoster" : "") + `' data-user-id='` + data["comment_owner_info"]["id"] + `' data-target='user_modal'><span class='` + (data["comment_by_base_user"] == true ? "baseUserFullNameContainers" : "") + `'>` + comment_owner_full_name + `</span></a><!-- end .commenterFullName -->
` + (data["comment_owner_vote"] != "" ? ("<span class='commenterVotedThis'>" + comment_owner_vote[data["comment_owner_vote"]] + "</span>") : "") + `
<div class='actualCommentComment' >` + (data["is_reply_to"].length >= 2 ? "<a href='#' class='replyToFullname modal-trigger showUserModal dont_change_parent_background_when_clicked' data-user-id='" + data["is_reply_to"][0] + "' data-target='user_modal'>" + data["is_reply_to"][1] + " </a>" : "") + data["comment_text"] + `</div>

<div class='postCommentActions' data-comment-id='` + data["comment_id"] + `'>
<a href='#` + (comment_or_reply == 0 ? "commentRepliesModal" : "") + `' class='dont_change_parent_background_when_clicked ` + (comment_or_reply == 0 ? "modal-trigger addReplyToComment' data-comment-id='" + data["comment_id"] + "'" : "addReplyToReply' data-commenter-id='" + data["comment_owner_info"]["id"] + "' data-commenter-full-name='" + comment_owner_full_name + "'") + ">Reply" + "&nbsp;&nbsp;<span class='commentActionNums reply_button_total_replies' data-total-number='" + data["comment_replies_num"] + "'>" +  (data["comment_replies_num"] > 0 ? ("(" + data["comment_replies_num"] + ")") : "") + "</span>" + `</a>
<a href='#' class='waves-effect waves-lightgrey dont_change_parent_background_when_clicked upvoteOrDownvote ` + (data["base_user_upvoted_comment"] == 1 ? "upvoteOrDownvoteActive" : "") + `' data-upvote-or-downvote='upvote'><i class='material-icons'>arrow_upward</i></a> <span class='commentUpvotes commentActionNums'>` + (data["comment_upvotes_num"] > 0 ? "(" + data["comment_upvotes_num"] + ")" : "") + `</span>
<a href='#' class='waves-effect waves-lightgrey dont_change_parent_background_when_clicked upvoteOrDownvote ` + (data["base_user_downvoted_comment"] == 1 ? "upvoteOrDownvoteActive" : "") + `' data-upvote-or-downvote='downvote'><i class='material-icons'>arrow_downward</i></a> <span class='commentDownvotes commentActionNums'>` + (data["comment_downvotes_num"] > 0 ? "(" + data["comment_downvotes_num"] + ")" : "") + `</span>
<span class='commentDate'>` + data["comment_time_string"] + `</span>
</div><!-- end .postCommentActions -->

</div>
</div>

<script>
	$('#` + commenter_avatar_id + `').on('load',function(){
		fitToParent($(this));
		adaptRotateWithMargin($(this), ` + data["comment_owner_info"]["avatar_rotate_degree"] + `,false);
	});
</script>`;
}

