import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { PixelButton } from "./PixelButton";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("light", savedTheme === "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("light", newTheme === "light");
  };

  return (
    <PixelButton
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="gap-2"
    >
      {theme === "dark" ? (
        <>
          <Sun className="h-4 w-4" />
          <span className="hidden sm:inline">Day</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
          <span className="hidden sm:inline">Night</span>
        </>
      )}
    </PixelButton>
  );
};
