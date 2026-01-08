/**
 * Script to create sample patient data for the Alzheimer's Calming App
 * 
 * Usage: node scripts/create-sample-patient.js [patient_id]
 * Example: node scripts/create-sample-patient.js patient_002
 */

const fs = require('fs');
const path = require('path');

const patientId = process.argv[2] || 'patient_001';
const patientDataPath = path.join(__dirname, '..', 'patient_data', patientId);

// Sample data templates
const profileTemplate = {
  patient_id: patientId,
  name: "Sample Patient",
  preferred_name: "Sample",
  age: 75,
  diagnosis_stage: "moderate",
  emergency_contacts: [
    { name: "Family Member", relationship: "daughter", phone: "+1-555-0000" }
  ],
  current_location: "Home",
  safe_word: "sunshine",
  photo_url: `/patient_photos/${patientId}.jpg`
};

const memoriesTemplate = {
  significant_memories: [
    {
      title: "Wedding Day",
      description: "Describe the wedding day details",
      emotional_value: "very_high",
      details: "Add specific details that bring comfort"
    }
  ],
  comfort_memories: [
    "Add comfort memories here",
    "Activities they enjoyed",
    "Places that brought joy"
  ],
  childhood_memories: [
    {
      title: "Childhood Memory",
      description: "Describe a significant childhood memory",
      details: "Add specific details"
    }
  ]
};

const familyTemplate = {
  immediate_family: [
    {
      name: "Family Member Name",
      relationship: "daughter",
      age: 50,
      details: "Details about this family member",
      photo_url: "/photos/family_member.jpg",
      phone: "+1-555-0000"
    }
  ],
  grandchildren: [],
  extended_family: [],
  close_friends: [],
  caregivers: []
};

const musicTemplate = {
  favorite_songs: [
    {
      title: "Song Title",
      artist: "Artist Name",
      significance: "Why this song is meaningful",
      calming_effect: "high",
      spotify_url: "",
      youtube_url: ""
    }
  ],
  preferred_genres: ["Jazz", "Classic Standards"],
  music_memories: "Describe memories associated with music",
  artists_she_loves: [],
  avoid: ["Types of music to avoid"]
};

const routineTemplate = {
  daily_schedule: {
    "07:00": "Wake up",
    "08:00": "Breakfast",
    "12:00": "Lunch",
    "17:00": "Dinner",
    "21:00": "Bedtime"
  },
  weekly_events: {},
  familiar_places: [
    "Home - describe familiar features"
  ],
  orientation_cues: {
    home_identifiers: ["Describe features that identify home"],
    time_cues: ["Cues that help with time orientation"],
    day_cues: ["Cues that help with day orientation"]
  },
  comfort_objects: []
};

const calmingStrategiesTemplate = {
  effective_techniques: [
    {
      technique: "Play favorite song",
      effectiveness: "high",
      notes: "Description of when and how to use"
    }
  ],
  triggers_to_avoid: [
    "List things that upset the patient"
  ],
  calming_phrases: [
    "You're safe.",
    "Everything is okay.",
    "I'm here with you."
  ],
  communication_style: {
    speak_slowly: true,
    use_simple_sentences: true,
    repeat_if_needed: true,
    maintain_calm_tone: true,
    use_her_preferred_name: "Preferred Name"
  },
  escalation_protocol: {
    level_1: "Mild confusion - use calming phrases",
    level_2: "Moderate distress - play music, show photos",
    level_3: "Severe distress - call emergency contact",
    level_4: "Medical emergency - call 911"
  },
  what_usually_works: []
};

// Create directory if it doesn't exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Write JSON file
function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Created: ${filePath}`);
}

// Main execution
console.log(`\nCreating sample patient data for: ${patientId}\n`);

ensureDirectoryExists(patientDataPath);

writeJsonFile(path.join(patientDataPath, 'profile.json'), profileTemplate);
writeJsonFile(path.join(patientDataPath, 'memories.json'), memoriesTemplate);
writeJsonFile(path.join(patientDataPath, 'family.json'), familyTemplate);
writeJsonFile(path.join(patientDataPath, 'music.json'), musicTemplate);
writeJsonFile(path.join(patientDataPath, 'routine.json'), routineTemplate);
writeJsonFile(path.join(patientDataPath, 'calming_strategies.json'), calmingStrategiesTemplate);

console.log(`\n✅ Sample patient data created successfully!`);
console.log(`\nNext steps:`);
console.log(`1. Edit the JSON files in: ${patientDataPath}`);
console.log(`2. Add real patient information`);
console.log(`3. Upload photos to the photos directory`);
console.log(`4. Test with the SOS feature\n`);
