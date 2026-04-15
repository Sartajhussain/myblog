import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const ThemeProvider = ({ children }) => {

  const { theme } = useSelector((state) => state.theme);

  console.log("Theme:", theme);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-200 text-gray-800 dark:text-gray-200 dark:bg-slate-900 transition-colors duration-300">
      {children}
    </div>
  );
};

export default ThemeProvider;