import { createContext, useState, useContext, useEffect } from "react";

// ✅ Create Theme Context
const ThemeContext = createContext();

// ✅ Theme Provider Component
export const ThemeProvider = ({ children }) => {
  // ✅ Check localStorage for saved theme
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  // ✅ Toggle Theme
  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  // ✅ Apply theme to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      // ✅ Dark mode variables
      document.documentElement.style.setProperty("--bg-color", "#2b2b2b");
      document.documentElement.style.setProperty("--card-bg", "#2b2b2b");
      document.documentElement.style.setProperty("--light-shadow", "#3a3a3a");
      document.documentElement.style.setProperty("--dark-shadow", "#1a1a1a");
      document.documentElement.style.setProperty("--text-primary", "#e0e0e0");
      document.documentElement.style.setProperty("--text-secondary", "#a0a0a0");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      // ✅ Light mode variables (reset to default)
      document.documentElement.style.setProperty("--bg-color", "#e6e7ee");
      document.documentElement.style.setProperty("--card-bg", "#e6e7ee");
      document.documentElement.style.setProperty("--light-shadow", "#ffffff");
      document.documentElement.style.setProperty("--dark-shadow", "#b8b9be");
      document.documentElement.style.setProperty("--text-primary", "#31344b");
      document.documentElement.style.setProperty("--text-secondary", "#6c6f8a");
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ✅ Custom Hook to use Theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;