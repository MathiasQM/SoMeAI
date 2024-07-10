// Import necessary modules
import * as functions from "firebase-functions";
import { admin, db } from "../firebaseAdminConfig.js";
import OpenAI from "openai";

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: functions.config().openai.apikey,
});

export const onIntegrationCreateOrUpdate = functions.firestore
  .document("Personas/{personaId}/Integrations/{integrationId}")
  .onWrite(async (change, context) => {
    const integrationId = context.params.integrationId;
    const personaId = context.params.personaId;
    const beforeData = change.before.exists ? change.before.data() : null;
    const afterData = change.after.exists ? change.after.data() : null;

    console.log("STARTING UP");

    if (!beforeData) {
      // Document was created
      let userPostDescription, systemPostDescription;
      if (afterData.userSuppliedPost) {
        userPostDescription = await generatePostDescription(afterData.userSuppliedPost);
        await db.collection("Personas").doc(personaId).collection("Integrations").doc(integrationId).update({
          userSuppliedPostDescription: userPostDescription,
        });
      }
      if (afterData.userSuppliedPost) {
        systemPostDescription = await generatePostDescription(afterData.systemSelectedPosts);
        // Update the document with the generated description
        await db.collection("Personas").doc(personaId).collection("Integrations").doc(integrationId).update({
          systemSelectedPostDescription: systemPostDescription,
        });
      }
    } else if (!afterData) {
      // Document was deleted (optional: in this case, onWrite would also trigger on delete)
      console.log("A persona was deleted:", beforeData);
    } else {
      // Document was updated
      if (
        (beforeData.userSuppliedPostDescription !== afterData.userSuppliedPostDescription &&
          !("lastUpdatedByFunction" in beforeData)) ||
        (beforeData.systemSelectedPostDescription !== afterData.systemSelectedPostDescription &&
          !("lastUpdatedByFunction" in beforeData))
      ) {
        console.log("Skipping update to avoid infinite loop.");
        return null; // Avoid re-triggering the update if personaDescription is being set
      }

      let userPostDescription, systemPostDescription;
      if (afterData.userSuppliedPost) {
        delete afterData.userSuppliedPostsDescription;
        userPostDescription = await generatePostDescription(afterData.userSuppliedPost);
        await db.collection("Personas").doc(personaId).collection("Integrations").doc(integrationId).update({
          userSuppliedPostDescription: userPostDescription,
        });
      }

      if (afterData.userSuppliedPost) {
        delete afterData.systemSelectedPostDescription;
        systemPostDescription = await generatePostDescription(afterData.systemSelectedPosts);
        // Update the document with the generated description
        await db.collection("Personas").doc(personaId).collection("Integrations").doc(integrationId).update({
          systemSelectedPostDescription: systemPostDescription,
        });
      }
    }
  });

// Function to construct persona description using OpenAI API
async function generatePostDescription(post) {
  // let postContent = [];

  // for (let i = 0; i < posts.length; i++) {
  //   const post = posts[i];
  //   postContent.push(post.content);
  // }

  const systemPrompt = `
  You are an expert at identifying characteristics in content like; tone, jargon, writingstyle, point of view, emojiuse and much more. Given the following post data, create a detailed and natural language description. It is important that no aspect of the data is left out.

  Post:
  ${post}
  `;

  const userPrompt = "Describe in natural language how to write text/content that is similar to the post above.";

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
