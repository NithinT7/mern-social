const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    try{
        let token = req.headers.authorization;
        if (!token) return res.status(403).json({error: "Authorization denied"});
        if (token.startsWith("Bearer ")) token = token.slice(7, token.length).trimLeft();
        const verify = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verify;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {verifyToken};