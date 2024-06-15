// Import necessary modules
import * as functions from "firebase-functions";
import { admin, db } from "../firebaseAdminConfig.js";
import OpenAI from "openai";

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: functions.config().openai.apikey,
});

export const onPersonaCreateOrUpdate = functions.firestore
  .document("Personas/{personaId}")
  .onWrite(async (change, context) => {
    const personaId = context.params.personaId;
    const beforeData = change.before.exists ? change.before.data() : null;
    const afterData = change.after.exists ? change.after.data() : null;

    console.log("STARTING UP");

    if (!beforeData) {
      // Document was created
      // Generate persona description
      const description = await generatePersonaDescription(afterData);

      // Update the document with the generated description
      await db.collection("Personas").doc(personaId).update({
        personaDescription: description,
      });
    } else if (!afterData) {
      // Document was deleted (optional: in this case, onWrite would also trigger on delete)
      console.log("A persona was deleted:", beforeData);
    } else {
      // Document was updated
      if (beforeData.personaDescription !== afterData.personaDescription && !("lastUpdatedByFunction" in beforeData)) {
        console.log("Skipping update to avoid infinite loop.");
        return null; // Avoid re-triggering the update if personaDescription is being set
      }

      delete afterData.personaDescription;
      console.log("Persona data:", afterData);

      // Generate persona description
      const description = await generatePersonaDescription(afterData);

      // Update the document with the generated description
      await db.collection("Personas").doc(personaId).update({
        personaDescription: description,
      });
    }
  });

// Function to construct persona description using OpenAI API
async function generatePersonaDescription(persona) {
  const systemPrompt = `
  You are an expert in brand analysis and persona creation. Given the following persona data, create a detailed and natural language description. It is important that no aspect of the data is left out.

  Persona Data:
  ${JSON.stringify(persona, null, 2)}
  `;

  const userPrompt =
    "Generate a natural language description based on the above persona data. Make sure that it is clear what part of the data is being described at any given time.";

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 2000,
    });

    if (completion && completion.choices && completion.choices.length > 0) {
      return completion.choices[0].message.content.trim();
    } else {
      console.error("Invalid API response:", completion);
      return "There was an error generating the persona description.";
    }
  } catch (error) {
    console.error("Error generating persona description:", error);
    return "There was an error generating the persona description.";
  }
}
