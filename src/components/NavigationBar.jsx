import styles from "../assets/css/NavigationBar.module.css";
import brandLogo from "../assets/images/brand-logo.png";
import { Link, useNavigate } from "react-router-dom";
import MobileMenuContext from "../context/MobileMenuContext";
import AuthenticationContext from "../context/AuthenticationContext";
import { useContext, useState, useEffect } from "react";
import { RetrieveUserDetails } from "../utils/RetrieveUserDetails.mjs";
import ProfileIcon from "../assets/images/user-icon-white.svg";
import ChatIcon from "../assets/images/chat-icon-white.svg";
import LogoutIcon from "../assets/images/logout-icon-white.svg";

const NavigationBar = () => {
  const { isActive, setIsActive } = useContext(MobileMenuContext);
  const { isAuthenticated, user, setAuthentication } = useContext(
    AuthenticationContext
  );

  const [userProfileImage, setUserProfileImage] = useState("");
  useEffect(() => {
    if (user) {
      const fetchUserProfileDetails = async () => {
        const userDetails = await RetrieveUserDetails(user);
        setUserProfileImage(userDetails.userProfileImage);
      };
      fetchUserProfileDetails();
    } else return;
  }, [user]);

  const toggleMenu = () => {
    setIsActive((prevState) => !prevState);
  };

  const [dropDownActive, setDropDownActive] = useState(false);
  const handleDropdown = () => {
    setDropDownActive((previousState) => !previousState);
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    const request = await fetch("http://localhost:3000/api/logout", {
      method: "POST",
      credentials: "include",
    });

    const response = await request.json();
    setAuthentication(false);
    navigate(response.redirect);
  };

  return (
    <>
      <div
        className={`${styles.hamburgerIcon} ${isActive ? styles.active : ""}`}
        onClick={toggleMenu}
        data-testid="hamburger-menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul
        className={`${styles.navigationContainer} ${
          isActive ? styles.active : ""
        }`}
      >
        <li>
          <Link
            to="/explore"
            className={styles.link}
            data-testid="explore-navigator"
            onClick={() => {
              setIsActive(false);
            }}
          >
            Explore
          </Link>
        </li>
        <li className={styles.brand}>
          <Link
            to="/"
            className={`${styles.brandContainer} ${styles.link} ${
              isActive ? styles.active : ""
            }`}
            data-testid="home-navigator"
          >
            <img
              src={brandLogo}
              className={styles.brandLogo}
              alt="Orbit Brand Logo"
            />
            orbit
          </Link>
        </li>
        <li>
          {isAuthenticated ? (
            <>
              <img
                src={userProfileImage}
                alt="Profile Image"
                className={styles.userProfile}
                onClick={handleDropdown}
              />

              <div
                className={`${styles.dropdownMenuContainer} ${
                  dropDownActive ? styles.active : ""
                }`}
              >
                <Link className={styles.profile}>
                  <img src={ProfileIcon} alt="Profile Icon" />
                  <p>Profile</p>
                </Link>
                <Link className={styles.chat} to="/messages">
                  <img src={ChatIcon} alt="Chat Icon" />
                  <p>Chat</p>
                </Link>
                <Link className={styles.logout} onClick={handleLogout}>
                  <img src={LogoutIcon} alt="Logout Icon" />
                  <p>Logout</p>
                </Link>
              </div>
            </>
          ) : (
            <Link to="/authentication" data-testid="login-navigator">
              <button className={styles.loginButton}>Login</button>
            </Link>
          )}
        </li>
      </ul>
    </>
  );
};

export default NavigationBar;
