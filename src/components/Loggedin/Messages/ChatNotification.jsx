import { useEffect, useState } from 'react';
import classes from './ChatNotification.module.css';
import y from "@/assets/y.png"
import { UserAuth } from '../../../AuthContext';

export default function ChatNotification({preview, setPreview}) {
  //takes props as thats the only way to pass down the preview data from layout

  const [isVisible, setIsVisible] = useState(false);
  const {session} = UserAuth();
  const currentPreview = preview[0];

  //this useeffect is to check if a notification needs to be shown
  //if yes it will take the preview array and display the most recent one as a notification for 4 seconds
  useEffect(() => {
    if (!currentPreview) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    const timer = setTimeout(() => {
      setPreview((prev)=>prev.slice(1))
      setIsVisible(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [currentPreview]); 

  if(!currentPreview) {return}

  //for profile pic and name
   const matchedUser = session.user.id===currentPreview.user1_id ? currentPreview.user2 : currentPreview.user1; 
   const content = currentPreview.last_message_content;

  //if visible show the notification
  return (isVisible && (
    <div
      className={classes.notification + " " + (isVisible ? classes.visible : '')}>
      <img
        src={y}
        alt={`${matchedUser.first_name}'s picture`}
        className={classes.picture}
      />

      <div className={classes.content}>
        <h4 className={classes.senderName}>
          {matchedUser.first_name}
        </h4>
        <p className={classes.message}>
          {content}
        </p>
      </div>
      {/*button for dismissing the notification */}
      <button
        onClick={() => {setIsVisible(false); setPreview((prev)=>prev.slice(1))}}
        className={classes.closeButton}>
          X
      </button>
    </div>
  ));
}