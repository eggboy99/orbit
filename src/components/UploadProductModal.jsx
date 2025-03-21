import PropTypes from "prop-types";
import styles from "../assets/css/UploadProductModal.module.css";
import ImageDropzone from "./ImageDropzone";
import CategorySelector from "./CategorySelector";
import LocationSelector from "./LocationSelector";
import { useForm, Controller } from "react-hook-form";
import { useState, useContext } from "react";
import CloseIcon from "../assets/images/white-close-icon.svg";
import AuthenticationContext from "../context/AuthenticationContext";

const UploadProductModal = ({ isModalToggled, toggleModal, setProducts }) => {
  const { user } = useContext(AuthenticationContext);

  const [categories, setCategories] = useState([]);
  const [categorySelection, setCategorySelection] = useState("Choose Category");
  const [categoryDropdownActive, setCategoryDropdownActive] = useState(false);

  const [subCategorySelection, setSubCategorySelection] = useState(null);
  const handleSubCategorySelection = (event) => {
    setSubCategorySelection(event.target.textContent);
    if (errors.subCategory) {
      clearErrors("subCategory");
    }
  };

  // Locations filter utilites
  const [locations, setLocations] = useState([]);
  const [locationSelection, setLocationSelection] = useState("Choose Location");
  const [locationDropdownActive, setLocationDropdownActive] = useState(false);

  const [subZoneSelection, setSubZoneSelection] = useState(null);
  const handleSubZoneSelection = (event) => {
    setSubZoneSelection(event.target.textContent);
    if (errors.subZone) {
      clearErrors("subZone");
    }
  };

  const [conditionSelection, setConditionSelection] = useState(null);
  const handleConditionSelection = (event) => {
    const selection = event.target.textContent;
    setConditionSelection(selection);
    if (errors.condition) {
      clearErrors("condition");
    }
  };

  const {
    handleSubmit,
    control,
    register,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  const [previewFiles, setPreviewFiles] = useState([]);
  const onSubmit = async (data) => {
    if (
      subCategorySelection === null &&
      categorySelection === "Choose Category"
    ) {
      setError("subCategory", {
        type: "manual",
        message: "Please select a category",
      });
      return;
    }
    if (subZoneSelection === null && locationSelection === "Choose Location") {
      setError("subZone", {
        type: "manual",
        message: "Please select a location",
      });
      return;
    }

    if (conditionSelection === null) {
      setError("condition", {
        type: "manual",
        message:
          "Please choose an option that best describes your product condition",
      });
      return;
    }

    data.category = categorySelection;
    data.subCategory = subCategorySelection;
    data.location = locationSelection;
    data.subZone = subZoneSelection;
    data.condition = conditionSelection;
    data.userId = user;

    // Create an array of promise, one for each image file
    const fileReadPromises = data.images.map((image) =>
      readFileAsDataURL(image)
    );

    // Wait for all reads to complete
    const base64Images = await Promise.all(fileReadPromises);
    data.images = base64Images;

    const request = await fetch(
      "http://localhost:3000/api/explore/upload-product",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );

    const response = await request.json();
    if (response.success) {
      toggleModal((previousState) => !previousState);
      setProducts((previousState) => [...previousState, response.body]);
      setCategorySelection("Choose Category");
      setLocationSelection("Choose Location");
      setSubZoneSelection(null);
      setConditionSelection(null);
      setValue("productName", "");
      setValue("productName", "");
      setPreviewFiles([]);
    }
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
              previewFiles={previewFiles}
              setPreviewFiles={setPreviewFiles}
            />
          )}
        />
        <div className={styles.productNameContainer}>
          <label htmlFor="productName">Product</label>
          <input
            type="text"
            className={styles.productName}
            id="productName"
            {...register("productName", {
              required: "Product name is required",
              minLength: {
                value: 3,
                message: "Product name must be at least of 3 characters",
              },
              maxLength: {
                value: 30,
                message: "Product name cannot exceed 30 characters",
              },
            })}
          />
          {errors.productName ? (
            <p className={styles.errorMessage}>{errors.productName.message}</p>
          ) : (
            ""
          )}
        </div>
        <div className={styles.productDescriptionContainer}>
          <label htmlFor="productDescription">Description</label>
          <textarea
            id="productDescription"
            className={styles.productDescription}
            {...register("productDescription")}
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
              errors={errors}
              clearErrors={clearErrors}
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
            {errors.subCategory ? (
              <p className={styles.errorMessage}>
                {errors.subCategory.message}
              </p>
            ) : (
              ""
            )}
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
              errors={errors}
              clearErrors={clearErrors}
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
            {errors.subZone ? (
              <p className={styles.errorMessage}>{errors.subZone.message}</p>
            ) : (
              ""
            )}
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
          {errors.condition ? (
            <p className={styles.errorMessage}>{errors.condition.message}</p>
          ) : (
            ""
          )}
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
  setProducts: PropTypes.func,
};

export default UploadProductModal;
