import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Authentication from "./pages/Authentication.jsx";
import "./assets/css/variables.css";
import styles from "./assets/css/Root.module.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MobileMenuContextProvider } from "./context/MobileMenuContext.jsx";
import { AuthenticationContextProvider } from "./context/AuthenticationContext.jsx";
import OTPVerification from "./pages/OTPVerification.jsx";
import ProtectedRoutes from "./utils/ProtectedRoutes.jsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/authentication", element: <Authentication /> },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "authentication/verify/:id",
        element: <OTPVerification />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthenticationContextProvider>
      <MobileMenuContextProvider>
        <div className={styles.container}>
          <RouterProvider router={router} />
        </div>
      </MobileMenuContextProvider>
    </AuthenticationContextProvider>
  </StrictMode>
);
