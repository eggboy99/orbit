import NavigationBar from "../components/NavigationBar";
import styles from "../assets/css/OTPVerification.module.css";
import { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticationContext from "../context/AuthenticationContext";

const OTPVerification = () => {
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setAuthentication } = useContext(AuthenticationContext);

  // Only allow single digit in each number input
  const onChangeHandler = (e, index) => {
    const value = e.target.value;
    // If each input value exceeds 9, we remove the last digit. This is to limit each input to only a single digit
    if (value > 9) {
      e.target.value = value.slice(0, 1);
    }

    // Assign the input value into the OTP String array according to the input index
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    if (value !== "" && index < inputRefs.length - 1) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && e.target.value === "") {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const OTP = otpValues.join(""); // Combine the OTP values into a single string
    // Ensure that the OTP final values has 4 digits
    if (OTP.length < 4) {
      setError(
        "Please enter the complete 4-digit verification code to continue"
      );
    }
    const request = await fetch(
      "http://localhost:3000/api/auth/register/verify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ otp: OTP }),
      }
    );

    const response = await request.json();
    if (response.success === false && OTP.length === 4) {
      setError(response.message);
    }
    navigate(response.redirect);
  };

  const [time, setTime] = useState(30);
  const [isRunning, setIsRunning] = useState(true);

  // This click function handles the resend OTP logic
  const handleClick = async (e) => {
    e.target.disabled = false;
    // Reset the timer when OTP is sent
    setIsRunning(true);
    setTime(30);
    const request = await fetch(
      "http://localhost:3000/api/auth/register/verify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    const response = request.json();
    setError(response.message);
    if (response.success) {
      setAuthentication(true);
    }
  };

  // Run the timer
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isRunning) {
        setTime((previousTime) => {
          if (previousTime <= 0) {
            setIsRunning(false);
          }

          return previousTime - 1;
        });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  return (
    <>
      <NavigationBar />
      <main>
        <div className={styles.headingContainer}>
          <h1>Verify your email address</h1>
          <h2>
            Please enter the one-time verification code (OTP) we sent to your
            email address
          </h2>
        </div>
        <form className={styles.OTPForm} onSubmit={handleSubmit}>
          <div className={styles.OTPContainer}>
            <div className={styles.inputsContainer}>
              {inputRefs.map((ref, index) => (
                <input
                  key={index}
                  type="number"
                  ref={ref}
                  onChange={(e) => onChangeHandler(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>
            <p>
              <button
                className={styles.OTPButton}
                disabled={time > 0 && time <= 30}
                onClick={handleClick}
              >
                Resend OTP
              </button>
              {time > 0 && time <= 30 ? <span> in {time} seconds</span> : null}
            </p>
          </div>

          <button className={styles.submitBtn} type="submit">
            Submit
          </button>
        </form>
        {error ? <p className={styles.errorMessage}>{error}</p> : null}
      </main>
    </>
  );
};

export default OTPVerification;
