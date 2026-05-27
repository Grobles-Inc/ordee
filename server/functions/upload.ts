import { createServerFn } from "@tanstack/react-start";
import { uploadImage, deleteImage, getPublicIdFromUrl } from "~/server/utils/cloudinary";

export const uploadMealImage = createServerFn({ method: "POST" })
  .validator((data: { file: string; fileName: string }) => data)
  .handler(async ({ data }) => {
    const buffer = Buffer.from(data.file, "base64");
    const result = await uploadImage(buffer, "ordee/meals");
    return result;
  });

export const deleteMealImage = createServerFn({ method: "POST" })
  .validator((data: { imageUrl: string }) => data)
  .handler(async ({ data }) => {
    const publicId = getPublicIdFromUrl(data.imageUrl);
    if (publicId) {
      await deleteImage(publicId);
    }
    return { success: true };
  });
