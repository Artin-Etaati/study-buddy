import y from "@/assets/y.png"
import classes from "./Chats.module.css"
import { useNavigate } from "react-router-dom"
import { UserAuth } from "../../../AuthContext";

export default function chatCard ({row}) {
        const navigate = useNavigate();
        const {session} = UserAuth();

        const matchedUser = session.user.id===row.user1_id ? row.user2 : row.user1;
        const isSenderSelf = session.user.id === row.last_message_sender;

        
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
    <div className={classes.card} onClick={()=>navigate(`/messages/${matchedUser.id}`)} key={matchedUser.id}>
      <div className={classes.pictureContainer}>
        <img 
          src={y} 
          alt="temp" 
          className={classes.picture}
        />
      </div>

      <div className={classes.content}>
        <div className={classes.cardheader}>
          <span className={classes.Username}>{matchedUser.first_name}</span>
          <span className={classes.Username}>{time}</span>
        </div>
        <p className={classes.message}>{isSenderSelf ? 'You' : matchedUser.first_name}:{row.last_message_content}</p>
      </div>
    </div>
    )
}