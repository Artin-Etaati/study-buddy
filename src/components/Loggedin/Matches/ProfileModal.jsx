import classes from '@/css/Loggedin/Matches.module.css'
import defaultAvatar from '@/assets/default-avatar.png';
import {createPortal} from "react-dom";
const ProfileModal = ({match, setIsOpen}) => {
    return createPortal(
<div className={classes.profileModal}>
<div className={classes.profileContent}>
<div className={classes.modalAvatar}>
<img src={match.profile_picture_url ||defaultAvatar} alt="User Avatar" />
</div>

<div className={classes.profileHeader}>
<h2>{match.first_name} {match.last_name}</h2>
<p>Major: {match.major}</p>
</div>

<hr className={classes.profileLine} />

<div className={classes.profileDetails}>
<h3><strong>Gender:</strong> {match.gender}</h3> <h3><strong>Study Style:</strong> {match.study_style}</h3>
</div>
<div className = {classes.aboutMe}>
<p>About Me: {match.bio}</p>
</div>
<div className = {classes.profileClasses}>
<p>Courses: {match.user_courses}</p>
</div>
<div className = {classes.closeButton}>
<button onClick={() => setIsOpen(false)}> ✕ </button>
</div>
</div>
</div>,
document.body
)}
export default ProfileModal;