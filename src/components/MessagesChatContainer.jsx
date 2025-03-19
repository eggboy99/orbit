import PropTypes from "prop-types";
import { useEffect, useState, useRef } from "react";
import styles from "../assets/css/MessagesChatContainer.module.css";
import CalcLastSeen from "../utils/CalcLastSeen.mjs";
import DateConversion from "../utils/DateConversion.mjs";
import TimeConversion from "../utils/TimeConversion.mjs";
import ChatInput from "./ChatInput";
import CloseButton from "../assets/images/white-close-icon.svg";

const MessagesChatContainer = ({
  user,
  senderId,
  recipientId,
  username,
  productId,
  online,
  lastSeen,
  selectedChat,
  socket,
  isLargeScreen,
  isChatOpen,
  setIsChatOpen,
}) => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    if (socket && user && senderId && recipientId && productId) {
      socket.emit("getChatHistory", {
        productId,
        senderId,
        recipientId,
      });
      const handleMessageHistory = (data) => {
        const senderIds = data.map((message) => {
          return message.senderId;
        });
        if (senderIds.includes(senderId)) {
          setMessages(data);
        }
      };
      socket.on("messageHistory", handleMessageHistory);
      const handleIncomingMessage = (messageData) => {
        const room1 =
          [senderId, recipientId].sort().join("-") + `-${productId}`;
        const room2 =
          [messageData.senderId, messageData.recipientId].sort().join("-") +
          `-${messageData.productId}`;
        if (room1 === room2) {
          setMessages((previousState) => [...previousState, messageData]);
        }
      };
      socket.on("receiveMessage", handleIncomingMessage);
      return () => {
        socket.off("messageHistory", handleMessageHistory);
        socket.off("receiveMessage", handleIncomingMessage);
      };
    } else {
      return;
    }
  }, [socket, user, senderId, recipientId, productId, selectedChat]);

  const [productDetails, setProductDetails] = useState(null);
  useEffect(() => {
    try {
      const fetchProductDetails = async () => {
        const request = await fetch(
          `http://localhost:3000/api/explore/retrieve-product/${productId}`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        const response = await request.json();
        setProductDetails(response.product);
      };
      fetchProductDetails();
    } catch (error) {
      console.log(`Error retrieving product details: ${error}.`);
    }
  }, [productId]);

  const latestMessageRef = useRef();
  useEffect(() => {
    if (latestMessageRef.current) {
      latestMessageRef.current.lastElementChild?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [messages]);

  return (
    <>
      {!isLargeScreen && isChatOpen ? (
        <img
          src={CloseButton}
          alt="Close Chat Modal Button"
          className={styles.closeButton}
          onClick={() => {
            setIsChatOpen(false);
          }}
        />
      ) : null}
      <div className={`${styles.userContainer} ${online ? styles.online : ""}`}>
        <div className={styles.userOnlineContainer}>
          {senderId && online && (
            <div className={online ? styles.onlineStatus : ""}></div>
          )}
        </div>
        <h3 className={styles.username}>{username && username}</h3>
        {online === false && (
          <p className={online === false ? styles.lastSeen : ""}>
            {lastSeen && CalcLastSeen(lastSeen)}
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
                  user === message.senderId
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
        {selectedChat && (
          <ChatInput
            socket={socket}
            user={user}
            productDetails={productDetails}
            userDetails={{ user: selectedChat.recipientId }}
            selectedChat={selectedChat}
          />
        )}
      </div>
    </>
  );
};

MessagesChatContainer.propTypes = {
  user: PropTypes.string,
  senderId: PropTypes.string,
  recipientId: PropTypes.string,
  username: PropTypes.string,
  productId: PropTypes.string,
  online: PropTypes.bool,
  lastSeen: PropTypes.string,
  selectedChat: PropTypes.object,
  socket: PropTypes.object,
  isLargeScreen: PropTypes.bool,
  isChatOpen: PropTypes.bool,
  setIsChatOpen: PropTypes.func,
};

export default MessagesChatContainer;
