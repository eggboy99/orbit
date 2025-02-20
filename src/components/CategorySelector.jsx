import { useEffect } from "react";
import styles from "../assets/css/CategorySelector.module.css";
import ArrowDownIcon from "../assets/images/arrow-down-icon.svg";
import PropTypes from "prop-types";

const CategorySelector = ({
  categories,
  setCategories,
  categorySelection,
  setCategorySelection,
  categoryDropdownActive,
  setCategoryDropdownActive,
  setLocationDropdownActive,
  setFilterDropdownActive,
  variant,
}) => {
  const handleCategoryDropdown = () => {
    setCategoryDropdownActive((previousSelection) => !previousSelection);
    setLocationDropdownActive(false);
    if (setFilterDropdownActive) {
      setFilterDropdownActive(false);
    }
  };

  useEffect(() => {
    if (categoryDropdownActive && setFilterDropdownActive) {
      setLocationDropdownActive(false);
      setFilterDropdownActive(false);
    }
  }, [
    setFilterDropdownActive,
    categoryDropdownActive,
    setLocationDropdownActive,
  ]);

  const handleCategorySelection = (event) => {
    setCategorySelection(event.target.textContent);
    setCategoryDropdownActive((previousSelection) => !previousSelection);
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

    fetchCategoriesData();
  }, [setCategories]);

  const variantClass = variant === "explore" ? styles.explore : styles.upload;

  return (
    <div className={`${styles.categoryContainer} ${variantClass}`}>
      <label htmlFor="" className={`${styles.categoryLabel} ${variantClass}`}>
        Category
      </label>
      <div className={styles.categoryInput} onClick={handleCategoryDropdown}>
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
  );
};

CategorySelector.propTypes = {
  categories: PropTypes.array,
  setCategories: PropTypes.func,
  categorySelection: PropTypes.string,
  setCategorySelection: PropTypes.func,
  categoryDropdownActive: PropTypes.bool,
  setCategoryDropdownActive: PropTypes.func,
  setLocationDropdownActive: PropTypes.func,
  setFilterDropdownActive: PropTypes.func,
  variant: PropTypes.string,
};

export default CategorySelector;
