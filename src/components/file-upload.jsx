"use client";

import { UploadDropzone } from "@uploadthing/react";
import toast from "react-hot-toast";

export const FileUpload = ({ onChange, endpoint }) => {
  return (
    <UploadDropzone
      endpoint={endpoint} // ✅ Now correctly using the prop
      onClientUploadComplete={(res) => {
        onChange(res?.[0]?.url);
      }}
      onUploadError={(error) => {
        toast.error(error?.message || "Upload failed");
      }}
    />
  );
};
