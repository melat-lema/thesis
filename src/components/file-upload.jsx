"use client";

import { UploadDropzone } from "@uploadthing/react";
import toast from "react-hot-toast";

export const FileUpload = ({ onChange, endpoint, onUploadError }) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        console.log("Upload completed:", res);
        if (res?.[0]?.url) {
          onChange(res[0].url);
        } else {
          console.error("No URL in upload response:", res);
          toast.error("Upload completed but no URL received");
        }
      }}
      onUploadError={(error) => {
        console.error("Upload error:", error);
        if (onUploadError) {
          onUploadError(error);
        }
        toast.error(error?.message || "Upload failed");
      }}
      onUploadBegin={() => {
        console.log("Upload started");
      }}
      config={{
        mode: "auto",
      }}
    />
  );
};
