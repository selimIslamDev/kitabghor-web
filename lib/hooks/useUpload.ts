import { useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export function useUploadImage() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        },
      });

      return res.data.data.url;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Upload failed!");
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return { uploadImage, uploading, progress };
}