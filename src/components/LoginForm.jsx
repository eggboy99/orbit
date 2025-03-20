import styles from "../assets/css/LoginForm.module.css";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import LoginInputValidation from "../utils/LoginInputValidation.mjs";
import AuthenticationContext from "../context/AuthenticationContext";

const Form = ({ formInputs, buttons, testId }) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setError,
  } = useForm();

  const navigate = useNavigate();

  const { setAuthentication } = useContext(AuthenticationContext);

  const onSubmit = async (data) => {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result.success === false) {
      setError("password", {
        type: "server",
        message: result.message,
      });
    } else if (result.success) {
      setAuthentication(true);
      navigate(result.redirectTo, { replace: true });
    }
  };

  // Bring user to the google authentication page
  const handleGoogleLogin = (event) => {
    try {
      event.preventDefault();
      window.location.href = "http://localhost:3000/api/auth/google/";
    } catch (error) {
      console.log("Google Authentication Error: ", error);
    }
  };

  return (
    <form action="" onSubmit={handleSubmit(onSubmit)} data-testid={testId}>
      <div className={styles.formInputsContainer}>
        {formInputs.map((element, index) => {
          return (
            <React.Fragment key={index}>
              <div className={styles.formInputContainer}>
                <img src={element.image} alt="Input Icon" />
                <input
                  type={element.inputType}
                  {...register(element.name, {
                    ...LoginInputValidation(element, getValues),
                  })}
                  placeholder={element.placeholder}
                  className={styles.formInput}
                />
              </div>
              {errors[element.name] && (
                <p className={styles.errorMessage}>
                  {errors[element.name]?.message}
                </p>
              )}
            </React.Fragment>
          );
        })}

        {/* <Link to="/reset-password" className={styles.forgotPassword}>
          Forgot your password?
        </Link> */}
      </div>

      <div className={styles.buttonsContainer}>
        {buttons.map((button, index) => {
          return (
            <button
              onClick={button.icon ? handleGoogleLogin : undefined}
              type={button.type}
              key={index}
            >
              {button.icon ? <img src={button.icon} /> : ""}
              {button.name}
            </button>
          );
        })}
      </div>
    </form>
  );
};

Form.propTypes = {
  formInputs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      inputType: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
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

export default Form;
