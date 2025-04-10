import { supabase } from '../lib/supabase';

export async function uploadImage(image: { uri: string; name?: string; type?: string }) {
  const response = await fetch(image.uri);
  const blob = await response.blob();

  const fileName = `${Date.now()}-${image.name || 'upload.jpg'}`;

  const { data, error } = await supabase.storage
    .from('images') // название бакета
    .upload(`public/${fileName}`, blob, {
      contentType: image.type || 'image/jpeg',
      upsert: true,
    });

  if (error) {
    throw new Error('Image upload failed: ' + error.message);
  }

  const { data: publicUrl } = supabase.storage
    .from('images')
    .getPublicUrl(`public/${fileName}`);

  return publicUrl?.publicUrl;
}
