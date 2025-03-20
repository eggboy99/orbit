import { useEffect, useState } from "react";
import styles from "../assets/css/UserChat.module.css";
import PropTypes from "prop-types";
import DeleteIcon from "../assets/images/delete-icon.svg";
import { useNavigate } from "react-router-dom";

const UserChat = ({
  senderId,
  recipientId,
  username,
  profileImage,
  product,
  handleChatSelection,
  selectedChat,
  isLargeScreen,
  socket,
  setIsChatOpen,
  user,
  deleteChat,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const unseenMessagesKey = `unseenMessages_${senderId}_${recipientId}_${product}`;
  const [unseenMessages, setUnseenMessages] = useState(() => {
    const savedMessages = localStorage.getItem(unseenMessagesKey);
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  useEffect(() => {
    localStorage.setItem(unseenMessagesKey, JSON.stringify(unseenMessages));
  }, [unseenMessages, unseenMessagesKey]);

  useEffect(() => {
    if (!selectedChat) return;
    const isThisChatSelected =
      selectedChat.senderId === senderId &&
      selectedChat.recipientId === recipientId &&
      selectedChat.productId === product;
    setIsSelected(isThisChatSelected);
    if (isThisChatSelected) {
      setUnseenMessages([]);
      localStorage.removeItem(unseenMessagesKey);
    }
  }, [
    selectedChat,
    senderId,
    recipientId,
    product,
    unseenMessagesKey,
    isLargeScreen,
    setIsChatOpen,
  ]);

  const [latestMessage, setLatestMessage] = useState("");

  useEffect(() => {
    if (socket && user) {
      socket.emit("joinAllRooms", { user: user });
      const handleReceiveMessage = (data) => {
        if (data.senderId === senderId && data.recipientId === recipientId) {
          setLatestMessage(data.message);
          if (!isSelected) {
            setUnseenMessages((previousState) => [
              ...previousState,
              data.message,
            ]);
          }
        }
      };

      socket.on("receiveMessage", handleReceiveMessage);
      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, [socket, user, isSelected, senderId, recipientId]);

  useEffect(() => {
    if (socket && user) {
      const handleMessageHistory = (data) => {
        for (let i = 0; i < data.length; ++i) {
          if (
            data[i].senderId === senderId &&
            data[i].recipientId === recipientId
          ) {
            setChatHistory((previousState) => {
              if (!previousState.includes(data[i].message)) {
                return [...previousState, data[i].message];
              } else {
                return [...previousState];
              }
            });
          }
        }
      };
      socket.emit("getChatHistory", {
        senderId: senderId,
        recipientId: recipientId,
        productId: product,
      });
      socket.on("messageHistory", handleMessageHistory);
      return () => {
        socket.off("messageHistory", handleMessageHistory);
      };
    }
  }, [socket, user, senderId, recipientId, product]);

  const [online, setOnline] = useState(false);

  useEffect(() => {
    if (!socket || !senderId) return;
    socket.emit("getOnlineStatus", { userId: senderId });
    const handleStatusUpdate = (data) => {
      if (data.userId === senderId) {
        setOnline(data.onlineStatus);
      }
    };
    socket.on("retrieveOnlineStatus", handleStatusUpdate);
    socket.on("userStatusChange", handleStatusUpdate);

    return () => {
      socket.off("retrieveOnlineStatus", handleStatusUpdate);
      socket.off("userStatusChange", handleStatusUpdate);
    };
  }, [socket, senderId]);

  const navigate = useNavigate();
  const handleNavigateUserProfile = () => {
    navigate(`/profile/${user}`);
  };

  return (
    <div
      className={`${styles.userChatContainer} ${
        isSelected && isLargeScreen ? styles.selected : ""
      } ${!isLargeScreen ? styles.smallScreen : ""}`}
      onClick={handleChatSelection}
    >
      {unseenMessages && unseenMessages.length >= 1 ? (
        <div className={styles.unseenMessages}>
          <p>{unseenMessages.length}</p>
        </div>
      ) : null}
      <img
        src={profileImage}
        alt="Recipient Profile Image"
        className={styles.recipientProfileImage}
        onClick={(e) => {
          e.stopPropagation();
          handleNavigateUserProfile();
        }}
      />
      <div className={styles.usernameAndMessage}>
        <p className={styles.username}>{username}</p>
        <p className={styles.latestMessage}>
          {latestMessage || chatHistory[chatHistory.length - 1]}
        </p>
      </div>
      <div
        className={`${styles.onlineStatusAndDelete} ${
          !isLargeScreen ? styles.smallScreen : ""
        }`}
      >
        <span className={online ? styles.online : styles.offline}></span>
        <img
          src={DeleteIcon}
          alt="Delete Chat Icon"
          className={styles.deleteChatButton}
          onClick={(e) => {
            e.stopPropagation();
            deleteChat();
          }}
        />
      </div>
    </div>
  );
};

UserChat.propTypes = {
  senderId: PropTypes.string,
  recipientId: PropTypes.string,
  username: PropTypes.string,
  profileImage: PropTypes.string,
  product: PropTypes.string,
  handleChatSelection: PropTypes.func,
  selectedChat: PropTypes.object,
  socket: PropTypes.object,
  user: PropTypes.string,
  isLargeScreen: PropTypes.bool,
  setIsChatOpen: PropTypes.func,
  deleteChat: PropTypes.func,
};

export default UserChat;
