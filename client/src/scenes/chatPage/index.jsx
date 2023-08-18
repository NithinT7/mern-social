import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import ChatWidget from "scenes/widgets/ChatWidget";
import Navbar from "scenes/navbar";
import MessageWidget from "scenes/widgets/MessageWidget";

const ChatPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);

  return (

    <Box>
        <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        flexDirection={isNonMobileScreens ? "row" : "column"}
        gap="0.5rem"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <ChatWidget userId={_id} picturePath={picturePath} />
        </Box>
        <Box flexBasis={isNonMobileScreens ? "74%" : undefined}>
            <MessageWidget userId={_id} />
        </Box>
      </Box>
    </Box>
  );
};

export default ChatPage;
