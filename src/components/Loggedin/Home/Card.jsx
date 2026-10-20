import card from "@/css/LoggedIn/Card.module.css"
import { useEffect } from "react"
import { supabase } from '@/services/supabase'
import defaultAvatar from '@/assets/default-avatar.png';

// name
// age
// photo

function Card({profile}) {

    return (
        <div className={card.container}>
            <div className={card.description}>
                <h2 className={card.text}>{profile.first_name}</h2>
                <h2 className={card.text}>{profile.birthday}</h2>
            </div>
                <img className={card.img} src={profile.profile_picture_url || defaultAvatar} alt="Profile picture"/>
            <div className={card.info_container}>
                <p className={card.text + " " + card.info}>{profile.major}</p>
                <p className={card.text + " " + card.info}>{profile.study_style}</p>
            </div>
        </div>
    )
}


export default Card