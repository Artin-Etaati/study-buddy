import y from "@/assets/y.png"
import classes from "./Messages.module.css"

export default function MessageCard ({picture, name}) {
       return (
    <div className={classes.card}>
      <div className={classes.pictureContainer}>
        <img 
          src={y} 
          alt="temp" 
          className={classes.picture}
        />
      </div>

      <div className={classes.content}>
        <div className={classes.cardheader}>
          <span className={classes.Username}>{name}</span>
        </div>
        <p className={classes.message}>temp</p>
      </div>
    </div>
    )
}