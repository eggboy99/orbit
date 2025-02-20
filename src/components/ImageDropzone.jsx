import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import styles from "../assets/css/ImageDropzone.module.css";
import ImageIcon from "../assets/images/image-icon.svg";
import PropTypes from "prop-types";
import BlackCloseIcon from "../assets/images/black-close-icon.svg";

const ImageDropzone = ({ onChange, error, setValue }) => {
  const [previewFiles, setPreviewFiles] = useState([]);
  const [fileError, setFileError] = useState([]);

  // Handle the after effect of users uploading the file
  const onDrop = useCallback(
    (acceptedFiles) => {
      setFileError([]); // Resets the fileError so that no same error will appear more than once
      const maxSize = 5 * 1024 * 1024;
      for (let file of acceptedFiles) {
        if (file.size > maxSize) {
          setFileError((previousError) => {
            const errorMessage = "Please select an image smaller than 5MB!";
            return [...previousError, errorMessage];
          });
          return; // Prevent the image previewing if the file size is more than 5mb
        }
      }
      const filesWithPreview = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );

      // Update the original filesand the previewFiles state
      onChange(filesWithPreview);
      setPreviewFiles(filesWithPreview);
    },
    [onChange]
  );

  // Use the rejected files as a condition for error display purpose
  const onDropRejected = useCallback((fileRejections) => {
    const errorMessage = "You can only upload a maximum of 5 images!";
    if (fileRejections.length > 0) {
      setFileError((previousError) => {
        return [...previousError, errorMessage];
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: { "image/jpeg": [], "image/png": [], "image/jpg": [] },
    multiple: true,
    maxFiles: 5,
  });

  // Update the files state when user remove the image from the previewFiles. This is to ensure the original files state
  // is updated to the correct number of files to submit to the backend server.
  useEffect(() => {
    setValue("images", previewFiles);
    return () => {
      previewFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [previewFiles, setValue]);

  // Remove the image from the preview section when the x button is clicked
  const handleRemoveImage = (indexToRemove) => {
    setPreviewFiles((prevFiles) => {
      URL.revokeObjectURL(prevFiles[indexToRemove].preview);
      return prevFiles.filter((_, index) => index !== indexToRemove);
    });
  };

  return (
    <>
      <div
        {...getRootProps({
          className: `${styles.dropzoneContainer} ${
            isDragActive ? styles.dragActive : ""
          }`,
        })}
      >
        <img
          src={ImageIcon}
          alt="Upload Image Icon"
          className={styles.imageIcon}
        />
        <input {...getInputProps()} />
        <p className={styles.uploadGuideMsg}>
          Click to upload or drag and drop
        </p>
        <p className={styles.supportedFilesMsg}>
          Supported File Formats: PNG, JPG, JPEG <br />
          Maximum Uploads: 5 images
        </p>
        <div className={styles.errorContainer}>
          {fileError !== undefined &&
            fileError.map((error, index) => (
              <p key={index} className={styles.errorMessage}>
                {error}
              </p>
            ))}
          {error ? <p className={styles.errorMessage}>{error}</p> : null}
        </div>
      </div>
      <div className={styles.uploadedImgContainer}>
        {previewFiles.length > 0 &&
          previewFiles.map((file, index) => (
            <div key={index} className={styles.imageContainer}>
              <img
                src={BlackCloseIcon}
                alt="Remove Uploaded Image Icon"
                className={styles.removeImage}
                onClick={() => handleRemoveImage(index)}
              />
              <img src={file.preview} className={styles.uploadedImg} />
            </div>
          ))}
      </div>
    </>
  );
};

ImageDropzone.propTypes = {
  onChange: PropTypes.func,
  setValue: PropTypes.func,
  error: PropTypes.string,
};

export default ImageDropzone;
