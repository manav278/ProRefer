import authdata from "../Model/authdata.js";
import bcrypt from "bcrypt";
import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
const secretKey = "PROREFER_SECRET_KEY";
import proreferuser from "../Model/proreferuser.js";
const expiresIn = 20;
let currentUserId;

function getUserId(id) {
  return currentUserId;
}

// Login routes
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, ' ', password);
  let user, match;
  try {
    user = await authdata.findOne({ Personal_Email: email});
    // console.log(user);
    const hashedPassword = user.Password;
    match = await bcrypt.compare(password, hashedPassword);
    // console.log(match);
    if (match) {
      let Id = await proreferuser.find({ Personal_Email: email });
      currentUserId = Id[0].User_ID;
      const token = jwt.sign({ Personal_Email: user.Personal_Email }, secretKey);
      res.json({ token });
    } else {
      res.json({ message: "Invalid email or password" });
    }

  } catch (e) {
    console.log(e);
  }
});

// Verify routes
router.get("/verify", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.status(401).json({ message: "Token is Null." });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err)
      return res.status(403).json({ message: "JWT not verified properly." });
    return res.status(200).json({ message: "JWT verified properly." });
  });
});

export default router;
export { getUserId };
