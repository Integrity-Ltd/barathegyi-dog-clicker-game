import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useTheme } from "../theme/ThemeProvider";

export function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? t("ui.lightMode") : t("ui.darkMode");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-icon-button"
      aria-label={label}
      title={label}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
