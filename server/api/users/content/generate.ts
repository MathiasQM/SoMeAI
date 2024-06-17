import { defineEventHandler, readBody } from "h3";
import OpenAI from "openai";
import { createCorsHandler } from "../../../utils/cors";
import { formatForInstagram } from "../../../utils/users/content/helpers/instagram";
import { formatForFacebook } from "../../../utils/users/content/helpers/facebook";
import { PassThrough } from "stream";
import { db } from "../../../firebaseAdminConfig.js";

const config = useRuntimeConfig();
const openai = new OpenAI({
  apiKey: config.public.openai.apiKey,
});

const corsOptions = {
  allowedOrigins: ["http://localhost:3000", "https://someai--contentai-f4d3e.us-central1.hosted.app/contentai"],
  allowedMethods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

// CORS configuration
const corsHandler = createCorsHandler(corsOptions);

export default defineEventHandler(async (event) => {
  const req = event.node.req;
  const res = event.node.res;
  const stream = new PassThrough();

  return new Promise<void>((resolve, reject) => {
    corsHandler(req, res, async () => {
      try {
        const { channels, prompt, persona, contentName } = await readBody(event);
        const userId = persona.userId;
        const userDocRef = db.collection("contentCreation").doc();
        const personaDescription = persona.personaDescription;

        const namedContent = contentName || "New Content"; // TODO: This should be contextually generated

        await userDocRef.set(
          {
            userId: userId,
            sessionName: namedContent,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            personaId: persona.personaId,
          },
          { merge: true }
        );

        // Pipe the stream to the response early on
        res.setHeader("Content-Type", "application/json");
        stream.pipe(res);

        const channelPromises = channels.map((channel: string) =>
          handleChannelRequest(channel, persona, prompt, personaDescription, userDocRef, stream)
        );

        const data = await Promise.all(channelPromises);

        stream.end();

        resolve();
      } catch (error) {
        console.error(error);
        stream.write(JSON.stringify({ success: false, error: error.message }) + "\n");
        stream.end();
        reject(error);
      }
    });
  });
});

const handleChannelRequest = async (
  channel: string,
  persona: any,
  prompt: string,
  personaDescription: string,
  userDocRef: any,
  stream: PassThrough
) => {
  try {
    const formattedRequest = await formatRequestForChannel(channel, persona, personaDescription, prompt);
    if (!formattedRequest.systemPrompt && !formattedRequest.systemPrompt) {
      throw new Error("Failed to format request for channel: " + channel);
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: `${formattedRequest.systemPrompt}. Response in json format.` },
        { role: "user", content: `${formattedRequest.userPrompt}. Response in json format.` },
      ],
    });

    console.log(`Success for ${channel}`);

    let aiResponse;
    try {
      aiResponse = JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      throw new Error(`Failed to parse AI response: ${parseError.message}`);
    }
    console.log(aiResponse);

    await userDocRef.collection("content").add({
      channel,
      success: true,
      ...aiResponse,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    stream.write(JSON.stringify({ channel, success: true, aiResponse, description: personaDescription }) + "\n");
  } catch (error) {
    console.error(`Error for ${channel}:`, error);
    stream.write(JSON.stringify({ channel, success: false, error: "Failed to generate content" }) + "\n");
  }
};

async function formatRequestForChannel(channel: string, persona: any, personaDescription: string, prompt: string) {
  let formattedRequest;
  switch (channel) {
    case "Instagram":
      formattedRequest = await formatForInstagram(persona, personaDescription, prompt);
      break;
    case "Facebook":
      formattedRequest = await formatForFacebook(persona, personaDescription, prompt);
      break;
    default:
      throw new Error("Unsupported channel: " + channel);
  }
  return formattedRequest;
}
