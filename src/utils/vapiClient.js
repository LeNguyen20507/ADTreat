/**
 * VAPI Client Utility
 * Handles voice calling functionality for Alzheimer's grounding conversations
 * 
 * Stage 3: Profile-driven conversations with 3-exchange structure
 * 
 * Setup:
 * 1. Get API key from https://vapi.ai (Dashboard > API Keys)
 * 2. Add to .env.local: VITE_VAPI_API_KEY=your_key_here
 */

import Vapi from '@vapi-ai/web';
import { generateSystemPrompt, logPromptDetails, validatePromptComplete } from './promptGenerator';

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
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a friendly assistant. Keep responses to one short sentence."
        }
      ],
      temperature: 0.7
    },
    voice: {
      provider: "azure",
      voiceId: "en-US-JennyNeural",
    },
    firstMessage: "Hello, can you hear me?",
    silenceTimeoutSeconds: 30,
    maxDurationSeconds: 120,
  };
}

/**
 * Create an assistant with personalized profile data
 * Stage 3: Full integration with MCP profiles
 * @param {object} profile - Patient profile from MCP
 * @returns {object} Assistant configuration
 */
export function createPersonalizedAssistant(profile) {
  if (!profile) {
    throw new Error('Profile is required to create personalized assistant');
  }

  // Generate dynamic system prompt from profile
  const systemPrompt = generateSystemPrompt(profile);
  
  // Log prompt for debugging (Task 3.1 testing requirement)
  logPromptDetails(systemPrompt, profile.name);
  
  // Validate no placeholders remain
  if (!validatePromptComplete(systemPrompt)) {
    console.warn('[VAPI] Warning: System prompt may have unresolved placeholders');
  }

  // Voice selection based on profile preference (Task 3.2)
  // Using Azure voices which work reliably
  const voiceConfig = profile.voice_preference === 'warm_female' 
    ? { provider: "azure", voiceId: "en-US-JennyNeural" }  // Warm female
    : { provider: "azure", voiceId: "en-US-GuyNeural" };    // Warm male

  console.log(`[VAPI] Using ${profile.voice_preference} voice:`, voiceConfig.voiceId);

  return {
    name: `${profile.name} Companion`,
    model: {
      provider: "anthropic",
      model: "claude-sonnet-4-20250514",
      messages: [
        {
          role: "system",
          content: systemPrompt
        }
      ],
      temperature: 0.6,
      // Function definitions for end_conversation
      functions: [
        {
          name: "end_conversation",
          description: "Call this function after completing all 3 exchanges and delivering the closing statement. This will gracefully end the voice conversation.",
          parameters: {
            type: "object",
            properties: {
              exchange_count: {
                type: "number",
                description: "The number of exchanges completed (should be 3)"
              },
              patient_state: {
                type: "string",
                enum: ["calm", "slightly_agitated", "very_agitated"],
                description: "Assessment of the patient's emotional state at end of conversation"
              }
            },
            required: ["exchange_count", "patient_state"]
          }
        }
      ]
    },
    voice: voiceConfig,
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en-US"
    },
    // First message uses patient's preferred_address
    firstMessage: `Hi ${profile.preferred_address}, I'm here to talk with you for a moment.`,
    
    // Call settings
    silenceTimeoutSeconds: 45,      // Longer timeout for patients who may pause
    maxDurationSeconds: 240,        // 4 minutes max (safety timeout)
    responseDelaySeconds: 0.5,      // Slight delay for natural pacing
    endCallFunctionEnabled: false,  // We handle ending via function call
    
    // Metadata for tracking
    metadata: {
      patientId: profile.patient_id,
      patientName: profile.name,
      voicePreference: profile.voice_preference
    }
  };
}

// Log VAPI configuration status on load
console.log('[VAPI] Client initialized. Configured:', isVapiConfigured());
