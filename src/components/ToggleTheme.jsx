import { useTheme } from "../utils/ThemeContext";
import "./styles/toggleTheme.css";

const ToggleTheme = () => {
    const { theme, toggleTheme } = useTheme();
  return (
    <div className="theme__header">
      <p>Light</p>
      <div className="theme-switch">
        <input
          type="checkbox"
          id="theme-switch"
          checked={theme === "dark"}
          onChange={toggleTheme}
        />
        <label htmlFor="theme-switch">
          <div className="theme-switch__circle"></div>
        </label>
      </div>
      <p>Dark</p>
    </div>
  );
};
export default ToggleTheme;
