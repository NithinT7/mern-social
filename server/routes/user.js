const express = require("express");
const {getUser, getUserFriends, addRemoveFriend, getChat, sendMessage, editUser} = require("../controllers/user");
const{ verifyToken } = require("../middleware/auth");
const router = express.Router();

router.get("/:id", verifyToken, getUser);
router.post("/:id", verifyToken, editUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
router.get("/:id/:friendId", verifyToken, getChat);
router.post("/:id/:friendId", verifyToken, sendMessage);


module.exports = router;

