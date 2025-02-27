import PropTypes from "prop-types";
import styles from "../assets/css/UserRating.module.css";

const UserRating = ({ userRating }) => {
  return (
    <div className={styles.userRatingContainer}>
      {userRating === 0 ? (
        <p className={styles.reviewMessage}>User account has no reviews</p>
      ) : (
        ""
      )}
    </div>
  );
};

export default UserRating;

UserRating.propTypes = {
  userRating: PropTypes.number,
};
