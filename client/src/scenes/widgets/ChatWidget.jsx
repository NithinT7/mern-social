import Friend from "components/Friend";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  Card,
  CardContent,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setCurrentChat } from "state";

const ChatWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const [chatList, setChatList] = useState(null);
  const dispatch = useDispatch();

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };
  const getFriends = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${userId}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    console.log(data);
    setFriends(data.formattedFriends);
  };

  const openChat = async (friendId) => {
    const response = await fetch(
        `http://localhost:3001/users/${userId}/${friendId}`,
        {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    const data = await response.json();
    if (data) {
        dispatch(setCurrentChat({chat: data}));
    }
    console.log(data);
  };

  useEffect(() => {
    getUser();
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!friends) {
      return;
    }
    const chatList = friends.map((friend, index) => {
      return (
        <Card
          key={index}
          sx={{
            "&:hover": {
              cursor: "pointer",
              backgroundColor: palette.background.alt,
            },
            width: "100%",
          }}
          onClick={() => openChat(friend._id)}
        >
          <CardContent>
            <FlexBetween gap="1rem">
              <Friend
                key={friend._id}
                friendId={friend._id}
                name={`${friend.firstName} ${friend.lastName}`}
                subtitle={friend.occupation}
                userPicturePath={friend.picturePath}
                addFriend={false}
              />
            </FlexBetween>
          </CardContent>
        </Card>
      );
    });
    setChatList(chatList);
  }, [friends]);

  if (!user) {
    return null;
  }

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween gap="0.5rem" pb="1.1rem">
        <FlexBetween gap="1rem">
          <Box>
            <Typography variant="h4" color={dark} fontWeight="500">
              Chat With
            </Typography>
          </Box>
        </FlexBetween>
      </FlexBetween>

      <Divider />
      <FlexBetween gap="0.5rem" pt="1.1rem">
        <Box width="100%">{chatList}</Box>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default ChatWidget;
