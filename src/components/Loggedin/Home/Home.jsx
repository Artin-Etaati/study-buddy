import home from "@/css/LoggedIn/Home.module.css"
import UserPreview from "./UserPreview";
import { supabase } from '@/services/supabase'
import { useEffect, useState } from "react";
import { UserAuth } from '@/AuthContext'
import defaultAvatar from '@/assets/default-avatar.png';

const Home = () => {
  const {userId} = UserAuth()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    if (!userId) return;
    async function getInfo() {
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, profile_picture_name')
      .eq('id', userId)
      .single();
      if(error) {
        console.log("can't get info")
        return;
      }
      setName(data.first_name + " " + data.last_name);

      if (data.profile_picture_name) {
        const { data: photoData, error: photoError } = await supabase.storage
          .from('Profile_Picture')
          .createSignedUrl(data.profile_picture_name, 3600);

        if (photoError) {
          console.error('Error loading profile photo:', photoError);
        } else {
          setProfilePhoto(photoData.signedUrl);
        }
      }   
    }
    getInfo()

  }, [userId])


  return (
    <div className={home.container}>
      <img
        src={profilePhoto || defaultAvatar}
        alt="My Profile"
        className={home.profilePhoto}
      />
      <div className={home.matchContainer}>
        <UserPreview />
      </div>
    </div>
  )
  
};

export default Home