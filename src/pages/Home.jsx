import NavigationBar from "../components/NavigationBar";
import styles from "../assets/css/Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <nav>
        <NavigationBar />
      </nav>
    </div>
  );
};

export default Home;
