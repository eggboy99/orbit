import NavigationBar from "../components/NavigationBar";
import styles from "../assets/css/Messages.module.css";
import AuthenticationContext from "../context/AuthenticationContext";
import MobileMenuContext from "../context/MobileMenuContext";
import { useContext, useEffect, useState } from "react";
import UserChat from "../components/UserChat";
import MessagesChatContainer from "../components/MessagesChatContainer";
import { io } from "socket.io-client";

const Messages = () => {
  const { checkAuthStatus, user } = useContext(AuthenticationContext);
  const { isActive } = useContext(MobileMenuContext);
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const [groups, setGroups] = useState({});
  useEffect(() => {
    if (user) {
      const fetchUsersMessages = async () => {
        try {
          const request = await fetch(
            `http://localhost:3000/api/chat/get-all-messages/${user}`,
            {
              method: "GET",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
            }
          );

          const response = await request.json();
          const newGroups = {};
          for (const message of response.messages) {
            let room = [message.senderId, message.recipientId].sort();
            room = `${room[0]}-${room[1]}-${message.productId}`;
            if (!newGroups[room]) {
              const fetchUserDetailsRequest = await fetch(
                `http://localhost:3000/api/retrieve-user-profile/${
                  message.recipientId === user
                    ? message.senderId
                    : message.recipientId
                }`,
                {
                  method: "GET",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                }
              );

              const fetchUserDetailsResponse =
                await fetchUserDetailsRequest.json();
              const { username, online, lastSeen, userProfileImage } =
                fetchUserDetailsResponse;
              newGroups[room] = {
                username,
                senderId: message.senderId,
                recipientId: message.recipientId,
                productId: message.productId,
                messageCreation: message.createdAt,
                message: message.message,
                profileImage: userProfileImage,
                online,
                lastSeen,
              };
            }
          }
          setGroups(newGroups);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchUsersMessages();
    }
  }, [user]);

  const [selectedChat, setSelectedChat] = useState(null);

  const handleChatSelection = (chatData) => {
    setIsChatOpen((previousState) => !previousState);
    setSelectedChat(chatData);
  };

  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if (user) {
      const newSocket = io.connect("http://localhost:3000", {
        auth: { token: user },
      });

      setSocket(newSocket);
      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  // use to set the default chat selection (which is the latest chat)
  useEffect(() => {
    if (groups && Object.keys(groups).length > 0) {
      const groupsArr = Object.values(groups);
      if (groupsArr.length > 0) {
        const mostRecentMessage = groupsArr.reduce((latest, current) => {
          return new Date(current.messageCreation) >
            new Date(latest.messageCreation)
            ? current
            : latest;
        }, groupsArr[0]);
        if (!selectedChat) {
          setSelectedChat({
            senderId: mostRecentMessage.senderId,
            recipientId: mostRecentMessage.recipientId,
            username: mostRecentMessage.username,
            message: mostRecentMessage.message,
            productId: mostRecentMessage.productId,
            profileImage: mostRecentMessage.profileImage,
            online: mostRecentMessage.online,
            lastSeen: mostRecentMessage.lastSeen,
          });
        }
      }
    }
  }, [groups, selectedChat, socket, user]);

  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1280);

  useEffect(() => {
    setIsLargeScreen(window.innerWidth > 1280);

    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 1280);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <NavigationBar />
      {isActive ? null : (
        <main className={styles.chatContainer}>
          <div
            className={`${styles.messagesContainer} ${
              !isLargeScreen ? styles.smallScreen : ""
            } ${
              isChatOpen && !isLargeScreen
                ? styles.messagesContainerSmall
                : null
            }`}
          >
            {isLargeScreen || isChatOpen
              ? selectedChat && (
                  <MessagesChatContainer
                    user={user}
                    senderId={selectedChat.senderId}
                    recipientId={selectedChat.recipientId}
                    productId={selectedChat.productId}
                    username={selectedChat.username}
                    online={selectedChat.online}
                    lastSeen={selectedChat.lastSeen}
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat}
                    socket={socket}
                    isLargeScreen={isLargeScreen}
                    isChatOpen={isChatOpen}
                    setIsChatOpen={setIsChatOpen}
                  />
                )
              : null}
          </div>
          <div className={styles.usersContainer}>
            {groups &&
              Object.values(groups)
                .sort((a, b) => {
                  return (
                    new Date(b.messageCreation) - new Date(a.messageCreation)
                  );
                })
                .map((group, index) => {
                  return (
                    <UserChat
                      user={user}
                      senderId={group.senderId}
                      recipientId={group.recipientId}
                      username={group.username}
                      profileImage={group.profileImage}
                      product={group.productId}
                      online={group.online}
                      latestMessage={group.message}
                      selectedChat={selectedChat}
                      handleChatSelection={() =>
                        handleChatSelection({
                          senderId: group.senderId,
                          recipientId: group.recipientId,
                          username: group.username,
                          productId: group.productId,
                          profileImage: group.profileImage,
                          online: group.online,
                          lastSeen: group.lastSeen,
                        })
                      }
                      socket={socket}
                      setGroups={setGroups}
                      isLargeScreen={isLargeScreen}
                      setIsChatOpen={setIsChatOpen}
                      key={index}
                    />
                  );
                })}
          </div>
        </main>
      )}
    </>
  );
};

export default Messages;
