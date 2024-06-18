import { admin, db } from "../../../../firebaseAdminConfig.js";

// Helper function for Facebook
export async function formatForFacebook(persona, personaDescription, userInput) {
  let responseStructure = {
    content: "",
    hashtags: [],
    post_time: "",
  };

  const integrationDocRef = db.collection("Personas").doc(persona.personaId).collection("Integrations").doc("Facebook");
  const integrationDoc = await integrationDocRef.get();
  let integrationDocData;
  if (integrationDoc.exists) {
    integrationDocData = integrationDoc.data();
  } else {
    console.log(
      `No such document! Document ID: Facebook in Integrations collection for persona ID: ${persona.personaId}`
    );
  }

  let systemSelectedPostDescription = integrationDocData?.systemSelectedPostDescription || "";
  let userSuppliedPostsDescription = integrationDocData?.userSuppliedPostsDescription || "";

  let systemPrompt = `You are a marketing/Social Media and content expert that specializes in creating engageing marketing/SoMe content for Facebook aimed at converting and engageing the target audeience, in structured json data. The structure should include:
    - "content": The HTML formatted content. No divs or classes are needed. Use br tags for line breaks and double br tag for new paragraphs and p tags for text. Hashtags should not be included in the content. Other allowed tags are a, em, strong, and blockquote. When adding links the text linking to the URL should describe the content of the link.
    - "caption": The text for the Facebook post.
    - "hashtags": Up to 3 relevant hashtags.
    - "post_time": The optimal posting time based on the target audience.
    It should look like this: {
        content: "",
        hashtags: [],
        post_time: "" Should be a valid JS date string
    }

    Use this persona description as context for the brand: ${personaDescription}.

    ${
      !userSuppliedPostsDescription
        ? ""
        : `This is a description of what characterizes the posts i like: ${userSuppliedPostsDescription}`
    }.
    
    ${
      !systemSelectedPostDescription
        ? ""
        : `This is a description of what characterizes posts that have had the best engagement: ${systemSelectedPostDescription}`
    }.

    Use the descriptions above to influence the tone, writing style, jargon, format, structure, point of view, emojies and more of the post that you will create.
    Use this example template as a guide only. Do not copy directly; instead, use logical values based on the persona details and the user input provided. Ensure each field is filled with accurate and logical information. Respond in the same language as the prompt and in json format.`;

  let userPrompt = `
    Create an engaging Facebook post for the brand ${persona.personaName}. Respond in the language as after the colon. The key focus of the post should be: ${userInput}`;

  return {
    systemPrompt,
    userPrompt,
    max_tokens: 1024, // Adjusted to allow more detailed responses
    temperature: 0.7,
    responseStructure,
  };
}
