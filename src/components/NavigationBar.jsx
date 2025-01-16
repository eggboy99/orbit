import styles from "../assets/css/NavigationBar.module.css";
import brandLogo from "../assets/images/brand-logo.png";
import { Link } from "react-router-dom";
import MobileMenuContext from "../context/MobileMenuContext";
import { useContext } from "react";

const NavigationBar = () => {
  const { isActive, setIsActive } = useContext(MobileMenuContext);
  const toggleMenu = () => {
    setIsActive((prevState) => !prevState);
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
          >
            Explore
          </Link>
        </li>
        <li>
          <Link
            to="/community"
            className={styles.link}
            data-testid="community-navigator"
          >
            Community
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
          <Link
            to="/news-feed"
            className={styles.link}
            data-testid="newsfeed-navigator"
          >
            Social Feed
          </Link>
        </li>
        <li>
          <Link
            to="/articles"
            className={styles.link}
            data-testid="articles-navigator"
          >
            Articles
          </Link>
        </li>
        <li>
          <Link
            to="/authentication"
            className={styles.link}
            data-testid="login-navigator"
          >
            <button className={styles.loginButton}>Login</button>
          </Link>
        </li>
      </ul>
    </>
  );
};

export default NavigationBar;
