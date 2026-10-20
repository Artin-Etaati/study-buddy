
import { useEffect, useState } from 'react';
import classes from '@/css/Setup/Setup.module.css';
import defaultAvatar from '@/assets/default-avatar.png';

const ProfilePhoto = ({ photo, setPhoto }) => {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!photo) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(photo);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please select a JPG, PNG, or WebP image.');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Photo must be smaller than 5 MB.');
      e.target.value = '';
      return;
    }

    setError('');
    setPhoto(file);
  };

  return (
    <div className ={classes.photoSection}>
      <h3>Profile Photo (Optional)</h3>

      <img
        className={classes.photoPreview}
        src={preview || defaultAvatar}
        alt="Profile preview"
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          objectFit: 'cover'
        }}
      />

      <div>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handlePhotoChange}
        />

        {photo && (
          <button
            type="button"
            onClick={() => {
              setPhoto(null);
              setError('');
            }}
          >
            Remove Photo
          </button>
        )}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ProfilePhoto;
