
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
