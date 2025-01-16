import NavigationBar from "../components/NavigationBar";
import styles from "../assets/css/Home.module.css";
import sharingIllustration from "../assets/images/people-sharing.png";
import upcycling from "../assets/images/upcycling-illustration.png";
import tree from "../assets/images/tree.png";
import { Link } from "react-router-dom";
import { useContext } from "react";
import MobileMenuContext from "../context/MobileMenuContext";

const Home = () => {
  const { isActive } = useContext(MobileMenuContext);

  return (
    <>
      <nav>
        <NavigationBar />
      </nav>
      <main>
        <section
          className={`${styles.sloganContainer} ${
            isActive ? styles.active : ""
          } `}
          data-testid="sloganContainer"
        >
          <div className={styles.firstRow}>
            <h1 className={styles.slogan}>
              Got something to dispose?
              <br />
              Don&apos;t throw it, <br />
              Orbit it!
            </h1>
            <img
              src={sharingIllustration}
              alt="Group of People Sharing Items Illustration"
              className={styles.sharingIllustration}
            />
          </div>
          <div className={styles.secondRow}>
            <img
              src={tree}
              alt="Tree and Birds Illustration"
              className={styles.treeIllustration}
            />
            <div className={styles.subSloganContainer}>
              <h2 className={styles.subSlogan}>
                Promote environmental sustainability <br /> and reduce waste
                with <span>orbit</span>. <br />
                Donate what you no longer need and find <br />
                what you do.
              </h2>
              <Link to="/authentication">
                <button className={styles.getStartedBtn}>Get started</button>
              </Link>
            </div>
          </div>
        </section>
        <section
          className={`${styles.companyGoalContainer} ${
            isActive ? styles.active : ""
          } `}
          data-testid="companyGoalContainer"
        >
          <img
            src={upcycling}
            alt="Brand Logo"
            className={styles.upcyclingIllustration}
          />
          <div className={styles.information}>
            <div className={styles.brandInformation}>
              <h2>What is orbit?</h2>
              <p>
                A platform for users to exchange, donate, or receive new or used
                products such as food, educational materials or domestic items.
              </p>
            </div>
            <div className={styles.mission}>
              <h2>Mission</h2>
              <p>
                Our mission is to promote environmental sustainability by
                redistributing surplus goods to those in need, reducing waste,
                and building a supportive community
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
