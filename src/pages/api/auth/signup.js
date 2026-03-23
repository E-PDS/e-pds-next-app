import connectToDatabase from "@/lib/db"
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: "Failed", message: "Method Not Allowed" });
  }

  const db = await connectToDatabase();
  const {
    fullName, email, password,
    talukName, address, localBodyType, localBodyName, wardNo, eligibleMembers, annualIncome
  } = req.body;

  if (!fullName || !email || !password || !talukName || !address || !localBodyType || !localBodyName || !wardNo || !annualIncome || !eligibleMembers) {
    return res.status(400).json({ status: "Failed", message: "All required fields must be filled" });
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
      talukName: talukName,
      address: address,
      localBodyType: localBodyType,
      localBodyName: localBodyName,
      wardNo: wardNo,
      eligibleMembers: Number(eligibleMembers),
      annualIncome: Number(annualIncome),
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

      // Generate unique 10-digit card number
      let isUnique = false;
      let cardNumber = "";
      while (!isUnique) {
        cardNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const existingCard = await db.collection("e_card").findOne({ cardNumber });
        if (!existingCard) {
          isUnique = true;
        }
      }

      // Determine card color and name based on annual income
      const income = Number(annualIncome);
      let cardColor = "White";
      let cardName = "NP-NS";
      let priorityTitle = "Low Priority";

      if (income < 15000) {
        cardColor = "Yellow";
        cardName = "AAY";
        priorityTitle = "High Priority";
      } else if (income >= 15000 && income <= 24000) {
        cardColor = "Pink";
        cardName = "BPL";
        priorityTitle = "Medium Priority";
      } else if (income > 24000 && income <= 100000) {
        cardColor = "Blue";
        cardName = "APL";
        priorityTitle = "Normal Priority";
      } else {
        cardColor = "White";
        cardName = "NP-NS";
        priorityTitle = "Low Priority";
      }

      await db.collection("e_card").insertOne({
        userId: userId,
        fullName: fullName,
        cardNumber: cardNumber,
        color: cardColor,
        type: cardName,
        priority: priorityTitle,
        annualIncome: income,
        eligibleMembers: Number(eligibleMembers),
        address: address,
        talukName: talukName,
        wardNo: wardNo,
        localBodyType: localBodyType,
        localBodyName: localBodyName,
        status: "Active",
        issuedDate: new Date()
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
