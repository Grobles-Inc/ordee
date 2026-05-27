export async function uploadMealImage(file: string, fileName: string) {
  const formData = new FormData();
  formData.append("file", `data:image/jpeg;base64,${file}`);
  formData.append("upload_preset", "ordee_unsigned"); // Create this in Cloudinary dashboard
  formData.append("folder", "ordee/meals");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  const data = await response.json();
  return { url: data.secure_url, publicId: data.public_id };
}

export async function deleteMealImage(imageUrl: string) {
  // Client-side deletion requires signed API call
  // For now, we'll skip deletion or implement via API route
  console.warn("Image deletion not implemented for client-side");
  return { success: true };
}
