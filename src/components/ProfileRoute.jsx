
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserAuth } from '@/AuthContext';
import { hasProfile } from '@/services/ProfileCheck';

const ProfileRoute = ({ requireProfile = true }) => {
  const { session } = UserAuth();
  const [profileExists, setProfileExists] = useState(null);
  
  useEffect(() => {
    if(!session) return;
    let cancelled = false;

    const checkProfile = async () => {
      try {
        const exists = await hasProfile(session.user.id);
        console.log('Profile exists:', exists);
        console.log('Current route requires profile:', requireProfile);

        if (!cancelled) {
          setProfileExists(exists);
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      }
    };

    setProfileExists(null);
    checkProfile();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id, requireProfile]);

  if (!session?.user) return (<Navigate to ="/about" replace/>);

  if (profileExists === null) {
    return <p>Checking profile...</p>;
  }

  if (requireProfile && !profileExists) {
      console.log('Redirecting to setup because profile does not exist');
      return <Navigate to="/setup" replace />;
  }

  if (!requireProfile && profileExists) {
      console.log('Redirecting to home because profile exists');
      return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default ProfileRoute;
