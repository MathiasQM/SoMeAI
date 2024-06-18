import { defineEventHandler, readBody } from "h3";
import OpenAI from "openai";
import { createCorsHandler } from "../../../utils/cors";

import { admin, db } from "../../../firebaseAdminConfig.js";

const corsOptions = {
  allowedOrigins: ["http://localhost:3000", "https://someai--contentai-f4d3e.us-central1.hosted.app"],
  allowedMethods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

const openai = new OpenAI({
  apiKey: process.env.NUXT_OPENAI_API_KEY,
});

// CORS configuration
const corsHandler = createCorsHandler(corsOptions);

export default defineEventHandler(async (event) => {
  const req = event.node.req;
  const res = event.node.res;
  
  return new Promise<void>((resolve, reject) => {
      corsHandler(req, res, async () => {
          try {
              const { channel, prompt, personaDescription, userId, postContent } = await readBody(event);
              
              // Set headers for streaming
                res.setHeader("Content-Type", "application/json");
                res.setHeader("Transfer-Encoding", "chunked");
                try {
                    const stream = await openai.chat.completions.create({
                      model: "gpt-4o",
                      messages: [
                        { role: "system", content: `Use this persona description "${personaDescription}" and the user prompt to rewrite this post "${postContent}" for ${channel}.` },
                        { role: "user", content: `${prompt}.` },
                      ],
                      stream: true,
                    });
          
                    for await (const chunk of stream) {
                      const content = chunk.choices[0]?.delta?.content || "";
                      if (content) {
                        res.write(JSON.stringify({ content }));
                      }
                    }
                    res.end();
                  } catch (error) {
                    console.error(error);
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: error.message }));
                  }

                resolve();
            } catch (error) {
                console.error(error);
                reject(error);
            }
    });
  });
});
