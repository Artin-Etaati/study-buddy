
import { supabase } from './supabase';

export const uploadProfilePhoto = async (photo, userId) => {
  if (!photo) return null;

  const fileExtension = photo.name.split('.').pop().toLowerCase();
  const filePath = `${userId}/${crypto.randomUUID()}.${fileExtension}`;

  const { data, error } = await supabase.storage
    .from('Profile_Picture')
    .upload(filePath, photo, {
      contentType: photo.type,
    });

  if (error) {
    throw error;
  }

  return data.path;
};


export const updateProfilePhoto = async (
  userId,
  newPhoto,
  removePhoto,
  oldPhotoPath
) => {
  // Nothing to change
  if (!newPhoto && !removePhoto) return null;

  let newPhotoPath = null;

  // 1. Upload the new photo if one was selected
  if (newPhoto) {
    newPhotoPath = await uploadProfilePhoto(newPhoto, userId);
  }

  // 2. Update the database
  const { error } = await supabase
    .from('profiles')
    .update({
      profile_picture_name: newPhotoPath
    })
    .eq('id', userId);

  if (error) {
    // Clean up the newly uploaded photo if database update fails
    if (newPhotoPath) {
      const { error: cleanupError } = await supabase.storage
        .from('Profile_Picture')
        .remove([newPhotoPath]);

      if (cleanupError) {
        console.error('Failed to clean up new photo:', cleanupError);
      }
    }

    throw error;
  }

  // 3. Delete the old photo only after the database update succeeds
  if (oldPhotoPath && oldPhotoPath !== newPhotoPath) {
    const { error: deleteError } = await supabase.storage
      .from('Profile_Picture')
      .remove([oldPhotoPath]);

    if (deleteError) {
      console.error('Failed to delete old photo:', deleteError);
    }
  }

  return newPhotoPath;
};