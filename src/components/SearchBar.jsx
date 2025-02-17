import styles from "../assets/css/SearchBar.module.css";
import SearchBarIcon from "../assets/images/search-bar-icon.svg";

const SearchBar = () => {
  return (
    <div className={styles.searchBar}>
      <img src={SearchBarIcon} alt="Search Bar Icon" />
      <input type="text" id="search" placeholder="Search" />
    </div>
  );
};

export default SearchBar;
