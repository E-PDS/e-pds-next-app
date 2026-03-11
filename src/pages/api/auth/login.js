import connectToDatabase from "@/lib/db"
// import withCors from "../../lib/withCors";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';

const handler = async (req, res) => {

  const db = await connectToDatabase();

  // Use aggregation pipeline to fetch user with populated roles
  const user = await db.collection("users").findOne({ "email": req.body.email });

  // console.log(user);
  var status = "Failed";

  if (user) {
    console.log("login.js: User found");
    if (await bcrypt.compare(req.body.password, user["passwordHash"])) {
      console.log("login.js: Password matched");
      status = "Success";
      var token = crypto.randomBytes(16).toString('hex');
      console.log(token);

      await db.collection("user_sessions").updateMany(
        { "userId": user._id, "status": "Active" },
        { $set: { "status": "Inactive", "message": "Logged in from another device", "updatedAt": new Date() } }
      );

      db.collection("user_sessions").insertOne({
        "sessionToken": token,
        "userId": user._id,
        "status": "Active",
        "lastAccess": new Date(),
        "createdAt": new Date()
      });

      res.json({
        status: status,
        userSession: {
          "userId": user["_id"],
          "fullName": user["fullName"],
          "sessionToken": token,
        }
      });
    } else {
      console.log("login.js: Wrong Password");
      res.json({
        status: status,
        message: "Invalid Credentials"
      });
    }
  } else {
    console.log("login.js: User not found");
    res.json({
      status: status,
      message: "Invalid Credentials"
    });
  }
}

export default handler;