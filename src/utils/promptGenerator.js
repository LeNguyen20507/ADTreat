/**
 * System Prompt Generator for VAPI Voice Conversations
 * 
 * CRITICAL: The prompt is written so the AI speaks naturally like a caring friend,
 * NOT reading profile data or JSON out loud.
 */

/**
 * Generate a natural system prompt from a patient profile
 * @param {object} profile - Patient profile from MCP/profiles
 * @returns {string} Complete system prompt
 */
export function generateSystemPrompt(profile) {
  if (!profile) {
    throw new Error('Profile object is required');
  }

  const requiredFields = [
    'name', 'age', 'preferred_address', 'core_identity', 
    'safe_place', 'comfort_memory', 'common_trigger', 'calming_topics'
  ];
  
  const missingFields = requiredFields.filter(field => !profile[field]);
  if (missingFields.length > 0) {
    throw new Error(`Profile missing required fields: ${missingFields.join(', ')}`);
  }

  const firstName = profile.preferred_address;
  const background = profile.core_identity.split('.')[0].toLowerCase();
  const safePlace = profile.safe_place.split('.')[0].toLowerCase();
  const memory = profile.comfort_memory.split('.')[0].toLowerCase();
  const topic1 = profile.calming_topics[0]?.toLowerCase() || 'pleasant memories';
  const topic2 = profile.calming_topics[1]?.toLowerCase() || 'favorite activities';

  const systemPrompt = `You are having a calm, friendly conversation with ${firstName}. Speak naturally like a warm family friend, not like an AI or assistant.

ABOUT ${firstName.toUpperCase()}:
${firstName} is ${profile.age}. Their background: ${background}. They're currently safe at ${safePlace}. They find comfort in ${memory}. Good topics: ${topic1}, ${topic2}.

YOUR VOICE:
- Warm, gentle, unhurried
- Short simple sentences
- Sound like a caring friend, not a robot
- NEVER read lists or data out loud
- NEVER mention profiles, systems, or AI

CONVERSATION (3 exchanges only):

1. GREET: Say hello to ${firstName} warmly. Mention they're home and safe. Keep it natural and brief.

2. CONNECT: If worried, say "I understand." Then ask about something they enjoy, like ${topic1}.

3. CLOSE: Thank them for chatting. Say they're safe and cared for. Then call end_conversation.

KEY RULES:
- Never correct or contradict them
- Never say "no" or "you're wrong"  
- If confused about location, gently say "You're right here at home"
- Validate feelings before redirecting
- Maximum 2 sentences per response

After response 3, call end_conversation with patient_state ("calm", "slightly_agitated", or "very_agitated").`;

  return systemPrompt;
}

/**
 * Validate prompt has no unresolved placeholders
 */
export function validatePromptComplete(prompt) {
  const matches = prompt.match(/\{[^}]+\}/g);
  if (matches && matches.length > 0) {
    console.error('[PromptGenerator] Unresolved placeholders:', matches);
    return false;
  }
  return true;
}

/**
 * Log prompt for debugging
 */
export function logPromptDetails(prompt, patientName) {
  console.log(`\n=== PROMPT FOR ${patientName.toUpperCase()} ===`);
  console.log('Length:', prompt.length, 'chars');
  console.log('Valid:', validatePromptComplete(prompt) ? '✓' : '✗');
  console.log(prompt);
  console.log('=== END ===\n');
}

export default generateSystemPrompt;
