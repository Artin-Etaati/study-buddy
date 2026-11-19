
import { useEffect, useState } from 'react';
import defaultAvatar from '@/assets/default-avatar.png';

const EditPhoto = ({ currentPhoto, photo, setPhoto, removePhoto, setRemovePhoto }) => {
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

    setPhoto(file);
    setRemovePhoto(false);
    setError('');
    e.target.value = '';
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setRemovePhoto(true);
    setError('');
  };

  const displayedPhoto = removePhoto
    ? defaultAvatar
    : preview || currentPhoto || defaultAvatar;

  return (
    <div>
      <h3>Profile Photo</h3>

      <img
        src={displayedPhoto}
        alt="Profile preview"
        width="150"
        height="150"
      />

      <div>
        <label htmlFor="editProfilePhoto">
          Choose Photo
        </label>

        <input
          id="editProfilePhoto"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handlePhotoChange}
        />

        {(photo || (!removePhoto && currentPhoto)) && (
          <button type="button" onClick={handleRemovePhoto}>
            Remove Photo
          </button>
        )}
      </div>

      <p>JPG, PNG, or WebP (Max 5 MB)</p>

      {error && <p>{error}</p>}
    </div>
  );
};

export default EditPhoto;
