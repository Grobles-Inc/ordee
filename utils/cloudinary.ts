import * as Crypto from "expo-crypto";
export const getPublicIdFromUrl = (url: string) => {
  const splitUrl = url.split("/");
  const filename = splitUrl[splitUrl.length - 1];
  return filename.split(".")[0];
};

const CLOUDINARY_API_KEY = "119339364971233";
const CLOUDINARY_API_SECRET = "GHPZaguGdaW1TywSH-zuTSsDK2I";

export const generateDestroySignature = async (publicId: string) => {
  const timestamp = new Date().getTime();
  const str = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
  const signature = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA1,
    str
  );

  return {
    signature,
    timestamp,
    apiKey: CLOUDINARY_API_KEY,
  };
};
