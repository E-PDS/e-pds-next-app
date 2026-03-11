import connectToDatabase from "@/lib/db";

export default async function handler(req, res) {

  const { token } = req.body;

  if (!token) {
    console.log("verify_session: No session token provided")
    return res.status(401).json({ success: false, errorCode: "NO_TOKEN", message: 'No token provided' });
  }

  try {
    const db = await connectToDatabase();
    const session = await db.collection("user_sessions").findOne({ "sessionToken": token });

    if (session) {

      if (session["status"] != "Active") {
        await db.collection("user_sessions").deleteOne({ "sessionToken": token });
        return res.status(401).json({ success: false, errorCode: "SESSION_INACTIVE", message: session["message"] });
      }

      // console.log('verify_session: Session verification successful');
      return res.status(200).json({
        success: true,
        valid: true,
        sessionToken: session,
      });
    } else {
      console.log('verify_session: Invalid session token');
      return res.status(401).json({ success: false, errorCode: "INVALID_TOKEN", message: 'Invalid session token' });
    }
  } catch (error) {
    console.error('verify_session:Session verification error:', error);
    return res.status(503).json({ success: false, errorCode: "DATABASE_ERROR", message: 'Database connection error' });
  }
} 