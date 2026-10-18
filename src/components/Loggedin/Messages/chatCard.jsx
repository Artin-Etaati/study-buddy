import y from "@/assets/y.png"
import classes from "./Messages.module.css"
import { useNavigate } from "react-router-dom"

export default function chatCard ({user}) {
        const navigate = useNavigate();
       return (
    <div className={classes.card} onClick={()=>navigate(`/messages/${user.id}`)}>
      <div className={classes.pictureContainer}>
        <img 
          src={y} 
          alt="temp" 
          className={classes.picture}
        />
      </div>

      <div className={classes.content}>
        <div className={classes.cardheader}>
          <span className={classes.Username}>{user.first_name}</span>
        </div>
        <p className={classes.message}>temp</p>
      </div>
    </div>
    )
}