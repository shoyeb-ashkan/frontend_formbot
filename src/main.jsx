import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import router from "./routes/index";
import { RouterProvider } from "react-router-dom";
import { store } from "./store";
import { Provider } from "react-redux";
import { ThemeProvider } from "./utils/ThemeContext";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
