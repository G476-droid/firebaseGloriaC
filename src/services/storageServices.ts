import { supabase } from "./supabaseConfig";

const BUCKET_NAME = "species-images";

export const uploadSpeciesImage = async (
  localUri: string,
  speciesId: string,
): Promise<{ imageUrl: string; imagePath: string } | null> => {
  try {
    const fileExt = localUri.split(".").pop()?.toLowerCase() || "jpg";
    const contentType = fileExt === "png" ? "image/png" : "image/jpeg";
    const imagePath = `${speciesId}/${Date.now()}.${fileExt}`;

    const response = await fetch(localUri);
    const arrayBuffer = await response.arrayBuffer();

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(imagePath, arrayBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.log("ERROR STORAGE:", error);
      return null;
    }

    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(imagePath);

    return {
      imageUrl: data.publicUrl,
      imagePath,
    };
  } catch (error) {
    console.log("Error uploadSpeciesImage:", error);
    return null;
  }
};

export const deleteSpeciesImage = async (
  imagePath: string,
): Promise<void> => {
  if (!imagePath) return;

  const { error } = await supabase.storage
    .from("species-images")
    .remove([imagePath]);

  if (error) {
    console.log("Error deleteSpeciesImage:", error);
    throw error;
  }
};