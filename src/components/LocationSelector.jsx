import { useEffect } from "react";
import styles from "../assets/css/LocationSelector.module.css";
import ArrowDownIcon from "../assets/images/arrow-down-icon.svg";
import PropTypes from "prop-types";

const LocationSelector = ({
  locations,
  setLocations,
  locationDropdownActive,
  setLocationDropdownActive,
  locationSelection,
  setLocationSelection,
  setCategoryDropdownActive,
  setFilterDropdownActive,
  variant,
}) => {
  const handleLocationDropdown = () => {
    setLocationDropdownActive((previousSelection) => !previousSelection);
    setCategoryDropdownActive(false);
    if (setFilterDropdownActive) {
      setFilterDropdownActive(false);
    }
  };
  const handleLocationSelection = (event) => {
    setLocationSelection(event.target.textContent);
    setLocationDropdownActive((previousSelection) => !previousSelection);
  };

  useEffect(() => {
    const fetchLocationsData = async () => {
      const request = await fetch(
        "http://localhost:3000/api/explore/retrieve-locations",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const response = await request.json();
      setLocations(response.towns);
    };
    fetchLocationsData();
  }, [setLocations]);

  const variantClass = variant === "explore" ? styles.explore : styles.upload;

  return (
    <div className={`${styles.locationContainer} ${variantClass}`}>
      <label htmlFor="" className={`${styles.categoryLabel} ${variantClass}`}>
        Location
      </label>
      <div className={styles.locationInput} onClick={handleLocationDropdown}>
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
  );
};

LocationSelector.propTypes = {
  locations: PropTypes.array,
  setLocations: PropTypes.func,
  locationSelection: PropTypes.string,
  setLocationSelection: PropTypes.func,
  locationDropdownActive: PropTypes.bool,
  setLocationDropdownActive: PropTypes.func,
  setCategoryDropdownActive: PropTypes.func,
  setFilterDropdownActive: PropTypes.func,
  variant: PropTypes.string,
};

export default LocationSelector;
