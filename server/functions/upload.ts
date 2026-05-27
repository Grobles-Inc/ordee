import { uploadImage, deleteImage, getPublicIdFromUrl } from "~/server/utils/cloudinary";

export async function uploadMealImage(file: string, fileName: string) {
  const buffer = Buffer.from(file, "base64");
  const result = await uploadImage(buffer, "ordee/meals");
  return result;
}

export async function deleteMealImage(imageUrl: string) {
  const publicId = getPublicIdFromUrl(imageUrl);
  if (publicId) {
    await deleteImage(publicId);
  }
  return { success: true };
}
