// server/api/hello.ts
import { defineEventHandler, createError, readBody } from "h3";
import OpenAI from "openai";
import { createCorsHandler } from "../../../utils/cors.js";
import { admin, db } from "../../../firebaseAdminConfig.js";
const openai = new OpenAI({
  apiKey: process.env.NUXT_PUBLIC_OPENAI_API_KEY,
});

const corsOptions = {
  allowedOrigins: ["http://localhost:3000", "https://someai--contentai-f4d3e.us-central1.hosted.app/contentai"],
  allowedMethods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

const corsHandler = createCorsHandler(corsOptions);

export default defineEventHandler(async (event) => {
  const req = event.node.req;
  const res = event.node.res;

  return new Promise<void>((resolve, reject) => {
    corsHandler(req, res, async () => {
      try {
        const body = await readBody(event); // Read the request body
        const { userId, websiteSummary, postsSummary } = body;

        // Example data to guide the model
        const exampleTemplate = `Example completed data template:
       {
           "uniqueSellingProposition": "Empowering your marketing with AI-driven insights and tools that are not only powerful but also fun and easy to use.",
           "website": "https://brandbrainai.com",
           "personaName": "BrandBrainAI",
           "targetAudience": {
               "challenges": [
                   "Navigating complex AI tools",
                   "Balancing creativity with data-driven insights",
                   "Keeping up with changing marketing trends",
                   "Finding humor and joy in the tech-driven world"
               ],
               "contentPreferences": ["User-Centric Design"],
               "demographics": {
                   "ageRange": ["20", "55"],
                   "behaviors": [
                   "Frequent social media users",
                   "Enjoys experimenting with new tools."
                   ],
                   "gender": ["Male", "Female"],
                   "geographicalLocations": ["Denmark", "Canada"],
                   "professions": ["Digital Marketers", "Content Creators", "Brand managers"],
                   "descriptor": "Professionals in marketing, especially in industries that value creativity and engagement"
               },
               "interests": ["AI-driven analytics", "Content creation", "Social media marketing", "Family", "Innovation"],
               "psychographics": [
                   "Values humor",
                   "Appreciates user-friendly design",
                   "Enjoys learning about new technologies",
                   "Tech-savvy but not tech experts",
                   "Creative"
               ].
               "goals": [
                   "Data-driven decision-making",
                   "Engaging content creation",
                   "Post scheduling"
               ]
           },
           "brandAnalysis": {
               "coreOfferings": [
                   "AI-driven analytics",
                   "Automated marketing tools",
                   "Personalized content creation services"
               ],
               "swot": {
                   "opportunities": [
                   "Expanding into markets that value transparency and user support",
                   "Leveraging humor to create viral marketing content"
                   ],
                   "strengths": [
                   "User-friendly AI tools",
                   "Strong community engagement",
                   "Brand loyalty through humorous and warm interactions"
                   ],
                   "threats": [
                   "Misinterpretation of informal tone",
                   "Competition with more traditional tech brands"
                   ],
                   "weaknesses": [
                   "Risk of humor overshadowing important technical information",
                   "Balancing humor with professionalism"
                   ]
               }
               "values": [
               "Innovation",
               "User-Centric Design",
               "Transparency",
               "Joyfulness"
               ]
           },
           "toneOfVoice": {
              "PointOfView": "First person",
               "characteristics": [
                   {
                   "key": "Friendly and Warm",
                   "description": "We approach communication with warmth, making our users feel like they're chatting with a good friend."
                   },
                   {
                   "key": "Appreciative",
                   "description": "We recognize and celebrate the achievements of our users and team."
                   },
                   {
                   "key": "Active and Verbal",
                   "description": "We prefer verbs over nouns, bringing energy and clarity to our messages."
                   },
                   {
                   "key": "Humorous and Playful",
                   "description": "We use humor wisely to make our interactions delightful but never at the expense of clarity or respect."
                   }
               ],
               "doAndDont": {
                   "donts": [
                       "Use jargon or technical language that might confuse the user.",
                       "Be mocking or sarcastic; always maintain a positive vibe.",
                       "Overuse emojis or superlatives which can dilute the message."
                   ],
                   "dos": [
                       "Use active voice to make sentences more engaging.",
                       "Be clear, simple, and direct in your communication.",
                       "Inject humor and playfulness appropriately to brighten the user's day."
                   ]
               },
               "communicationPreferences": {
                   "emojiUse": "Use emojis to enhance the message subtly but avoid overuse to maintain professionalism.",
                   "sentenceLength": "14"
               }
           },
               "contentPreferences": {
                   "tags": ["FunWithAI", "MarketingJoy", "AIForAll"],
                   "description": "BrandBrainAI crafts user-centric AI solutions designed to streamline and enhance digital marketing efforts with a touch of humor and warmth, making technology accessible and enjoyable for marketers of all levels."
               }
           "writingStyle": {
               "pointOfView": "First person",
               "personalStories": true,
               "anecdotes": true,
               "formality": "Casual",
               "tone": "Conversational",
               "relatability": "High",
               "interactionStyle": {
                   "attributes": [
                     "Asking Questions: Engage the audience by asking open-ended questions that invite them to share their thoughts and experiences.",
                     "Using Polls: Create interactive polls to gather opinions, preferences, and feedback from the audience.",
                     "Encouraging User-Generated Content: Invite the audience to create and share their own content related to the brand’s themes and campaigns.",
                     "Sharing Personal Stories: Use personal anecdotes and stories to connect with the audience on a deeper level.",
                     "Responding Promptly: Ensure timely responses to comments and messages to maintain a conversation with the audience.",
                     "Celebrating User Achievements: Highlight and celebrate the achievements of community members to build a sense of belonging and loyalty.",
                     "Offering Tips and Advice: Provide valuable tips, advice, and insights to help the audience solve problems and achieve their goals.",
                     "Creating Challenges: Launch challenges that encourage the audience to participate and share their progress."
                   ]
                 }
             }
       }`;

        const systemPrompt = `You are an assistant that generates structured JSON data for digital marketing analysis.
                Use this example template as a guide only. Do not copy directly; instead, use logical values based on the website and post summaries provided.
                Ensure each field is filled with accurate and logical information.`;

        const userPrompt = `Analyze the following summaries to generate structured JSON data:
                      Website Summary: ${websiteSummary}
                      Posts Summary: ${postsSummary}.
                      Ensure no fields are empty. If data is insufficient, make logical guesses based on available information.`;

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo-0125",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt + exampleTemplate },
            { role: "user", content: userPrompt },
          ],
          max_tokens: 2000,
        });

        const personaData = JSON.parse(completion.choices[0].message.content);

        const personasCollection = db.collection("Personas");
        const docRef = await personasCollection.add(personaData);
        await docRef.update({ personaId: docRef.id, userId: userId });

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, data: personaData }));
        resolve();
      } catch (error) {
        console.error(error);
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: error.message }));
        reject(createError({ statusCode: 500, statusMessage: error.message }));
      }
    });
  });
});
