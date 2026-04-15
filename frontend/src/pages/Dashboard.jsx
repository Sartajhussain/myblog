import Sidebar from "../components/Sidebar";
import React from "react";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900">

      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-10 py-8 md:py-12">
        <Outlet />
      </div>

    </div>
  );
};

export default Dashboard;