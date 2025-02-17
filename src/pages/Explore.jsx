import NavigationBar from "../components/NavigationBar";
import MobileMenuContext from "../context/MobileMenuContext";
import { useContext, useEffect, useRef, useState } from "react";
import styles from "../assets/css/Explore.module.css";
import SearchBar from "../components/SearchBar";
import FilterIcon from "../assets/images/filter-icon.svg";
import ArrowDownIcon from "../assets/images/arrow-down-icon.svg";
import UploadIcon from "../assets/images/upload-icon.svg";

const Explore = () => {
  const { isActive } = useContext(MobileMenuContext);

  // Categories filter utilities
  const [categories, setCategories] = useState([]);
  const [categorySelection, setCategorySelection] = useState("Choose Category");
  const [categoryDropdownActive, setCategoryDropdownActive] = useState(false);

  const handleCategoryDropdown = () => {
    setCategoryDropdownActive((previousSelection) => !previousSelection);
    setLocationDropdownActive(false);
    setFilterDropdownActive(false);
  };

  useEffect(() => {
    if (categoryDropdownActive) {
      setLocationDropdownActive(false);
      setFilterDropdownActive(false);
    }
  }, [categoryDropdownActive]);

  const handleCategorySelection = (event) => {
    setCategorySelection(event.target.textContent);
    setCategoryDropdownActive((previousSelection) => !previousSelection);
  };

  const [subCategorySelection, setSubCategorySelection] = useState(null);
  const handleSubCategorySelection = (event) => {
    setSubCategorySelection(event.target.textContent);
  };

  // Locations filter utilites
  const [locations, setLocations] = useState([]);
  const [locationSelection, setLocationSelection] = useState("Choose Location");
  const [locationDropdownActive, setLocationDropdownActive] = useState(false);

  const handleLocationDropdown = () => {
    setLocationDropdownActive((previousSelection) => !previousSelection);
    setCategoryDropdownActive(false);
    setFilterDropdownActive(false);
  };
  const handleLocationSelection = (event) => {
    setLocationSelection(event.target.textContent);
    setLocationDropdownActive((previousSelection) => !previousSelection);
  };

  // Extra filter options utilities
  const [filterDropdownActive, setFilterDropdownActive] = useState(false);
  const recencyRef = useRef(null);
  const proximityRef = useRef(null);
  const newRef = useRef(null);
  const likeNewRef = useRef(null);
  const wellUsedRef = useRef(null);
  const [sortSelection, setSortSelection] = useState(null);
  const [conditionSelection, setConditionSelection] = useState(null);

  // Set default selection for both sort and condition filter to recency and new respectively
  useEffect(() => {
    setSortSelection(recencyRef.current.textContent);
    setConditionSelection(newRef.current.textContent);
  }, []);

  const handleFilterDropdown = () => {
    setFilterDropdownActive((previousState) => !previousState);
    setCategoryDropdownActive(false);
    setLocationDropdownActive(false);
  };

  // Handles sorting type filter selection
  const handleSortSelection = (selection) => {
    if (!recencyRef.current || !proximityRef.current) return;
    recencyRef.current.classList.add(styles.selected);

    if (selection === "Recency") {
      recencyRef.current.classList.add(styles.selected);
      proximityRef.current.classList.remove(styles.selected);
    } else if (selection === "Proximity") {
      proximityRef.current.classList.add(styles.selected);
      recencyRef.current.classList.remove(styles.selected);
    }
  };

  // Handles condition filter selection
  const handleConditionSelection = (selection) => {
    if (!newRef.current || !likeNewRef.current || !wellUsedRef.current) return;
    newRef.current.classList.add(styles.selected);

    if (selection === "New") {
      newRef.current.classList.add(styles.selected);
      likeNewRef.current.classList.remove(styles.selected);
      wellUsedRef.current.classList.remove(styles.selected);
    } else if (selection === "Like new") {
      likeNewRef.current.classList.add(styles.selected);
      newRef.current.classList.remove(styles.selected);
      wellUsedRef.current.classList.remove(styles.selected);
    } else if (selection === "Well used") {
      wellUsedRef.current.classList.add(styles.selected);
      newRef.current.classList.remove(styles.selected);
      likeNewRef.current.classList.remove(styles.selected);
    }
  };

  // Reset filter options to default state
  const handleResetFilter = () => {
    setCategorySelection("Choose Category");
    setLocationSelection("Choose Location");
    handleSortSelection("Recency");
    handleConditionSelection("New");
  };

  useEffect(() => {
    const fetchCategoriesData = async () => {
      const request = await fetch(
        "http://localhost:3000/api/retrieve-categories",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const response = await request.json();
      setCategories(response.categories);
    };

    const fetchLocationsData = async () => {
      const request = await fetch(
        "http://localhost:3000/api/retrieve-locations",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const response = await request.json();
      setLocations(response.towns);
    };

    fetchCategoriesData();
    fetchLocationsData();
  }, []);

  return (
    <>
      <nav>
        <NavigationBar />
      </nav>
      {isActive ? null : (
        <main>
          <button className={styles.uploadButton}>
            Upload
            <img src={UploadIcon} alt="Upload Icon" />
          </button>
          <div className={styles.searchToolsContainer}>
            <SearchBar />
            <div className={styles.filterContainer}>
              <div className={styles.categoryContainer}>
                <label htmlFor="">Category</label>
                <div
                  className={styles.categoryInput}
                  onClick={handleCategoryDropdown}
                >
                  <p>{categorySelection}</p>
                  <img src={ArrowDownIcon} alt="" />
                </div>
                <div
                  className={`${styles.categoriesDropdown} ${
                    categoryDropdownActive ? styles.active : ""
                  }`}
                >
                  {categories.map((element, index) => (
                    <p
                      className={styles.category}
                      key={index}
                      onClick={handleCategorySelection}
                    >
                      {element.name}
                    </p>
                  ))}
                </div>
              </div>
              <div className={styles.locationContainer}>
                <label htmlFor="location">Location</label>
                <div
                  className={styles.locationInput}
                  onClick={handleLocationDropdown}
                >
                  <p>{locationSelection}</p>
                  <img src={ArrowDownIcon} alt="" />
                </div>
                <div
                  className={`${styles.locationsDropdown} ${
                    locationDropdownActive ? styles.active : ""
                  }`}
                >
                  {locations.map((element, index) => (
                    <p
                      className={styles.location}
                      key={index}
                      onClick={handleLocationSelection}
                    >
                      {element.name}
                    </p>
                  ))}
                </div>
              </div>
              <img
                src={FilterIcon}
                alt="Filter Icon"
                className={styles.filterIcon}
                onClick={handleFilterDropdown}
              />
              <div
                className={`${styles.filterOptions} ${
                  filterDropdownActive ? styles.active : ""
                }`}
              >
                <div className={styles.sortContainer}>
                  <h2>Sort by</h2>
                  <button
                    ref={recencyRef}
                    onClick={() => handleSortSelection("Recency")}
                    className={
                      sortSelection === "Recency" ? styles.selected : ""
                    }
                  >
                    Recency
                  </button>
                  <button
                    ref={proximityRef}
                    onClick={() => handleSortSelection("Proximity")}
                  >
                    Proximity
                  </button>
                </div>
                <div className={styles.conditionContainer}>
                  <h2>Condition</h2>
                  <button
                    ref={newRef}
                    onClick={() => handleConditionSelection("New")}
                    className={
                      conditionSelection === "New" ? styles.selected : ""
                    }
                  >
                    New
                  </button>
                  <button
                    ref={likeNewRef}
                    onClick={() => handleConditionSelection("Like new")}
                  >
                    Like new
                  </button>
                  <button
                    ref={wellUsedRef}
                    onClick={() => handleConditionSelection("Well used")}
                  >
                    Well used
                  </button>
                </div>
                <button
                  className={styles.resetFilter}
                  onClick={handleResetFilter}
                >
                  Reset Filter
                </button>
              </div>
            </div>
            <div className={styles.subCategoriesContainer}>
              {categories
                .find((category) => category.name === categorySelection)
                ?.subcategories.map((subCategory, index) => (
                  <button
                    key={index}
                    className={`${styles.subCategory} ${
                      subCategory === subCategorySelection ? styles.active : ""
                    }`}
                    onClick={handleSubCategorySelection}
                  >
                    {subCategory}
                  </button>
                ))}
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default Explore;
