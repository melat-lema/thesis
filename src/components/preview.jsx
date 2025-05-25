"use client";

// import dynamic from "next/dynamic";
// import { useMemo } from "react";
// import "react-quill/dist/quill.bubble.css";

// let ReactQuill = null;
// try {
//   ReactQuill = dynamic(() => import("react-quill"), {
//     ssr: false,
//     loading: () => <p>Loading...</p>,
//   });
// } catch (e) {
//   ReactQuill = null;
// }

export const Preview = ({ value }) => {
  // const modules = {
  //   toolbar: false,
  // };

  // If ReactQuill fails, just show plain text
  // if (!ReactQuill) {
  //   return <div className="bg-white"><p>{value || ""}</p></div>;
  // }

  // try {
  //   return (
  //     <div className="bg-white">
  //       <ReactQuill theme="bubble" value={value || ""} readOnly modules={modules} />
  //     </div>
  //   );
  // } catch (e) {
  //   return <div className="bg-white"><p>{value || ""}</p></div>;
  // }
  return (
    <div className="bg-white">
      <p>{value || ""}</p>
    </div>
  );
};
