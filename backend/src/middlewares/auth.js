// middleware/auth.js
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.account_id = decoded.id; // gán account_id từ token
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
};
module.exports = verifyToken;
