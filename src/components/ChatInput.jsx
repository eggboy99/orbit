import { useRef, useState } from "react";
import styles from "../assets/css/ChatInput.module.css";
import AttachImageIcon from "../assets/images/attach-file-icon.svg";
import SendMessageIcon from "../assets/images/send-message-icon.svg";
import { useForm } from "react-hook-form";
import BlackCloseIcon from "../assets/images/black-close-icon.svg";
import PropTypes from "prop-types";

const ChatInput = ({ socket, userDetails, product, user, setRefresh }) => {
  const sendMessageRef = useRef(null);
  const [message, setMessage] = useState(""); //
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  // Update the message state when user input is received
  const handleMessageInput = (event) => {
    setIsButtonDisabled(event.target.value.trim() === "");
    setMessage(event.target.value);
  };

  const fileInputRef = useRef(null);
  // Trigger the hidden file input when the image is clicked
  const handleAttachImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const [previewFiles, setPreviewFiles] = useState([]);

  // use to display error messages when the input validation fails
  const [uploadError, setUploadError] = useState("");

  // handle the image upload mechanism and uses the uploaded images for the previewFiles
  const handleImageUpload = (event) => {
    const images = event.target.files;
    const imagesUrls = [];
    if (images.length > 5) {
      setUploadError("You may only upload up to 5 images at a time.");
      return;
    }

    Array.from(images).forEach((image) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        imagesUrls.push(reader.result);
        // Only set the previewFiles once the imageUrls array has finished storing all the uploaded files
        if (imagesUrls.length === images.length) {
          setPreviewFiles(imagesUrls);
        }
      };

      reader.readAsDataURL(image);
      setIsButtonDisabled((previousState) => !previousState);
      setUploadError("");
    });
  };

  // Remove the image from the preview section when the x button is clicked
  const handleRemoveImage = (indexToRemove) => {
    setPreviewFiles((prevFiles) => {
      URL.revokeObjectURL(prevFiles[indexToRemove].preview);
      return prevFiles.filter((_, index) => index !== indexToRemove);
    });
    setIsButtonDisabled((previousState) => !previousState);
  };

  const { handleSubmit } = useForm();
  const handleMessageSubmission = async () => {
    const productId = product.id;
    const senderId = user;
    const recipientId = userDetails.user;

    try {
      await fetch(
        `http://localhost:3000/api/chat/uploadImage/${senderId}/${productId}/${recipientId}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(previewFiles),
        }
      );

      socket.emit("sendMessage", {
        productId,
        senderId,
        recipientId,
        message,
      });

      setMessage("");
      setPreviewFiles([]);
      setIsButtonDisabled((previousState) => !previousState);
      setRefresh((previousState) => !previousState);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  return (
    <form
      action=""
      className={styles.chatContainerForm}
      onSubmit={handleSubmit(handleMessageSubmission)}
    >
      {uploadError && <p className={styles.uploadError}>{uploadError}</p>}
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
              <img src={file} className={styles.uploadedImg} />
            </div>
          ))}
      </div>
      <img
        src={AttachImageIcon}
        alt="Attach Image Button Icon"
        className={styles.attachImageButton}
        onClick={handleAttachImageClick}
      />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".png, .jpg, .jpeg"
        multiple
        onChange={handleImageUpload}
      />
      <input
        type="text"
        className={styles.messageInput}
        value={message}
        placeholder="Type your message here .."
        onChange={handleMessageInput}
      />
      <button
        type="submit"
        className={styles.sendMessageButton}
        ref={sendMessageRef}
        disabled={isButtonDisabled}
      >
        <img
          src={SendMessageIcon}
          alt="Send Message Button Icon"
          className={isButtonDisabled ? styles.disabled : ""}
        />
      </button>
    </form>
  );
};

ChatInput.propTypes = {
  socket: PropTypes.object,
  userDetails: PropTypes.object,
  product: PropTypes.object,
  user: PropTypes.string,
  setRefresh: PropTypes.func,
};

export default ChatInput;
