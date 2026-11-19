import classes from "./Chats.module.css"
import { useNavigate } from "react-router-dom"
import { UserAuth } from "../../../AuthContext";
import defaultAvatar from '@/assets/default-avatar.png';


//creates each preview of a chat in chatlist
export default function chatCard ({row}) {
        const navigate = useNavigate();
        const {session} = UserAuth();

        //checks if user is user1 or user2 in the prop data
        const matchedUser = session.user.id===row.user1_id ? row.user2 : row.user1;
        //checks if user is the last sender of the message
        const isSenderSelf = session.user.id === row.last_message_sender;

        //manages date of the most recent message
        const date = new Date(row.last_message_time);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const isYesterday = date.toDateString() === yesterday.toDateString();
        let time;
            

        if (isToday || isYesterday) {
          const timeOnly = date.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
          });
          time = `${isToday ? 'Today' : 'Yesterday'} ${timeOnly}`;

        } else {
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          time = `${month}/${day}`;
        }
        

       return (
    <div className={classes.card + " " + (row.is_unread_for_me ? classes.unread : "")} onClick={()=>navigate(`/messages/${matchedUser.id}`)} key={matchedUser.id}>
      <div className={classes.pictureContainer}>
        <img 
          src={row.matchPicture || defaultAvatar} 
          alt="temp" 
          className={classes.picture}
        />
      </div>

      <div className={classes.content}>
        <div className={classes.cardheader}>
          <span className={classes.Username}>{matchedUser.first_name}</span>
          <span className={classes.Username}>{time}</span>
        </div>
        <div className={classes.messagecount}>
          <p className={classes.message}>{isSenderSelf ? 'You' : matchedUser.first_name}:{row.last_message_content}</p>
          {row.my_unread_count > 0 && <span className={classes.unreadCount}>{row.my_unread_count}</span>}
        </div>
      </div>
    </div>
    )
}