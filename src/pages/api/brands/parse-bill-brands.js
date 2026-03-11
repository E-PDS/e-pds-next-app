import { GoogleGenerativeAI } from "@google/generative-ai";
import connectToDatabase from "@/lib/db";
import withFileUpload from "@/utils/withFileUpload";
import s3 from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { BRAND_GENERATION_PROMPT } from "@/lib/aiPrompts";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req, res, { files }) {
  if (!files || files.length === 0) {
    return res.status(400).json({
      success: false,
      errorCode: "NO_FILE",
      message: "No files uploaded",
    });
  }

  try {
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = BRAND_GENERATION_PROMPT;

    // Fetch from S3
    const imageParts = await Promise.all(
      files.map(async (f) => {
        const command = new GetObjectCommand({
          Bucket: process.env.NEXT_PUBLIC_APP_BUCKET_NAME,
          Key: f.tmpKey,
        });
        const s3Response = await s3.send(command);
        const base64Data = await s3Response.Body.transformToString("base64");

        return {
          inlineData: {
            data: base64Data,
            mimeType: f.mimeType,
          },
        };
      })
    );

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    // Clean markdown if present
    const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
    let parsedData;

    try {
      parsedData = JSON.parse(jsonString);
    } catch (e) {
      // Fallback: try to find array in text if simple parse fails
      const match = text.match(/\[.*\]/s);
      if (match) {
        parsedData = { brands: JSON.parse(match[0]) };
      } else {
        throw new Error("Failed to parse AI response as JSON");
      }
    }

    const brandList = parsedData.brands || [];

    // Filter Duplicates from DB
    const db = await connectToDatabase();

    // Normalize for case-insensitive comparison
    const distinctBrands = brandList.reduce((acc, current) => {
      const x = acc.find(item => item.brandName.toLowerCase() === current.brandName.toLowerCase());
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    const existingDocs = await db.collection("brands").find({
      brandName: { $in: distinctBrands.map(b => new RegExp(`^${b.brandName}$`, 'i')) }
    }).project({ brandName: 1 }).toArray();

    const existingSet = new Set(existingDocs.map(d => d.brandName.toLowerCase()));

    const newBrands = distinctBrands.filter(b => !existingSet.has(b.brandName.toLowerCase()));
    const duplicatesCount = distinctBrands.length - newBrands.length;

    // Format for the frontend
    const formattedBrands = newBrands.map(item => ({
      brandName: item.brandName,
      websiteURL: item.websiteUrl || '',
      description: item.description || 'Extracted from bill via AI',
      active: true
    }));

    return res.status(200).json({
      success: true,
      data: formattedBrands,
      duplicatesFound: duplicatesCount
    });

  } catch (error) {
    console.error("Error extracting brands:", error);
    return res.status(500).json({
      success: false,
      errorCode: "PARSE_ERROR",
      message: "Failed to extract brands: " + error.message,
    });
  }
}

export default withFileUpload(handler);
