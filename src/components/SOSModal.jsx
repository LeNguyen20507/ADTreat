import { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Volume2, 
  VolumeX,
  X, 
  Mic, 
  MicOff,
  Music,
  Image,
  Heart,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Vapi from '@vapi-ai/web';

// Initialize Vapi instance
const vapi = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY || 'demo-key');

// System prompt for Claude AI assistant
const SYSTEM_PROMPT = `You are a compassionate AI assistant helping an Alzheimer's patient who is experiencing confusion or distress. Your goal is to gently calm and reorient them using their personal memories, family connections, and familiar touchpoints.

PATIENT CONTEXT:
- You have access to detailed patient files via MCP tools
- Read profile.json first to understand who they are
- Read other files as needed based on the conversation
- Files available: profile.json, memories.json, family.json, music.json, routine.json, calming_strategies.json

COMMUNICATION GUIDELINES:
1. Speak slowly and use simple, short sentences
2. Be extremely patient and kind - never show frustration
3. Use their preferred name
4. Refer to familiar people, places, and memories to ground them
5. Repeat information if needed without mentioning you're repeating
6. Validate their feelings ("I understand you're feeling confused")
7. Avoid contradicting them directly - redirect gently instead
8. Use calming phrases from their profile

CONVERSATION FLOW:
1. First, acknowledge their distress with empathy
2. Read their profile and calming strategies
3. Identify what might help based on their specific data
4. Introduce familiar touchpoints (family names, favorite music, memories)
5. If highly agitated, suggest playing their most calming song
6. Help them understand where they are using familiar location cues
7. Mention upcoming visits from family if applicable

ACTIONS YOU CAN SUGGEST:
- "Would you like to hear your favorite song?" (reference specific song from music.json)
- "Let me show you a photo of [family member]"
- "Should we look at the garden through the window?"

Remember: Every patient is different. Use their specific data to personalize everything you say.`;

const SOSModal = ({ isOpen, onClose, patientId = 'patient_001' }) => {
  const [callStatus, setCallStatus] = useState('idle'); // idle, connecting, connected, ended, error
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showPhoto, setShowPhoto] = useState(null);
  const [playingMusic, setPlayingMusic] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const audioRef = useRef(null);

  // Load patient data when modal opens
  useEffect(() => {
    if (isOpen) {
      loadPatientData();
    }
  }, [isOpen, patientId]);

  // Set up Vapi event listeners
  useEffect(() => {
    const handleCallStart = () => {
      setCallStatus('connected');
      setCurrentMessage('Call connected. AI assistant is listening...');
    };

    const handleCallEnd = () => {
      setCallStatus('ended');
      setCurrentMessage('Call ended.');
    };

    const handleMessage = (message) => {
      // Parse message for UI actions
      if (message.type === 'transcript') {
        if (message.role === 'assistant') {
          setCurrentMessage(message.transcript);
          
          // Check for action triggers in the response
          const transcript = message.transcript.toLowerCase();
          if (transcript.includes('play') && (transcript.includes('song') || transcript.includes('music'))) {
            handlePlayMusic();
          }
          if (transcript.includes('show') && (transcript.includes('photo') || transcript.includes('picture'))) {
            handleShowPhoto();
          }
        }
      }
    };

    const handleError = (error) => {
      console.error('Vapi error:', error);
      setCallStatus('error');
      setCurrentMessage('Connection error. Please try again.');
    };

    const handleSpeechStart = () => {
      setCurrentMessage('Listening...');
    };

    const handleSpeechEnd = () => {
      setCurrentMessage('Processing...');
    };

    vapi.on('call-start', handleCallStart);
    vapi.on('call-end', handleCallEnd);
    vapi.on('message', handleMessage);
    vapi.on('error', handleError);
    vapi.on('speech-start', handleSpeechStart);
    vapi.on('speech-end', handleSpeechEnd);

    return () => {
      vapi.off('call-start', handleCallStart);
      vapi.off('call-end', handleCallEnd);
      vapi.off('message', handleMessage);
      vapi.off('error', handleError);
      vapi.off('speech-start', handleSpeechStart);
      vapi.off('speech-end', handleSpeechEnd);
    };
  }, []);

  const loadPatientData = async () => {
    try {
      // In a real app, this would fetch from the MCP server or API
      // For now, we'll use static sample data
      const profileResponse = await fetch(`/patient_data/${patientId}/profile.json`);
      const profile = await profileResponse.json();
      
      const familyResponse = await fetch(`/patient_data/${patientId}/family.json`);
      const family = await familyResponse.json();
      
      const musicResponse = await fetch(`/patient_data/${patientId}/music.json`);
      const music = await musicResponse.json();

      setPatientData({ profile, family, music });
      setEmergencyContacts(profile.emergency_contacts || []);
    } catch (error) {
      console.log('Using fallback patient data');
      // Fallback data for demo
      setPatientData({
        profile: {
          name: 'Margaret Thompson',
          preferred_name: 'Maggie',
          age: 78
        },
        family: {
          immediate_family: [
            { name: 'Sarah Thompson', relationship: 'daughter', phone: '+1-555-0123' }
          ]
        },
        music: {
          favorite_songs: [
            { title: 'What a Wonderful World', artist: 'Louis Armstrong' }
          ]
        }
      });
      setEmergencyContacts([
        { name: 'Sarah Thompson', relationship: 'daughter', phone: '+1-555-0123' }
      ]);
    }
  };

  const startCall = async () => {
    setCallStatus('connecting');
    setCurrentMessage('Connecting to AI assistant...');

    try {
      const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;
      
      if (assistantId) {
        // Use pre-configured assistant
        await vapi.start({
          assistantId,
          metadata: { patientId }
        });
      } else {
        // Use inline configuration for demo
        await vapi.start({
          model: {
            provider: 'anthropic',
            model: 'claude-sonnet-4-20250514',
            systemPrompt: SYSTEM_PROMPT,
            temperature: 0.7
          },
          voice: {
            provider: '11labs',
            voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam - calm male voice
            stability: 0.8,
            similarityBoost: 0.8
          },
          transcriber: {
            provider: 'deepgram',
            model: 'nova-2',
            language: 'en-US'
          },
          firstMessage: `Hello ${patientData?.profile?.preferred_name || 'there'}. I'm here to help. How are you feeling right now?`,
          endCallMessage: "Take care. Remember, you're safe and loved.",
          silenceTimeoutSeconds: 30,
          metadata: { patientId }
        });
      }
    } catch (error) {
      console.error('Failed to start call:', error);
      setCallStatus('error');
      setCurrentMessage('Could not connect. Please try the emergency contact buttons below.');
    }
  };

  const endCall = () => {
    vapi.stop();
    setCallStatus('ended');
    setPlayingMusic(null);
    setShowPhoto(null);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    vapi.setMuted(!isMuted);
  };

  const handlePlayMusic = () => {
    if (patientData?.music?.favorite_songs?.[0]) {
      setPlayingMusic(patientData.music.favorite_songs[0]);
    }
  };

  const handleShowPhoto = () => {
    if (patientData?.family?.immediate_family?.[0]) {
      setShowPhoto(patientData.family.immediate_family[0]);
    }
  };

  const handleEmergencyCall = (contact) => {
    window.location.href = `tel:${contact.phone}`;
  };

  const handleClose = () => {
    if (callStatus === 'connected' || callStatus === 'connecting') {
      endCall();
    }
    setCallStatus('idle');
    setCurrentMessage('');
    setShowPhoto(null);
    setPlayingMusic(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="sos-modal-overlay" onClick={handleClose}>
      <div className="sos-modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sos-modal-header">
          <div className="sos-header-title">
            <Heart className="sos-heart-icon" size={24} />
            <h2>Emergency Support</h2>
          </div>
          <button className="sos-close-btn" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        {/* Patient Info */}
        {patientData && (
          <div className="sos-patient-info">
            <span className="sos-patient-name">
              {patientData.profile.preferred_name || patientData.profile.name}
            </span>
            <span className="sos-patient-age">Age {patientData.profile.age}</span>
          </div>
        )}

        {/* Voice Call Section */}
        <div className="sos-call-section">
          {callStatus === 'idle' && (
            <button className="sos-start-call-btn" onClick={startCall}>
              <Phone size={32} />
              <span>Start AI Support Call</span>
              <small>Speak with a calming AI assistant</small>
            </button>
          )}

          {callStatus === 'connecting' && (
            <div className="sos-call-status connecting">
              <Loader2 className="sos-spinner" size={48} />
              <span>Connecting...</span>
            </div>
          )}

          {callStatus === 'connected' && (
            <div className="sos-call-active">
              <div className="sos-voice-indicator">
                <div className="sos-voice-wave">
                  <span></span><span></span><span></span><span></span><span></span>
                </div>
                <span className="sos-call-status-text">Call Active</span>
              </div>

              <div className="sos-call-message">
                {currentMessage}
              </div>

              <div className="sos-call-controls">
                <button 
                  className={`sos-control-btn ${isMuted ? 'active' : ''}`}
                  onClick={toggleMute}
                >
                  {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                  <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                </button>

                <button 
                  className="sos-control-btn end-call"
                  onClick={endCall}
                >
                  <PhoneOff size={24} />
                  <span>End Call</span>
                </button>

                <button 
                  className={`sos-control-btn ${!isSpeakerOn ? 'active' : ''}`}
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                >
                  {isSpeakerOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
                  <span>Speaker</span>
                </button>
              </div>
            </div>
          )}

          {callStatus === 'ended' && (
            <div className="sos-call-status ended">
              <AlertCircle size={48} />
              <span>Call Ended</span>
              <button className="sos-restart-btn" onClick={() => setCallStatus('idle')}>
                Start New Call
              </button>
            </div>
          )}

          {callStatus === 'error' && (
            <div className="sos-call-status error">
              <AlertCircle size={48} />
              <span>{currentMessage}</span>
              <button className="sos-restart-btn" onClick={() => setCallStatus('idle')}>
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Visual Elements Section */}
        {(showPhoto || playingMusic) && (
          <div className="sos-visual-section">
            {showPhoto && (
              <div className="sos-photo-display">
                <Image size={20} />
                <div className="sos-photo-info">
                  <span className="sos-photo-name">{showPhoto.name}</span>
                  <span className="sos-photo-relation">{showPhoto.relationship}</span>
                </div>
                <button 
                  className="sos-dismiss-btn"
                  onClick={() => setShowPhoto(null)}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {playingMusic && (
              <div className="sos-music-display">
                <Music size={20} />
                <div className="sos-music-info">
                  <span className="sos-song-title">{playingMusic.title}</span>
                  <span className="sos-song-artist">{playingMusic.artist}</span>
                </div>
                <button 
                  className="sos-dismiss-btn"
                  onClick={() => setPlayingMusic(null)}
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="sos-quick-actions">
          <button 
            className="sos-action-btn music"
            onClick={handlePlayMusic}
          >
            <Music size={20} />
            <span>Play Calming Music</span>
          </button>
          <button 
            className="sos-action-btn photo"
            onClick={handleShowPhoto}
          >
            <Image size={20} />
            <span>Show Family Photo</span>
          </button>
        </div>

        {/* Emergency Contacts */}
        <div className="sos-emergency-contacts">
          <h3>Emergency Contacts</h3>
          <div className="sos-contacts-list">
            {emergencyContacts.map((contact, index) => (
              <button 
                key={index}
                className="sos-contact-btn"
                onClick={() => handleEmergencyCall(contact)}
              >
                <Phone size={18} />
                <div className="sos-contact-info">
                  <span className="sos-contact-name">{contact.name}</span>
                  <span className="sos-contact-relation">{contact.relationship}</span>
                </div>
                <span className="sos-call-label">Call</span>
              </button>
            ))}
          </div>
        </div>

        {/* Calming Message */}
        <div className="sos-calming-message">
          <Heart size={16} />
          <span>You are safe. Help is here.</span>
        </div>
      </div>
    </div>
  );
};

export default SOSModal;
