const User = require("../models/User");
const axios = require("axios");

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map(async (friendId) => {
        const friend = await User.findById(friendId);
        return friend;
      })
    );

    const formattedFriends = friends.map(
      ({
        _id,
        firstName,
        lastName,
        occupation,
        location,
        picturePath,
        chats,
      }) => {
        return {
          _id,
          firstName,
          lastName,
          occupation,
          location,
          picturePath,
          chats,
        };
      }
    );
    res.status(200).json({ formattedFriends });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
      friend.friends.push(id);
      user.chats.push({ users: [id, friendId], messages: [] });
      friend.chats.push({ users: [id, friendId], messages: [] });
      user.markModified("chats");
      friend.markModified("chats");
    } else {
      user.friends = user.friends.filter((friend) => friend !== friendId);
      friend.friends = friend.friends.filter((friend) => friend !== id);
      user.chats = user.chats.filter((chat) => {
        return !chat.users.includes(friendId);
      });
      friend.chats = friend.chats.filter((chat) => {
        return !chat.users.includes(id);
      });
      user.markModified("chats");
      friend.markModified("chats");
    }
    console.log(user.chats);
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map(async (friendId) => {
        const friend = await User.findById(friendId);
        return friend;
      })
    );

    const formattedFriends = friends.map(
      ({
        _id,
        firstName,
        lastName,
        occupation,
        location,
        picturePath,
        chats,
      }) => {
        return {
          _id,
          firstName,
          lastName,
          occupation,
          location,
          picturePath,
          chats,
        };
      }
    );

    res.status(200).json({ formattedFriends });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getChat = async (req, res) => {
  try {
    const { id, friendId } = req.params;

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    const chat = user.chats.filter((chat) => {
      return chat.users.includes(friendId);
    });

    res.status(200).json(chat);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    console.log("body", req.body);
    const { id, friendId } = req.params;
    const { message } = req.body;

    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    const chat = user.chats.filter((chat) => {
      return chat.users.includes(friendId);
    });
    const friendChat = friend.chats.filter((chat) => {
      return chat.users.includes(id);
    });
    let updatedMessages = [...chat[0].messages];
    updatedMessages.push({ sender: id, message:message });
    chat[0].messages = updatedMessages;

    let friendUpdatedMessages = [...friendChat[0].messages];
    friendUpdatedMessages.push({ sender: id, message: message });
    friendChat[0].messages = friendUpdatedMessages;


    user.markModified("chats");
    friend.markModified("chats");

    await user.save();
    await friend.save();
    res.status(200).json(chat[0].messages);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  getUser,
  getUserFriends,
  addRemoveFriend,
  getChat,
  sendMessage,
};
