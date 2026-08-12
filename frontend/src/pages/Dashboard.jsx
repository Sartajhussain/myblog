import Sidebar from "../components/Sidebar";
import React from "react";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Sidebar />

      <main className="md:pl-64 lg:pl-72 px-4 md:px-6 lg:px-8 py-4 md:py-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;