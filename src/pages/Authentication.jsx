import NavigationBar from "../components/NavigationBar";
import styles from "../assets/css/Authentication.module.css";
import emailIcon from "../assets/images/email-icon.svg";
import passwordIcon from "../assets/images/password-icon.svg";
import googleIcon from "../assets/images/google.png";
import userIcon from "../assets/images/user-icon.svg";
import phoneIcon from "../assets/images/phone-icon.svg";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { useEffect, useState } from "react";
import MobileMenuContext from "../context/MobileMenuContext";
import { useContext } from "react";
import { useLocation } from "react-router-dom";

const Authentication = () => {
  const { isActive } = useContext(MobileMenuContext);

  // Login and registration form elements are used to render the inputs of login and register form components
  const loginForm = [
    {
      name: "email",
      inputType: "text",
      placeholder: "Email",
      image: emailIcon,
    },
    {
      name: "password",
      inputType: "password",
      placeholder: "Password",
      image: passwordIcon,
    },
  ];

  const registrationForm = [
    {
      name: "email",
      inputType: "text",
      placeholder: "Email",
      image: emailIcon,
    },
    {
      name: "password",
      inputType: "password",
      placeholder: "Password",
      image: passwordIcon,
    },
    {
      name: "confirmPassword",
      inputType: "password",
      placeholder: "Confirm Password",
      image: passwordIcon,
    },
    {
      name: "username",
      inputType: "text",
      placeholder: "Username",
      image: userIcon,
    },
    {
      name: "mobileNumber",
      inputType: "number",
      placeholder: "Mobile Number",
      image: phoneIcon,
    },
  ];

  const loginButtons = [
    { name: "Sign in", type: "submit" },
    { name: "Sign in with Google", type: "submit", icon: googleIcon },
  ];

  const registerButtons = [
    { name: "Register", type: "submit" },
    { name: "Register with Google", type: "submit", icon: googleIcon },
  ];

  const [isRegister, setIsRegister] = useState(false); // state between the option sign in and register

  const toggleFormChoice = () => {
    setIsRegister((previousChoice) => {
      return !previousChoice;
    });
  };

  const location = useLocation();
  const [userDataFromParams, setUserDataFromParams] = useState(null);

  useEffect(() => {
    // Get the data from URL parameters
    const params = new URLSearchParams(location.search);
    const userData = {
      email: params.get("email"),
      username: params.get("username"),
      googleId: params.get("googleId"),
    };
    if (userData.email || userData.username || userData.googleId) {
      setUserDataFromParams(userData);
      setIsRegister(true);
    }
  }, [location]);

  return (
    <>
      <nav>
        <NavigationBar />
      </nav>
      <div
        className={`${styles.contentContainer} ${
          isRegister ? styles.bigFormContainerActive : ""
        }`}
      >
        {/* If isActive is true (hamburger menu is opened), we do no render the main display of the screen.  */}
        {isActive ? null : (
          <>
            {/* render the sign in form or register form depending on the isRegisterState */}
            <main
              className={
                isRegister ? styles.bigFormContainer : styles.smallFormContainer
              }
            >
              {isRegister ? (
                <>
                  <div className={styles.registerHeaders}>
                    <h1>Get started with us</h1>
                    <h2>Please enter your details</h2>
                  </div>
                  <RegisterForm
                    formInputs={registrationForm}
                    buttons={registerButtons}
                    testId="registrationForm"
                    prefillData={userDataFromParams}
                  />
                </>
              ) : (
                <>
                  <div className={styles.loginHeaders}>
                    <h1>Welcome back</h1>
                    <h2>Please enter your login details</h2>
                  </div>
                  <LoginForm
                    formInputs={loginForm}
                    buttons={loginButtons}
                    testId="loginForm"
                  />
                </>
              )}
            </main>
            <div className={styles.formChoice}>
              <label
                htmlFor="toggle"
                className={styles.choiceToggle}
                data-testid="formToggleButton"
              >
                <input
                  type="checkbox"
                  id="toggle"
                  onChange={toggleFormChoice}
                />
                <div className={styles.toggleBackground}>
                  <p>Sign in</p>
                  <p>Register</p>
                </div>
              </label>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Authentication;
