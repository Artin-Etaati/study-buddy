
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserAuth } from '@/AuthContext';
import { hasProfile } from '@/services/profileCheck';

const ProfileRoute = ({ requireProfile = true }) => {
  const { session } = UserAuth();
  const [profileExists, setProfileExists] = useState(null);

  useEffect(() => {
    if (!session?.user) return;

    let cancelled = false;

    const checkProfile = async () => {
      try {
        const exists = await hasProfile(session.user.id);

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
  }, [session?.user?.id]);

  if (profileExists === null) {
    return <p>Checking profile...</p>;
  }

  if (requireProfile && !profileExists) {
    return <Navigate to="/setup" replace />;
  }

  if (!requireProfile && profileExists) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default ProfileRoute;
