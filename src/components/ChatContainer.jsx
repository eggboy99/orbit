import styles from "../assets/css/ChatContainer.module.css";
import CloseButton from "../assets/images/white-close-icon.svg";
import PropTypes from "prop-types";
import ChatInput from "./ChatInput";
import { io } from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import TimeConversion from "../utils/TimeConversion.mjs";
import DateConversion from "../utils/DateConversion.mjs";
import CalcLastSeen from "../utils/CalcLastSeen.mjs";

const ChatContainer = ({
  isChatClose = false,
  handleChatContainerState = () => {},
  userDetails,
  productDetails,
  user,
  userStatus,
}) => {
  const [socket, setSocket] = useState(null); // use to control the socket states

  // connect to the websocket
  useEffect(() => {
    if (user && socket === null) {
      const newSocket = io.connect("http://localhost:3000", {
        auth: { token: user },
      });
      setSocket(newSocket);
    }
  }, [user, socket]);

  const [messages, setMessages] = useState([]); // use store the fetched messages from the backend server

  // emit a join room effect and ensuring that the user is joining the correct room
  useEffect(() => {
    if (socket && user && userDetails && productDetails) {
      const productId = productDetails._id;
      const senderId = user;
      const recipientId = userDetails.user;
      socket.emit("joinRoom", { productId, senderId, recipientId });
      socket.emit("getChatHistory", { productId, senderId, recipientId });
      const handleMessageHistory = (messageHistory) => {
        setMessages(messageHistory);
      };
      socket.on("messageHistory", handleMessageHistory);
      const handleReceiveMessage = (messageData) => {
        setMessages((previousState) => [...previousState, messageData]);
      };
      socket.on("receiveMessage", handleReceiveMessage);

      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
        socket.off("messageHistory", handleMessageHistory);
      };
    } else {
      return;
    }
  }, [socket, user, userDetails, productDetails]);

  // This reference is for ensuring that the chat container always scrolls to the bottom when there is a message sent / received
  const latestMessageRef = useRef();
  useEffect(() => {
    if (latestMessageRef.current) {
      latestMessageRef.current.lastElementChild?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [messages, isChatClose]);

  return (
    <div
      className={`${styles.chatContainer} ${isChatClose ? styles.open : ""}`}
    >
      <img
        src={CloseButton}
        alt="Close Chat Modal Button"
        className={styles.closeButton}
        onClick={handleChatContainerState}
      />
      <div className={styles.userContainer}>
        <div className={styles.userOnlineContainer}>
          {userDetails && userStatus && (
            <div
              className={
                userStatus && userStatus.online ? styles.onlineStatus : ""
              }
            ></div>
          )}

          <h3 className={styles.username}>
            {userDetails && userDetails && userDetails.username}
          </h3>
        </div>

        {userStatus && userStatus.online === false && (
          <p
            className={
              userStatus && userStatus.online === false ? styles.lastSeen : ""
            }
          >
            {userStatus && CalcLastSeen(userStatus.lastSeen)}
          </p>
        )}
      </div>
      <div className={styles.messagesContainer} ref={latestMessageRef}>
        {messages &&
          messages.map((message, index) => {
            return (
              <div
                key={index}
                className={
                  message.senderId === user
                    ? styles.senderContainer
                    : styles.recipientContainer
                }
              >
                {message &&
                  message.images.map((imageId, imageIndex) => {
                    const url = `http://localhost:3000/api/chat/images/retrieve/${message._id}/${imageId}`;
                    return (
                      <img
                        key={imageIndex}
                        src={url}
                        alt="Chat Message Image"
                        className={styles.messageImage}
                      />
                    );
                  })}
                {message && (
                  <p key={index} className={styles.message}>
                    {message.message}
                  </p>
                )}
                <p className={styles.messageDate}>
                  {DateConversion(message.createdAt)}
                </p>
                <p className={styles.messageTime}>
                  {TimeConversion(message.createdAt)}
                </p>
              </div>
            );
          })}
      </div>
      <div className={styles.inputsContainer}>
        <ChatInput
          socket={socket}
          userDetails={userDetails}
          productDetails={productDetails}
          user={user}
        />
      </div>
    </div>
  );
};

ChatContainer.propTypes = {
  isChatClose: PropTypes.bool,
  handleChatContainerState: PropTypes.func,
  userDetails: PropTypes.object,
  productDetails: PropTypes.object,
  user: PropTypes.string,
  userStatus: PropTypes.object,
};

export default ChatContainer;
