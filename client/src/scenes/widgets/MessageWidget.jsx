import { Box, Divider, Input, Button, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import io from "socket.io-client";

const MessageWidget = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState(null);
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const [chat, setChat] = useState(null);
  const currentChat = useSelector((state) => state.currentChat);
  const scrollRef = React.useRef(null);
  const [socket, setSocket] = useState(null);
  const [friend, setFriend] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const newSocket = io(`${API_URL}`);
    setSocket(newSocket);
    console.log("socket connected");
    newSocket.on("receive_message", ({ receiver, ...rest }) => {
      if (receiver === user._id) {
        setMessages((prev) => [...prev, rest]);
      }
    });

    return () => {
      newSocket.off("receive_message");
      newSocket.close();
    };
  }, [user._id]);

  useEffect(() => {
    if (currentChat) {
      setChat(currentChat);
      setMessages(currentChat[0].messages);
    }
  }, [currentChat]);

  useEffect(() => {
    if (scrollRef.current) {
      const element = scrollRef.current;
      element.scrollTop = element.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (chat) {
      const friendId = chat[0].users.find((item) => item !== user._id);
      const getFriend = async () => {
        const response = await axios.get(
          `${API_URL}/users/${friendId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response;
        if (data) {
          setFriend(data.data);
        }
      };
      getFriend();
    }
  }, [chat, token, user._id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (chat) {
      setMessages(chat[0].messages);
      const userId = user._id;
      const friendId = chat[0].users.find((item) => item !== userId);
      socket.emit("send_message", {
        sender: userId,
        receiver: friendId,
        message: inputValue,
      });

      const sendMessage = async () => {
        const response = await axios.post(
          `${API_URL}/users/${userId}/${friendId}`,
          {
            message: inputValue,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response;
        if (data) {
          setMessages(data.data);
        }
        console.log(data);
      };
      sendMessage();
    }
    setInputValue("");
  };
  return (
    <WidgetWrapper
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      {/* Header */}
      <FlexBetween gap="0.5rem" pb="1.1rem">
        <FlexBetween gap="1rem"></FlexBetween>
        <Box
          width="100%"
          flex={1}
          bgcolor="neutral.light"
          borderRadius="1rem"
          padding="1rem"
        >
          {chat && friend && <>Chatting with {friend.firstName}</>}
        </Box>
      </FlexBetween>

      <Divider />

      {/* Messages */}
      <Box
        ref={scrollRef}
        width="100%"
        flex={2}
        borderRadius="1rem"
        padding="1rem"
        overflow={"auto"}
        height="400px"
        maxHeight="400px"
        display="flex"
        flexDirection="column"
      >
        {messages &&
          messages.map((item, index) => {
            return (
              <Box
                key={index}
                mb="0.5rem"
                display="flex"
                justifyContent={
                  item.sender === user._id ? "flex-end" : "flex-start"
                }
              >
                {item.sender !== user._id ? (
                  <Box
                    bgcolor="secondary.main"
                    color="white"
                    borderRadius="1rem"
                    padding="0.5rem 1rem"
                    display="inline-block"
                  >
                    {item.message}
                  </Box>
                ) : (
                  <Box
                    bgcolor="primary.main"
                    color="white"
                    borderRadius="1rem"
                    padding="0.5rem 1rem"
                    display="inline-block"
                  >
                    {item.message}
                  </Box>
                )}
              </Box>
            );
          })}
      </Box>

      {/* Input and Button */}
      <form onSubmit={handleSubmit}>
        <Box
          display="flex"
          alignItems="center"
          padding="0.5rem"
          bgcolor="neutral.light"
          border="1px solid rgba(0,0,0,0.1)"
          borderRadius="10px"
        >
          <Input
            fullWidth
            placeholder="Type your message here..."
            sx={{
              marginRight: "1rem",
            }}
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
          />
          <Button variant="contained" color="primary" type="submit">
            <SendIcon />
          </Button>
        </Box>
      </form>
    </WidgetWrapper>
  );
};

export default MessageWidget;
