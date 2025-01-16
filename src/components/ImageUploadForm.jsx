import styles from "../assets/css/ImageUpload.module.css";
import PropTypes from "prop-types";

const ImageUploadForm = ({ setImage, id, register }) => {
  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Selects the uploaded image
    if (!file) return;

    const reader = new FileReader(); // instantiate a new file reader

    reader.readAsDataURL(file); // Tells the FileReader to read the file as Base64-encoded data URL

    // onloadend is an event handler that gets triggered when the file has been completely read
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  return (
    <input
      type="file"
      accept=".png, .jpg, .jpeg"
      {...register("image", {
        required: "Profile Image is required",
      })}
      onChange={handleImageChange}
      className={styles.imageUpload}
      id={id}
    />
  );
};

ImageUploadForm.propTypes = {
  setImage: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
};

export default ImageUploadForm;
