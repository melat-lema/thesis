"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill/dist/quill.bubble.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export const Preview = ({ value }) => {
  const modules = {
    toolbar: false,
  };

  return (
    <div className="bg-white">
      <ReactQuill theme="bubble" value={value} readOnly modules={modules} />
    </div>
  );
};
