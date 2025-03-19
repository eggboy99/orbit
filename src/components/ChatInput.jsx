import { useRef, useState } from "react";
import styles from "../assets/css/ChatInput.module.css";
import AttachImageIcon from "../assets/images/attach-file-icon.svg";
import SendMessageIcon from "../assets/images/send-message-icon.svg";
import { useForm } from "react-hook-form";
import BlackCloseIcon from "../assets/images/black-close-icon.svg";
import PropTypes from "prop-types";

const ChatInput = ({
  socket,
  userDetails,
  productDetails,
  user,
  selectedChat,
}) => {
  const sendMessageRef = useRef(null);
  const [message, setMessage] = useState("");
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
      setIsButtonDisabled(false);
      setUploadError("");
    });
  };

  // Remove the image from the preview section when the x button is clicked
  const handleRemoveImage = (indexToRemove) => {
    setPreviewFiles((prevFiles) => {
      return prevFiles.filter((_, index) => index !== indexToRemove);
    });

    // Ensure that fileInput value is reset to tell the browser to forget which files were previously selected
    // In this way, when user select the same file again after removing it prior, the browser will still consider it a change
    // and trigger the onChange event properly
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (message !== "") {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  };

  const { handleSubmit } = useForm();
  const handleMessageSubmission = async () => {
    const productId = productDetails._id;
    const senderId = user;
    let recipientId = userDetails.user;
    if (senderId === recipientId) {
      recipientId = selectedChat.senderId;
    }
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
  productDetails: PropTypes.object,
  user: PropTypes.string,
  selectedChat: PropTypes.object,
};

export default ChatInput;
