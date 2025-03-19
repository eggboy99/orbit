import NavigationBar from "../components/NavigationBar";
import MobileMenuContext from "../context/MobileMenuContext";
import { useContext, useRef, useState } from "react";
import styles from "../assets/css/Explore.module.css";
import SearchBar from "../components/SearchBar";
import FilterIcon from "../assets/images/filter-icon.svg";
import UploadIcon from "../assets/images/upload-icon.svg";
import UploadProductModal from "../components/UploadProductModal";
import CategorySelector from "../components/CategorySelector";
import LocationSelector from "../components/LocationSelector";
import ProductsRenderer from "../components/ProductsRenderer";

const Explore = () => {
  const { isActive } = useContext(MobileMenuContext);

  // Handle upload product toggle modal
  const [isModalToggled, toggleModal] = useState(false);
  const handleToggleModal = () => {
    toggleModal((previousState) => !previousState);
  };

  // Categories filter utilities
  const [categories, setCategories] = useState([]);
  const [categorySelection, setCategorySelection] = useState("Choose Category");
  const [categoryDropdownActive, setCategoryDropdownActive] = useState(false);

  const [subCategorySelection, setSubCategorySelection] = useState(null);
  const handleSubCategorySelection = (event) => {
    setSubCategorySelection(event.target.textContent);
  };

  // Locations filter utilites
  const [locations, setLocations] = useState([]);
  const [locationSelection, setLocationSelection] = useState("Choose Location");
  const [locationDropdownActive, setLocationDropdownActive] = useState(false);

  const [subZoneSelection, setSubZoneSelection] = useState(null);
  const handleSubZoneSelection = (event) => {
    setSubZoneSelection(event.target.textContent);
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

  const handleFilterDropdown = () => {
    setFilterDropdownActive((previousState) => !previousState);
    setCategoryDropdownActive(false);
    setLocationDropdownActive(false);
  };

  // Handles sorting type filter selection
  const handleSortSelection = (selection) => {
    if (!recencyRef.current || !proximityRef.current) return;

    if (selection === "Recency") {
      setSortSelection("Recency");
      recencyRef.current.classList.add(styles.selected);
      proximityRef.current.classList.remove(styles.selected);
    } else if (selection === "Proximity") {
      setSortSelection("Proximity");
      proximityRef.current.classList.add(styles.selected);
      recencyRef.current.classList.remove(styles.selected);
    }
  };

  // Handles condition filter selection
  const handleConditionSelection = (selection) => {
    if (!newRef.current || !likeNewRef.current || !wellUsedRef.current) return;

    if (selection === "New") {
      newRef.current.classList.add(styles.selected);
      likeNewRef.current.classList.remove(styles.selected);
      wellUsedRef.current.classList.remove(styles.selected);
      setConditionSelection("New");
    } else if (selection === "Like new") {
      likeNewRef.current.classList.add(styles.selected);
      newRef.current.classList.remove(styles.selected);
      wellUsedRef.current.classList.remove(styles.selected);
      setConditionSelection("Like new");
    } else if (selection === "Well used") {
      wellUsedRef.current.classList.add(styles.selected);
      newRef.current.classList.remove(styles.selected);
      likeNewRef.current.classList.remove(styles.selected);
      setConditionSelection("Well used");
    }
  };

  // Reset filter options to default state
  const handleResetFilter = () => {
    setCategorySelection("Choose Category");
    setLocationSelection("Choose Location");

    setSortSelection(null);
    recencyRef.current.classList.remove(styles.selected);
    proximityRef.current.classList.remove(styles.selected);

    setConditionSelection(null);
    newRef.current.classList.remove(styles.selected);
    likeNewRef.current.classList.remove(styles.selected);
    wellUsedRef.current.classList.remove(styles.selected);
  };

  const [searchValue, setSearchValue] = useState("");

  return (
    <>
      <nav>
        <NavigationBar />
      </nav>
      {isActive ? null : (
        <main>
          <button className={styles.uploadButton} onClick={handleToggleModal}>
            Upload
            <img src={UploadIcon} alt="Upload Icon" />
          </button>
          <UploadProductModal
            isModalToggled={isModalToggled}
            toggleModal={toggleModal}
          />
          <div className={styles.searchToolsContainer}>
            <SearchBar setSearchValue={setSearchValue} />
            <div className={styles.filterContainer}>
              <CategorySelector
                categories={categories}
                setCategories={setCategories}
                categorySelection={categorySelection}
                setCategorySelection={setCategorySelection}
                categoryDropdownActive={categoryDropdownActive}
                setCategoryDropdownActive={setCategoryDropdownActive}
                setLocationDropdownActive={setLocationDropdownActive}
                setFilterDropdownActive={setFilterDropdownActive}
                variant="explore"
              />
              <LocationSelector
                locations={locations}
                setLocations={setLocations}
                locationDropdownActive={locationDropdownActive}
                setLocationDropdownActive={setLocationDropdownActive}
                locationSelection={locationSelection}
                setLocationSelection={setLocationSelection}
                setCategoryDropdownActive={setCategoryDropdownActive}
                setFilterDropdownActive={setFilterDropdownActive}
                variant="explore"
              />
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
            <div className={styles.subZonesContainer}>
              {locations
                .find((location) => location.name === locationSelection)
                ?.subzones.map((subZone, index) => (
                  <button
                    key={index}
                    className={`${styles.subZone} ${
                      subZone === subZoneSelection ? styles.active : ""
                    }`}
                    onClick={handleSubZoneSelection}
                  >
                    {subZone}
                  </button>
                ))}
            </div>
          </div>
          <ProductsRenderer
            searchValue={searchValue}
            categorySelection={categorySelection}
            locationSelection={locationSelection}
            conditionSelection={conditionSelection}
          />
        </main>
      )}
    </>
  );
};

export default Explore;
