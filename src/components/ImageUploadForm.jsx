import styles from "../assets/css/ImageUpload.module.css";
import PropTypes from "prop-types";

const ImageUploadForm = ({ setImage, id, register }) => {
  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Get the first file of the input element
    if (!file) return;

    const reader = new FileReader(); // Create a new File Reader

    reader.readAsDataURL(file); // Read the file as a base64 encoded string

    reader.onloadend = () => {
      setImage(reader.result); // Set the image when the file has been read
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
      data-testid="imageInput"
    />
  );
};

ImageUploadForm.propTypes = {
  setImage: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
};

export default ImageUploadForm;
