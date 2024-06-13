// Helper function for Instagram
export function formatForInstagram(persona, userInput) {
    let responseStructure = {
        content: "",
        caption: "",
        hashtags: [],
        post_time: ""
    };

    // Tone of Voice: ${persona.toneOfVoice.characteristics.map(char => `${char.key} (${char.description})`).join(", ")}.
    let systemPrompt = `You are a marketing/Social Media and content expert that generates engageing marketing/SoMe content aimed for converting and engageing the target audeience, for Instagram in structured JSON data. The structure should include:
    - "content": The HTML formatted content. No divs or classes are needed. Use br tags for line breaks and double br tag for new paragraphs and p tags for text. Hashtags should not be included in the content. Other allowed tags are a, em, strong, and blockquote. When adding links the text linking to the URL should describe the content of the link.
    - "caption": The text for the Instagram post.
    - "hashtags": Up to 3 relevant hashtags.
    - "post_time": The optimal posting time based on the target audience.
    It should look like this: {
        content: "",
        hashtags: [],
        post_time: ""
    }
    Use this example template as a guide only. Do not copy directly; instead, use logical values based on the persona details and the user input provided. Ensure each field is filled with accurate and logical information. Respond in the same language as the prompt.`;
console.log(persona.toneOfVoice.characteristics)
    let userPrompt = `
    Create an engaging Instagram post for the brand ${persona.personaName}, described as: ${persona.contentPreferences.description}.
    ${persona.personaName}'s unique selling proposition is: ${persona.uniqueSellingProposition} and their website is: ${persona.website}. 
    ${persona.personaName} values: ${persona.brandAnalysis.values.join(", ")}. 
    Their core offerings are: ${persona.brandAnalysis.coreOfferings.join(", ")}. 
    Result of a SWOT analysis of ${persona.personaName}: 
    - Opportunities: ${persona.brandAnalysis.swot.opportunities.join(", ")}, 
    - Strengths: ${persona.brandAnalysis.swot.strengths.join(", ")}, 
    - Threats: ${persona.brandAnalysis.swot.threats.join(", ")}, 
    - Weaknesses: ${persona.brandAnalysis.swot.weaknesses.join(", ")}.
    The key focus of the post should be: ${userInput}, and cater to the target audience described as ${persona.targetAudience.demographics.gender.join(', ')} aged between ${persona.targetAudience.demographics.ageRange[0]} & ${persona.targetAudience.demographics.ageRange[1]}. Their interests include: ${persona.targetAudience.interests.join(", ")} and some of their behaviors are: ${persona.targetAudience.demographics.behaviors.join(", ")}, most of them have professions like: ${persona.targetAudience.demographics.professions.join(", ")}. They are described as: ${persona.targetAudience.demographics.descriptor}. They find ${persona.targetAudience.challenges.join(', ')} challenging. Their goals include ${persona.targetAudience.goals.join(', ')} and some of their psychographics are: ${persona.targetAudience.psychographics.join(', ')}.
    ${persona.personaName} would charecterize their content as: ${persona.toneOfVoice.characteristics.map(char => `${char.key} (${char.description})`).join(", ")}. They describe their use of emojis as "${persona.toneOfVoice.communicationPreferences.emojiUse}" and have an average sentence length of ${persona.toneOfVoice.communicationPreferences.sentenceLength} words per sentence.
    When writing content for ${persona.personaName}, ensure to follow these dos and don'ts: 
    - Dos: ${persona.toneOfVoice.doAndDont.dos.join(", ")}, 
    - Don'ts: ${persona.toneOfVoice.doAndDont.donts.join(", ")}.
    The post should include up to 3 relevant hashtags. Suggest the most optimal post date and time for Instagram based on the target audience's locations: ${persona.targetAudience.demographics.geographicalLocations.join(', ')}.`; 
    return {
        systemPrompt,
        userPrompt,
        max_tokens: 1024, // Adjusted to allow more detailed responses
        temperature: 0.7,
        responseStructure,
    };
}
