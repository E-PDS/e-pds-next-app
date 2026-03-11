import connectToDatabase from "@/lib/db"
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: "Failed", message: "Method Not Allowed" });
  }

  const db = await connectToDatabase();
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ status: "Failed", message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ status: "Failed", message: "Email is already registered" });
    }

    // Hash the password securely
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create the user record
    const result = await db.collection("users").insertOne({
      fullName: fullName,
      email: email,
      passwordHash: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "Active"
    });

    if (result.acknowledged) {
      // Create an automatic login session
      const token = crypto.randomBytes(16).toString('hex');
      const userId = result.insertedId;

      await db.collection("user_sessions").insertOne({
        sessionToken: token,
        userId: userId,
        status: "Active",
        lastAccess: new Date(),
        createdAt: new Date()
      });

      return res.status(201).json({
        status: "Success",
        success: true,
        message: "User registered successfully",
        userSession: {
          userId: userId,
          fullName: fullName,
          sessionToken: token,
        }
      });
    } else {
      return res.status(500).json({ status: "Failed", message: "Could not create user account" });
    }
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ status: "Failed", message: "Internal server error" });
  }
}

export default handler;
