import PropTypes from "prop-types";
import styles from "../assets/css/SearchBar.module.css";
import SearchBarIcon from "../assets/images/search-bar-icon.svg";

const SearchBar = ({ setSearchValue }) => {
  const handleOnChange = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <div className={styles.searchBar}>
      <img src={SearchBarIcon} alt="Search Bar Icon" />
      <input
        type="text"
        id="search"
        placeholder="Search"
        onChange={handleOnChange}
      />
    </div>
  );
};

SearchBar.propTypes = {
  setSearchValue: PropTypes.func,
};

export default SearchBar;
