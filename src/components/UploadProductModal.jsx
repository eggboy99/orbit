import PropTypes from "prop-types";
import styles from "../assets/css/UploadProductModal.module.css";
import ImageDropzone from "./ImageDropzone";
import CategorySelector from "./CategorySelector";
import LocationSelector from "./LocationSelector";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import CloseIcon from "../assets/images/white-close-icon.svg";

const UploadProductModal = ({ isModalToggled, toggleModal }) => {
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

  const [conditionSelection, setConditionSelection] = useState(null);
  const handleConditionSelection = (event) => {
    const selection = event.target.textContent;
    setConditionSelection(selection);
  };

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div
      className={`${styles.modalContainer} ${
        isModalToggled ? styles.active : ""
      }`}
    >
      <button type="button" className={styles.closeModalButton}>
        <img
          src={CloseIcon}
          alt="Close Upload Modal Icon"
          onClick={() => {
            toggleModal((previousState) => !previousState);
          }}
        />
      </button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="images"
          control={control}
          defaultValue={[]}
          rules={{
            validate: {
              required: (files) =>
                (files && files.length > 0) ||
                "Please upload at least one image",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <ImageDropzone
              onChange={onChange}
              value={value}
              error={errors.images && errors.images.message}
              setValue={setValue}
            />
          )}
        />
        <div className={styles.productNameContainer}>
          <label htmlFor="productName">Product</label>
          <input type="text" className={styles.productName} id="productName" />
        </div>

        <div className={styles.productDescriptionContainer}>
          <label htmlFor="productDescription">Description</label>
          <textarea
            id="productDescription"
            className={styles.productDescription}
          ></textarea>
        </div>
        <div className={styles.productCategoriesLocationsContainer}>
          <div className={styles.categoriesContainer}>
            <CategorySelector
              categories={categories}
              setCategories={setCategories}
              categorySelection={categorySelection}
              setCategorySelection={setCategorySelection}
              categoryDropdownActive={categoryDropdownActive}
              setCategoryDropdownActive={setCategoryDropdownActive}
              setLocationDropdownActive={setLocationDropdownActive}
              variant="upload"
            />
            <div className={styles.subCategoriesContainer}>
              {categories
                .find((category) => category.name === categorySelection)
                ?.subcategories.map((subCategory, index) => (
                  <button
                    key={index}
                    type="button"
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
          <div className={styles.locationsContainer}>
            <LocationSelector
              locations={locations}
              setLocations={setLocations}
              locationDropdownActive={locationDropdownActive}
              setLocationDropdownActive={setLocationDropdownActive}
              locationSelection={locationSelection}
              setLocationSelection={setLocationSelection}
              setCategoryDropdownActive={setCategoryDropdownActive}
              variant="upload"
            />
            <div className={styles.subZonesContainer}>
              {locations
                .find((location) => location.name === locationSelection)
                ?.subzones.map((subZone, index) => (
                  <button
                    key={index}
                    type="button"
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
        </div>
        <div className={styles.conditionContainer}>
          <label htmlFor="">Condition</label>
          <div className={styles.conditionButtonsContainer}>
            <button
              type="button"
              onClick={handleConditionSelection}
              className={conditionSelection === "New" ? styles.selected : ""}
            >
              New
            </button>
            <button
              type="button"
              onClick={handleConditionSelection}
              className={
                conditionSelection === "Like new" ? styles.selected : ""
              }
            >
              Like new
            </button>
            <button
              type="button"
              onClick={handleConditionSelection}
              className={
                conditionSelection === "Well used" ? styles.selected : ""
              }
            >
              Well used
            </button>
          </div>
        </div>
        <button type="submit" className={styles.uploadButton}>
          Upload
        </button>
      </form>
    </div>
  );
};

UploadProductModal.propTypes = {
  isModalToggled: PropTypes.bool,
  toggleModal: PropTypes.func,
};

export default UploadProductModal;
