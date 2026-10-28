import classes from '@/css/Loggedin/Matches.module.css'
import {useState} from "react";
import { useState } from "react";
import defaultAvatar from '@/assets/default-avatar.png';
const MatchCard =({match, removeMatch}) => {
    const [isOpen, setIsOpen] = useState(false);
    return(
<div className={classes.matchCard} key={match.id}>
<div className={classes.avatar}>
<img src={match.profile_picture_url || defaultAvatar} alt="User Avatar" 
onError ={(e) => {
 e.currentTarget.oneError = null;
 e.currentTarget.src = defaultAvatar;
  }}
/>
</div>
<div className={classes.matchinfo}>
<h2> {match.first_name} {match.last_name}</h2>
<p>Major: {match.major}</p>
</div>

<div className={classes.matchProfile}>
<button onClick={() => setIsOpen(match)}>View Profile</button>
{isOpen?.id == match.id && (
<div className={classes.profileModal}>
<div className={classes.profileContent}>
<div className={classes.modalAvatar}>
<img src={match.profile_picture_url ||defaultAvatar} alt="User Avatar" 
 onError ={(e) => {
e.currentTarget.oneError = null;
e.currentTarget.src = defaultAvatar;
 }}/>
</div>

<div className={classes.profileHeader}>
<h2>{match.first_name} {match.last_name}</h2>
<p>Major: {match.major}</p>
</div>

<hr className={classes.profileLine} />

<div className={classes.profileDetails}>
<p>About Me: {match.bio}</p>
</div>
                      
<button onClick={() => setIsOpen(false)}>Close</button>
</div>
</div>
)}
<button onClick={() => removeMatch(match.id)}>
Remove Match
</button>
</div>
</div>
)}
export default MatchCard;