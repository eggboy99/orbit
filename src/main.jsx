import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Authentication from "./pages/Authentication.jsx";
import "./assets/css/variables.css";
import styles from "./assets/css/Root.module.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MobileMenuContextProvider } from "./context/MobileMenuContext.jsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/authentication", element: <Authentication /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MobileMenuContextProvider>
      <div className={styles.container}>
        <RouterProvider router={router} />
      </div>
    </MobileMenuContextProvider>
  </StrictMode>
);
