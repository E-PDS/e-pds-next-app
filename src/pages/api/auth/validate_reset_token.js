import connectToDatabase from "@/lib/db";

const handler = async (req, res) => {
  try {
    const { token, email } = req.body;

    if (!token || !email) {
      return res.status(400).json({
        status: 'Failed',
        message: 'Token and email are required'
      });
    }

    const db = await connectToDatabase();

    // Find the user with this email and token
    const user = await db.collection("Admin Users").findOne({
      email,
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() } // Token must not be expired
    });

    if (!user) {
      return res.json({
        status: 'Failed',
        message: 'Invalid or expired reset token'
      });
    }

    return res.json({
      status: 'Success',
      message: 'Token is valid'
    });
  } catch (error) {
    console.error('Token validation error:', error);
    return res.status(500).json({
      status: 'Failed',
      message: 'Internal Server Error'
    });
  }
};

export default handler; 