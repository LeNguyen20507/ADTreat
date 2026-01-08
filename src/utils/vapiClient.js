/**
 * VAPI Client Utility
 * Handles voice calling functionality for Alzheimer's grounding conversations
 * 
 * Setup:
 * 1. Get API key from https://vapi.ai (Dashboard > API Keys)
 * 2. Add to .env.local: VITE_VAPI_API_KEY=your_key_here
 */

import Vapi from '@vapi-ai/web';

// Check if API key is configured
const apiKey = import.meta.env.VITE_VAPI_API_KEY;

if (!apiKey || apiKey === 'your_vapi_api_key_here') {
  console.warn('[VAPI] ⚠️ API key not configured. Please add VITE_VAPI_API_KEY to .env.local');
}

// Initialize VAPI client
export const vapi = new Vapi(apiKey || '');

/**
 * Check if VAPI is properly configured
 * @returns {boolean}
 */
export function isVapiConfigured() {
  return apiKey && apiKey !== 'your_vapi_api_key_here' && apiKey.length > 10;
}

/**
 * Check microphone permission
 * @returns {Promise<boolean>}
 */
export async function checkMicrophonePermission() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop()); // Release immediately
    return true;
  } catch (err) {
    console.error('[VAPI] Microphone permission denied:', err);
    return false;
  }
}

/**
 * Create a basic test assistant configuration
 * This is for Stage 2 testing - simple static prompt
 * @returns {object} Assistant configuration
 */
export function createTestAssistant() {
  return {
    model: {
      provider: "openai",
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a warm, friendly AI assistant. Keep responses very short (1 sentence). You're testing audio quality.`
        }
      ],
      temperature: 0.7
    },
    voice: {
      provider: "playht",
      voiceId: "jennifer",
    },
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en-US"
    },
    firstMessage: "Hello! Can you hear me?",
    silenceTimeoutSeconds: 30,
    maxDurationSeconds: 180,
  };
}

/**
 * Create an assistant with personalized profile data
 * This will be used in Stage 3 when we integrate MCP profiles
 * @param {object} profile - Patient profile from MCP
 * @returns {object} Assistant configuration
 */
export function createPersonalizedAssistant(profile) {
  const voiceId = profile.voice_preference === 'warm_female' 
    ? 'EXAVITQu4vr4xnSDxMaL' // "Sarah" - warm female
    : 'pNInz6obpgDQGcFmaJgB'; // "Adam" - warm male

  return {
    model: {
      provider: "openai",
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `You are a warm, comforting AI companion helping ${profile.preferred_address} feel safe and calm.

PATIENT CONTEXT:
- Name: ${profile.name} (call them "${profile.preferred_address}")
- Age: ${profile.age}
- Background: ${profile.core_identity}
- Safe Place: ${profile.safe_place}
- Comfort Memory: ${profile.comfort_memory}
- Common Trigger: ${profile.common_trigger}

CALMING TOPICS (use these to redirect anxiety):
${profile.calming_topics.map((topic, i) => `${i + 1}. ${topic}`).join('\n')}

CONVERSATION GUIDELINES:
- Speak slowly, warmly, and reassuringly
- Keep responses to 1-2 short sentences
- If they seem anxious about "${profile.common_trigger}", gently redirect to calming topics
- Reference their safe place and comfort memories naturally
- Never argue or contradict them - validate feelings first
- Use their preferred name: "${profile.preferred_address}"
- Be patient with repetition - it's normal`
        }
      ],
      temperature: 0.6
    },
    voice: {
      provider: "11labs",
      voiceId: voiceId,
    },
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en-US"
    },
    firstMessage: `Hello ${profile.preferred_address}. I'm here with you. How are you feeling right now?`,
    endCallFunctionEnabled: false,
    silenceTimeoutSeconds: 45, // Longer timeout for patients who may pause
    maxDurationSeconds: 600, // 10 minutes for real calls
  };
}

// Log VAPI configuration status on load
console.log('[VAPI] Client initialized. Configured:', isVapiConfigured());
