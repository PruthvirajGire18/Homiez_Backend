import { StreamChat } from "stream-chat";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error("Stream API key or secret missing");
}

const serverClient = StreamChat.getInstance(apiKey, apiSecret);

export const createStreamUser = async ({ id, name, image }) => {
  if (!id) {
    throw new Error("User ID is required for Stream");
  }

  try {
    await serverClient.upsertUser({
      id: id.toString(),   // 🔥 MUST BE STRING
      name,
      image: image || "",
    });

    console.log("Stream user created:", name);
  } catch (error) {
    console.error("error in createStreamUser", error);
    throw error;
  }
};

export const generateStreamToken = (userId) => {
  try {
    const token=userId.toString();
    return serverClient.createToken(token);
  } catch (error) {
    console.error("Error generating Stream token:", error);
  }
}

export default serverClient;
