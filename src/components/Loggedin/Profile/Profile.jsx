
import { useEffect, useState } from 'react';
import { UserAuth } from '@/AuthContext';
import { getProfile } from '@/services/profileService';
import { supabase } from '@/services/supabase';
import defaultAvatar from '@/assets/default-avatar.png';

const Profile = () => {
  const { userId } = UserAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    const loadProfile = async () => {
      try {
        const data = await getProfile(userId);

        // create a sgined url for the profile photo
        let photoUrl = null;
        if (data.profile_picture_name) {
          const { data: photoData, error: photoError } =
            await supabase.storage
              .from('Profile_Picture')
              .createSignedUrl(data.profile_picture_name, 3600);

          if (photoError) {
            console.error('Error loading profile photo:', photoError);
          } else {
            photoUrl = photoData.signedUrl;
          }
        }


        if (!cancelled) {
          setProfile(data);
          setProfilePhoto(photoUrl);
          console.log('Profile data:', data);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Error loading profile:', error);
          setError(error.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) return <h2>Loading profile...</h2>;
  if (error) return <h2>Error: {error}</h2>;


  return (
    <div>
      <h1>My Profile</h1>
      
      <img
        src={profilePhoto || defaultAvatar}
        alt="Profile"
        style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          objectFit: 'cover'
        }}
      />

      <section>
        <h2>Personal Information</h2>

        <p>First Name: {profile.first_name}</p>
        <p>Last Name: {profile.last_name}</p>
        <p>Birthday: {profile.birthday}</p>
        <p>Gender: {profile.gender}</p>
        <p>University: {profile.universities?.name}</p>
        <p>Major: {profile.majors?.name}</p>
      </section>

      <section>
        <h2>Current Courses</h2>

        {profile.user_courses?.map((item) => (
          <p key={item.course_id}>
            {item.courses?.course_code}
          </p>
        ))}
      </section>

      <section>
        <h2>Study Preferences</h2>

        <p>Study Style: {profile.study_style}</p>
      </section>
    </div>
  );

};

export default Profile;
