// import DashboardHeader from '@/app/dashboard/_components/DashboardHeader'
import React from "react";

function CourseViewLayout({ children }) {
  return (
    <div>
      {/* <DashboardHeader/> */}
      <div className="mx-10 md:mx-36 lg:mx-60 mt-10">{children}</div>
    </div>
  );
}

export default CourseViewLayout;
