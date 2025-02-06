import { useState, useEffect } from "react";

const useDarkMode = () => {
  // Use state with a function to initialize from localStorage only on the client
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined" && localStorage.getItem("theme")) {
      return localStorage.getItem("theme") === "dark";
    }
    return false; // Default to light mode
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
  
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    
    }
  }, [darkMode]);

  return [darkMode, setDarkMode];
};

export default useDarkMode;
