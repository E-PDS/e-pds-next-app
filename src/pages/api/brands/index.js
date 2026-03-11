import connectToDatabase from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, errorCode: 'METHOD_NOT_ALLOWED', message: "Method not allowed" });
  }

  try {
    const db = await connectToDatabase();

    const brands = await db.collection("brands").find({}).toArray();

    return res.status(200).json({ success: true, brands });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return res.status(500).json({ success: false, errorCode: "SERVER_ERROR", message: "Internal Server Error" });
  }

}