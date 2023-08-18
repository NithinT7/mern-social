const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
      chats,
    } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      picturePath,
      friends,
      location,
      occupation,
      chats,

    });
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        console.log(email);
        const user = await User.findOne({email});
        if (!user) return res.status(404).json({error: "User not found"});
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({error: "Wrong password"});
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
        delete user.password;
        res.status(200).json({token, user});
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { register, login };
