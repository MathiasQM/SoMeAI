// Helper function for Facebook
export function formatForFacebook(persona, userInput) {
    let prompt = `Create a detailed Facebook post for ${persona.personaName}. `;
    prompt += `The post should elaborate on: ${persona.description}, and cater to ${persona.targetAudience.interests.join(", ")}. `;
    if (userInput) {
        prompt += `Main focus: ${userInput}. `;
    }
    // Facebook allows for longer posts, so you might adjust tokens
    return {
        prompt,
        max_tokens: 200,
        temperature: 0.7,
    };
}