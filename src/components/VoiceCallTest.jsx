/**
 * VoiceCallTest Component
 * Stage 2 - Basic voice call testing with VAPI
 * Tests: connection, audio, microphone, call lifecycle
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  Loader, 
  AlertCircle,
  CheckCircle,
  Settings
} from 'lucide-react';
import { 
  vapi, 
  createTestAssistant, 
  checkMicrophonePermission,
  isVapiConfigured 
} from '../utils/vapiClient';

const VoiceCallTest = () => {
  const [callState, setCallState] = useState('idle'); // idle, connecting, active, ended
  const [error, setError] = useState(null);
  const [micPermission, setMicPermission] = useState(null); // null, granted, denied
  const [transcript, setTranscript] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef(null);

  // Check VAPI configuration on mount
  const [isConfigured, setIsConfigured] = useState(false);
  
  useEffect(() => {
    setIsConfigured(isVapiConfigured());
    
    // Check initial mic permission
    checkMicrophonePermission().then(granted => {
      setMicPermission(granted ? 'granted' : null);
    });
  }, []);

  // Set up VAPI event listeners
  useEffect(() => {
    const handleCallStart = () => {
      console.log('[VAPI] Call started');
      setCallState('active');
      setError(null);
      
      // Start duration timer
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    };

    const handleCallEnd = () => {
      console.log('[VAPI] Call ended');
      setCallState('ended');
      
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    const handleSpeechStart = () => {
      console.log('[VAPI] AI speaking...');
    };

    const handleSpeechEnd = () => {
      console.log('[VAPI] AI finished speaking');
    };

    const handleTranscript = (message) => {
      console.log('[VAPI] Transcript:', message);
      if (message.transcript) {
        setTranscript(prev => [...prev, {
          role: message.role,
          text: message.transcript,
          timestamp: new Date().toLocaleTimeString()
        }]);
      }
    };

    const handleError = (err) => {
      console.error('[VAPI] Error event received:', err);
      console.error('[VAPI] Error details:', JSON.stringify(err, null, 2));
      
      // Extract error message - MUST be a string for React rendering
      let errorMsg = 'An error occurred during the call';
      
      if (typeof err === 'string') {
        errorMsg = err;
      } else if (err?.message && typeof err.message === 'string') {
        errorMsg = err.message;
      } else if (err?.error?.message && typeof err.error.message === 'string') {
        errorMsg = err.error.message;
      } else if (err?.error && typeof err.error === 'string') {
        errorMsg = err.error;
      } else if (err?.statusCode) {
        // Handle {message, error, statusCode} format
        errorMsg = `Error ${err.statusCode}: ${err.message || err.error || 'Unknown error'}`;
      } else if (err) {
        // Last resort - stringify the whole thing
        errorMsg = JSON.stringify(err);
      }
      
      // Ensure it's always a string
      setError(String(errorMsg));
      setCallState('idle');
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    // Register event listeners
    vapi.on('call-start', handleCallStart);
    vapi.on('call-end', handleCallEnd);
    vapi.on('speech-start', handleSpeechStart);
    vapi.on('speech-end', handleSpeechEnd);
    vapi.on('message', handleTranscript);
    vapi.on('error', handleError);

    // Cleanup
    return () => {
      vapi.off('call-start', handleCallStart);
      vapi.off('call-end', handleCallEnd);
      vapi.off('speech-start', handleSpeechStart);
      vapi.off('speech-end', handleSpeechEnd);
      vapi.off('message', handleTranscript);
      vapi.off('error', handleError);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startCall = async () => {
    // Check configuration
    if (!isConfigured) {
      setError('VAPI API key not configured. Please add VITE_VAPI_API_KEY to .env.local');
      return;
    }

    // Check microphone permission
    const hasMicPermission = await checkMicrophonePermission();
    if (!hasMicPermission) {
      setMicPermission('denied');
      setError('Microphone access is required. Please enable it in your browser settings.');
      return;
    }
    setMicPermission('granted');

    try {
      setCallState('connecting');
      setError(null);
      setTranscript([]);
      setCallDuration(0);
      
      console.log('[VAPI] Starting test call...');
      const assistant = createTestAssistant();
      console.log('[VAPI] Assistant config:', JSON.stringify(assistant, null, 2));
      
      await vapi.start(assistant);
      
    } catch (err) {
      console.error('[VAPI] Call failed - Full error:', err);
      console.error('[VAPI] Error details:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
      
      // Extract meaningful error message
      let errorMsg = 'Failed to start call';
      if (err.message) {
        errorMsg = err.message;
      } else if (err.error) {
        errorMsg = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
      } else if (typeof err === 'string') {
        errorMsg = err;
      }
      
      setError(errorMsg);
      setCallState('idle');
    }
  };

  const endCall = () => {
    console.log('[VAPI] Ending call...');
    vapi.stop();
    setCallState('ended');
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    vapi.setMuted(newMuted);
    console.log('[VAPI] Muted:', newMuted);
  };

  const resetCall = () => {
    setCallState('idle');
    setError(null);
    setTranscript([]);
    setCallDuration(0);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="voice-call-test">
      <div className="vct-header">
        <h2>🎤 VAPI Voice Call Test</h2>
        <span className="vct-stage-label">Stage 2</span>
      </div>

      {/* Configuration Status */}
      <div className={`vct-config-status ${isConfigured ? 'configured' : 'not-configured'}`}>
        <Settings size={14} />
        <span>VAPI: {isConfigured ? 'Configured ✓' : 'Not Configured'}</span>
        {!isConfigured && (
          <span className="config-hint">Add VITE_VAPI_API_KEY to .env.local</span>
        )}
      </div>

      {/* Call State Display */}
      <div className="vct-state-display">
        <div className={`state-indicator ${callState}`}>
          {callState === 'idle' && <Phone size={20} />}
          {callState === 'connecting' && <Loader size={20} className="spin" />}
          {callState === 'active' && <Volume2 size={20} />}
          {callState === 'ended' && <CheckCircle size={20} />}
        </div>
        <div className="state-info">
          <span className="state-label">{callState.toUpperCase()}</span>
          {callState === 'active' && (
            <span className="call-duration">{formatDuration(callDuration)}</span>
          )}
        </div>
      </div>

      {/* Microphone Permission Status */}
      {micPermission === 'denied' && (
        <div className="vct-permission-warning">
          <MicOff size={16} />
          <div>
            <strong>Microphone Access Required</strong>
            <p>Please allow microphone access in your browser:</p>
            <ol>
              <li>Click the camera/microphone icon in the address bar</li>
              <li>Select "Allow" for microphone</li>
              <li>Refresh the page and try again</li>
            </ol>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="vct-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Call Controls */}
      <div className="vct-controls">
        {callState === 'idle' && (
          <button 
            className="vct-btn start"
            onClick={startCall}
            disabled={!isConfigured}
          >
            <Phone size={20} />
            Start Test Call
          </button>
        )}

        {callState === 'connecting' && (
          <div className="vct-connecting">
            <Loader size={24} className="spin" />
            <span>Connecting call...</span>
          </div>
        )}

        {callState === 'active' && (
          <div className="vct-active-controls">
            <button 
              className={`vct-btn mute ${isMuted ? 'muted' : ''}`}
              onClick={toggleMute}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
            <button 
              className="vct-btn end"
              onClick={endCall}
            >
              <PhoneOff size={20} />
              End Call
            </button>
          </div>
        )}

        {callState === 'ended' && (
          <div className="vct-ended">
            <p>✅ Call ended successfully</p>
            <p className="call-summary">Duration: {formatDuration(callDuration)}</p>
            <button 
              className="vct-btn new"
              onClick={resetCall}
            >
              Start New Test Call
            </button>
          </div>
        )}
      </div>

      {/* Live Transcript */}
      {transcript.length > 0 && (
        <div className="vct-transcript">
          <h4>Transcript</h4>
          <div className="transcript-list">
            {transcript.map((entry, idx) => (
              <div key={idx} className={`transcript-entry ${entry.role}`}>
                <span className="transcript-role">
                  {entry.role === 'assistant' ? '🤖 AI' : '👤 You'}
                </span>
                <span className="transcript-text">{entry.text}</span>
                <span className="transcript-time">{entry.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Testing Instructions */}
      <div className="vct-instructions">
        <h4>Testing Checklist</h4>
        <ul>
          <li>Click "Start Test Call" - should connect within 5 seconds</li>
          <li>AI should say: "Hello! This is a test call. Can you hear me clearly?"</li>
          <li>Say: "Yes, I can hear you" - AI should respond</li>
          <li>Test mute button - your voice should not be heard when muted</li>
          <li>Click "End Call" - should terminate immediately</li>
          <li>Check browser console for VAPI logs</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceCallTest;
