import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const UserImage = ({ image, size = "60px" }) => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={!image.startsWith('https')?`${API_URL}/assets/${image}`: image}
      />
    </Box>
  );
};

export default UserImage;
