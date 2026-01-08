/**
 * MCP Client Utility
 * Connects to the ADTreat MCP server to fetch patient profile data
 * 
 * Note: For browser environments, we'll use a simulated client that imports profiles directly
 * In production, this would connect via HTTP bridge or WebSocket to an MCP server
 */

// Import profiles directly for browser environment (MCP SDK uses stdio which is Node.js only)
// In production, this would be replaced with proper HTTP/WebSocket MCP transport
import { profiles, getValidPatientIds } from './profiles.js';

// Simulated network delay for realistic testing
const SIMULATED_DELAY_MS = 100;

// Connection state
let isConnected = false;
let connectionError = null;

/**
 * Initialize MCP client connection
 * In browser environment, this simulates connecting to server
 * @returns {Promise<boolean>} Connection success
 */
export async function initMcpClient() {
  console.log('[MCP Client] Initializing connection...');
  
  try {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY_MS));
    
    // Verify profiles are available
    const patientIds = getValidPatientIds();
    if (patientIds.length === 0) {
      throw new Error('No patient profiles available');
    }
    
    isConnected = true;
    connectionError = null;
    console.log('[MCP Client] Connected successfully. Available patients:', patientIds);
    return true;
  } catch (error) {
    isConnected = false;
    connectionError = error.message;
    console.error('[MCP Client] Connection failed:', error.message);
    return false;
  }
}

/**
 * Fetch patient profile from MCP server
 * @param {string} patientId - Patient ID (margaret_chen or robert_williams)
 * @param {number} timeout - Timeout in milliseconds (default: 5000)
 * @returns {Promise<object>} Patient profile data
 */
export async function fetchPatientProfile(patientId, timeout = 5000) {
  const startTime = performance.now();
  console.log(`[MCP Client] Fetching profile for: ${patientId}`);
  
  // Check connection
  if (!isConnected) {
    console.log('[MCP Client] Not connected, attempting to connect...');
    const connected = await initMcpClient();
    if (!connected) {
      throw new Error(`MCP connection failed: ${connectionError || 'Unknown error'}`);
    }
  }
  
  return new Promise((resolve, reject) => {
    // Set timeout
    const timeoutId = setTimeout(() => {
      reject(new Error(`Request timeout after ${timeout}ms`));
    }, timeout);
    
    // Simulate async fetch with delay
    setTimeout(() => {
      clearTimeout(timeoutId);
      
      const profile = profiles[patientId];
      const responseTime = Math.round(performance.now() - startTime);
      
      if (profile) {
        console.log(`[MCP Client] ✅ Profile retrieved in ${responseTime}ms`);
        console.log('[MCP Client] Profile data:', profile);
        
        // Verify all fields are present
        const requiredFields = [
          'patient_id', 'name', 'age', 'preferred_address', 'core_identity',
          'safe_place', 'comfort_memory', 'common_trigger', 'calming_topics',
          'voice_preference'
        ];
        
        const missingFields = requiredFields.filter(field => !profile[field]);
        if (missingFields.length > 0) {
          console.warn('[MCP Client] ⚠️ Missing fields:', missingFields);
        }
        
        if (!Array.isArray(profile.calming_topics) || profile.calming_topics.length !== 5) {
          console.warn('[MCP Client] ⚠️ calming_topics should have exactly 5 items');
        }
        
        resolve(profile);
      } else {
        console.error(`[MCP Client] ❌ Patient not found: ${patientId}`);
        reject(new Error(`Patient not found. Valid IDs: ${getValidPatientIds().join(', ')}`));
      }
    }, SIMULATED_DELAY_MS);
  });
}

/**
 * Check if MCP client is connected
 * @returns {boolean}
 */
export function isMcpConnected() {
  return isConnected;
}

/**
 * Get connection error if any
 * @returns {string|null}
 */
export function getMcpConnectionError() {
  return connectionError;
}

/**
 * Disconnect MCP client
 */
export function disconnectMcp() {
  isConnected = false;
  connectionError = null;
  console.log('[MCP Client] Disconnected');
}

/**
 * Test MCP connection health
 * @returns {Promise<object>} Health status
 */
export async function testMcpHealth() {
  const startTime = performance.now();
  
  try {
    if (!isConnected) {
      await initMcpClient();
    }
    
    const responseTime = Math.round(performance.now() - startTime);
    
    return {
      status: 'healthy',
      connected: isConnected,
      responseTime,
      availablePatients: getValidPatientIds()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      connected: false,
      error: error.message
    };
  }
}
