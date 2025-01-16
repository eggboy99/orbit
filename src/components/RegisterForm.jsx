import styles from "../assets/css/RegisterForm.module.css";
import { useForm } from "react-hook-form";
import { useState } from "react";
import ImageUploadForm from "./ImageUploadForm";
import React from "react";
import CountryCodeSelector from "./CountryCodeSelector";
import RegistrationInputValidation from "../utils/RegistrationInputValidation.mjs";
import PropTypes from "prop-types";

const RegisterForm = ({ formInputs, buttons, testId }) => {
  // We declated both of these states in this component because we need the final state values for data submission to the backend server
  const [image, setImage] = useState(null);
  const [countryCode, setCountryCode] = useState("+65");

  // React Hook Form Utiities
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    data.mobileNumber = [...countryCode, ...data.mobileNumber].join("");
    data.image = image;
    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log(result);
  };

  return (
    <form data-testid={testId} action="" onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.container}>
        <div className={styles.formInputsContainer}>
          {formInputs.map((element, index) => {
            return (
              <React.Fragment key={index}>
                <div className={styles.formInputContainer}>
                  <img src={element.image} alt="Input Icon" />
                  {/* Display the country code component to users. This allow them to select their country code for the mobile number */}
                  {element.name === "mobileNumber" && (
                    <CountryCodeSelector
                      countryCode={countryCode}
                      setCountryCode={setCountryCode}
                    />
                  )}
                  {/* Generate the inputs based on the component properties */}
                  <input
                    type={element.inputType}
                    // Register each of the input to React Hook Form and we destructure the return validation value from the utility function
                    {...register(element.name, {
                      ...RegistrationInputValidation(element, getValues),
                    })}
                    placeholder={element.placeholder}
                    className={
                      element.name === "mobileNumber"
                        ? styles.formMobileNumberInput
                        : styles.formInput
                    }
                  />
                </div>
                {/* Utilizes React Hook Form error utility to display individual error message to the user.  */}
                {errors[element.name] && (
                  <p className={styles.errorMessage}>
                    {errors[element.name]?.message}
                  </p>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div className={styles.imageUploadForm}>
          <div className={styles.imagePlaceHolder}>
            {image && (
              <img
                src={image}
                alt="Profile Preview"
                className={styles.profileImage}
              />
            )}
          </div>
          <ImageUploadForm
            id="image-upload"
            setImage={setImage}
            register={register}
            errors={errors}
          />
          {/* The label here is for the input type in the ImageUploadForm component. The file input type in that component is hidden and so the label is used 
          as the input button. */}
          <label htmlFor="image-upload" className={styles.imageUploadLabel}>
            Upload your profile image
          </label>
          <p>Files Supported: PNG, JPG, JPEG</p>
          {errors.image && (
            <p className={styles.errorMessage}>{errors.image.message}</p>
          )}
        </div>
      </div>

      <div className={styles.buttonsContainer}>
        {buttons.map((button, index) => {
          return (
            <button type={button.type} key={index} data-testid={button.name}>
              {button.icon ? <img src={button.icon} /> : ""}
              {button.name}
            </button>
          );
        })}
      </div>
    </form>
  );
};

RegisterForm.propTypes = {
  formInputs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      inputType: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
    })
  ).isRequired,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      icon: PropTypes.string,
    })
  ).isRequired,
  testId: PropTypes.string.isRequired,
};

export default RegisterForm;
