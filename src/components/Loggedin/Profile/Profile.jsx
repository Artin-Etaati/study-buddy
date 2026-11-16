
import { useEffect, useState, useRef } from 'react';
import { UserAuth } from '@/AuthContext';
import { getProfile, getMajors, updateProfile } from '@/services/profileService';
import { supabase } from '@/services/supabase';
import defaultAvatar from '@/assets/default-avatar.png';
import Edit from './Edit';

const Profile = () => {
  const { userId } = UserAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [majors, setMajors] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);



  useEffect(() => {
    const loadMajors = async () => {
      try {
        const data = await getMajors();
        setMajors(data);
      } catch (error) {
        console.error('Error loading majors:', error);
      }
    };

    if (userId) {
      loadMajors();
    }
  }, [userId]);

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


  const handleSave = async (formData) => {

    if (savingRef.current) return;

    savingRef.current = true;
    setIsSaving(true);

    try {
      const updatedProfile = await updateProfile(userId, formData);

      const selectedMajor = majors.find(
        (item) => item.id === updatedProfile.major_id
      );

      setProfile((prev) => ({
        ...prev,
        ...updatedProfile,
        majors: selectedMajor
          ? { name: selectedMajor.name }
          : prev.majors
      }));

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to save profile changes.');
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };


  if (loading) return <h2>Loading profile...</h2>;
  if (error) return <h2>Error: {error}</h2>;

  if (isEditing) {
    return (
      <Edit
        profile={profile}
        majors={majors}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
        isSaving={isSaving}
      />
    );
  }


  return (
    <div>
      <h1>My Profile</h1>

      <button onClick={() => setIsEditing(true)}>
        Edit Profile
      </button>

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
