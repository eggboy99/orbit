import styles from "../assets/css/ImageUpload.module.css";
import PropTypes from "prop-types";

const ImageUploadForm = ({ setImage, id, register, setFileError }) => {
  const maxSize = 5 * (1024 * 1024);
  const { onChange: registerOnChange, ...registerRest } = register("image", {
    required: "Profile image is required",
    validate: (data) => {
      if (data[0].size > maxSize) {
        return "Please select an image smaller than 5MB";
      }
    },
  });

  const handleImageChange = async (event) => {
    await registerOnChange(event);

    const file = event.target.files[0]; // Get the first file of the input element

    if (!file) return;
    if (file.size > maxSize) {
      setFileError("Please select an image smaller than 5MB");
      return;
    }

    const reader = new FileReader(); // Create a new File Reader

    reader.readAsDataURL(file); // Read the file as a base64 encoded string

    reader.onloadend = () => {
      setImage(reader.result); // Set the image when the file has been read
    };
  };

  return (
    <input
      type="file"
      className={styles.imageUpload}
      onChange={handleImageChange}
      accept=".png, .jpg, .jpeg"
      id={id}
      data-testid="imageInput"
      {...registerRest}
    />
  );
};

ImageUploadForm.propTypes = {
  setImage: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  setFileError: PropTypes.func.isRequired,
};

export default ImageUploadForm;
