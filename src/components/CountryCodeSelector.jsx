import { countryPhoneCodes } from "../utils/CountryCodes.mjs";
import styles from "../assets/css/CountryCodeSelector.module.css";
import dropdownIcon from "../assets/images/arrow-down-icon.svg";
import { useState } from "react";
import PropTypes from "prop-types";

const CountryCodeSelector = ({ countryCode, setCountryCode }) => {
  const [isOpen, setIsOpen] = useState(false); // State used to manage the selection of country codes menu
  const selectOption = (data) => {
    setCountryCode(data);
    setIsOpen((previousState) => !previousState);
  };

  const toggleDropDown = () => {
    setIsOpen((previousState) => !previousState);
  };

  return (
    <>
      <div
        data-testid="countryCodeInput"
        className={styles.selectCountryCodeBtn}
        onClick={() => toggleDropDown()}
      >
        <p>{countryCode} </p>
        <img src={dropdownIcon} alt="Country Code" />
      </div>
      <div
        className={`${styles.countryCodesContainer} ${
          isOpen ? styles.open : ""
        }`}
        data-testid="countryCodes"
      >
        <ul>
          {countryPhoneCodes.map((country, index) => (
            <li
              key={index}
              data-testid="countryCode"
              onClick={() => selectOption(country.code)}
            >
              {country.code}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

CountryCodeSelector.propTypes = {
  countryCode: PropTypes.string.isRequired,
  setCountryCode: PropTypes.func.isRequired,
};

export default CountryCodeSelector;
