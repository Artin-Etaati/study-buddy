import classes from '@/css/Loggedin/Matches.module.css'
import {useState} from "react";
import defaultAvatar from '@/assets/default-avatar.png';
import ProfileModal from  '@/components/Loggedin/Matches/ProfileModal.jsx'
const MatchCard =({match, removeMatch}) => {
    const [isOpen, setIsOpen] = useState(false);
    return(
<div className={classes.matchCard} key={match.id}>
<div className={classes.avatar}>
<img src={match.profile_picture_url || defaultAvatar} alt="User Avatar" />
</div>
<div className={classes.matchinfo}>
<h2> {match.first_name} {match.last_name}</h2>
<p>Major: {match.major}</p>
</div>
<div className={classes.matchProfile}>
<button onClick={() => setIsOpen(match)}>View Profile</button>
<button onClick={() => removeMatch(match.id)}>
Remove Match
</button>
</div>
{isOpen && 
( <ProfileModal match={match} setIsOpen={setIsOpen}/>)} 
</div>
)}
export default MatchCard;