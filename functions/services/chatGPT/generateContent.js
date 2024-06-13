import * as functions from "firebase-functions";
import { admin, db } from "../../firebaseAdminConfig.js"; // Adjust the path as necessary
import OpenAI from "openai";
import { formatForInstagram } from "../../platformHelperFunctions/Meta/instagram.js";
import { formatForFacebook } from "../../platformHelperFunctions/Meta/facebook.js";

// Use the API key from Firebase environment configuration
const openai = new OpenAI({ apiKey: functions.config().openai.apikey });

export const generateContent = functions.https.onCall(async (data, context) => {
  const { channels, prompt, persona, contentName } = data;
  console.log(
    "Generating content for channels:",
    channels,
    "with prompt:",
    prompt,
    "and persona:",
    persona,
    "with content name:",
    contentName
  );
  const userId = context.auth.uid;
  const personaId = persona.personaId;
  const userDocRef = db.collection("contentCreation").doc();
  const namedContent = contentName || "New Content";

  let personaDescription = `
    BrandBrainAI: Empowering Your Marketing with AI-Driven Insights and Tools

    Website: ${persona.website}
    
    Unique Selling Proposition: ${persona.uniqueSellingProposition}
    
    Target Audience:
    - Challenges:
        - ${persona.targetAudience.challenges.join("\n        - ")}
    - Content Preferences: ${persona.targetAudience.contentPreferences.join(", ")}
    - Demographics:
        - Age Range: ${persona.targetAudience.demographics.ageRange.join("-")}
        - Behaviors: ${persona.targetAudience.demographics.behaviors.join(", ")}
        - Gender: ${persona.targetAudience.demographics.gender.join(", ")}
        - Geographical Locations: ${persona.targetAudience.demographics.geographicalLocations.join(", ")}
        - Professions: ${persona.targetAudience.demographics.professions.join(", ")}
        - Descriptor: ${persona.targetAudience.demographics.descriptor}
    - Interests: ${persona.targetAudience.interests.join(", ")}
    - Psychographics:
        - ${persona.targetAudience.psychographics.join("\n        - ")}
    - Goals:
        - ${persona.targetAudience.goals.join("\n        - ")}
    
    Brand Analysis:
    - Core Offerings:
        - ${persona.brandAnalysis.coreOfferings.join("\n        - ")}
    - SWOT Analysis:
        - Opportunities:
            - ${persona.brandAnalysis.swot.opportunities.join("\n            - ")}
        - Strengths:
            - ${persona.brandAnalysis.swot.strengths.join("\n            - ")}
        - Threats:
            - ${persona.brandAnalysis.swot.threats.join("\n            - ")}
        - Weaknesses:
            - ${persona.brandAnalysis.swot.weaknesses.join("\n            - ")}
    - Values: ${persona.brandAnalysis.values.join(", ")}
    
    Tone of Voice:
    - Dos and Don’ts:
        - Don'ts:
            - ${persona.toneOfVoice.doAndDont.donts.join("\n            - ")}
        - Dos:
            - ${persona.toneOfVoice.doAndDont.dos.join("\n            - ")}
    - Communication Preferences:
        - Emoji Use: ${persona.toneOfVoice.communicationPreferences.emojiUse}
        - Sentence Length: ${persona.toneOfVoice.communicationPreferences.sentenceLength} words per sentence on average.
    
    Content Preferences:
    - Tags: ${persona.contentPreferences.tags.join(", ")}
    - Description: ${persona.contentPreferences.description}
    `;
  // - Characteristics:
  //     - ${persona.toneOfVoice.characteristics.map(char => `${char.key}: ${char.description}`).join('\n        - ')}

  console.log("Persona description:", personaDescription);

  const sessionUpdate = {
    userId: userId,
    personaId: personaId,
    sessionName: namedContent,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  };

  await userDocRef.set(
    {
      userId: userId,
      sessionName: namedContent,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      ...sessionUpdate, // Merging sessionUpdate with initial data
    },
    { merge: true }
  );

  const handleChannelRequest = async (channel) => {
    try {
      const formattedRequest = formatRequestForChannel(channel, persona, prompt);
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: formattedRequest.systemPrompt },
          { role: "user", content: formattedRequest.userPrompt },
        ],
        // max_tokens: 1024,
        // temperature: 0.7
      });
      // Immediately process or return the successful response
      console.log(`Success for ${channel}:`, completion.choices[0].message.content);

      // Use a timestamp or another method to generate a unique ID for the subcollection

      let aiResponse;
      try {
        aiResponse = JSON.parse(completion.choices[0].message.content);
      } catch (parseError) {
        throw new Error(`Failed to parse AI response: ${parseError.message}`);
      }

      await userDocRef.collection("content").add({
        channel,
        success: true,
        ...aiResponse,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
      return { channel, success: true, aiResponse, description: personaDescription };
    } catch (error) {
      console.error(`Error for ${channel}:`, error);
      // Immediately process or return the error
      return { channel, success: false, error: "Failed to generate content" };
    }
  };

  // Create an array of promises for each channel request
  const channelPromises = channels.map((channel) => handleChannelRequest(channel));

  // You can still wait for all promises to complete if you need to perform an action afterwards
  const results = await Promise.all(channelPromises);
  console.log("All requests processed:", results);
  return { results }; // Returns all results after they've all completed, but processes each as it comes in
});

function formatRequestForChannel(channel, persona, prompt) {
  let formattedRequest;
  switch (channel) {
    case "Instagram":
      formattedRequest = formatForInstagram(persona, prompt);
      break;
    case "Facebook":
      formattedRequest = formatForFacebook(persona, prompt);
      break;
    // Add cases for other channels here
    default:
      throw new Error("Unsupported channel: " + channel);
  }
  return formattedRequest;
}
