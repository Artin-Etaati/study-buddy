import { useEffect, useState } from 'react';
import classes from './notification.module.css';
import y from "@/assets/y.png"
import { UserAuth } from '../../../AuthContext';
import { useOutletContext } from 'react-router-dom';

export default function ChatNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const {session} = UserAuth();
  const {preview, setPreview} = useOutletContext();
  const currentPreview = preview[0];

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

   const matchedUser = session.user.id===currentPreview.user1_id ? currentPreview.user2 : currentPreview.user1; //for profile pic and name
   const content = currentPreview.last_message_content;

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

      <button
        onClick={() => {setIsVisible(false); setPreview((prev)=>prev.slice(1))}}
        className={classes.closeButton}>
          X
      </button>
    </div>
  ));
}