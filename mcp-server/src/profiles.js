/**
 * Patient Profiles Data
 * Single source of truth for patient profile data used by VAPI grounding conversations
 */

export const profiles = {
  margaret_chen: {
    patient_id: "margaret_chen",
    name: "Margaret Chen",
    age: 78,
    preferred_address: "Margaret",
    core_identity: "Retired elementary school teacher who taught 2nd grade for 35 years at Lincoln Elementary School. Known for her patient, nurturing teaching style and the cozy reading corner she created in her classroom.",
    safe_place: "Home in Pasadena, California with the rose garden she planted in 1995. The house has blue curtains in the kitchen that she picked out herself. The garden has yellow roses, her favorite.",
    comfort_memory: "Her golden retriever Biscuit who loved to lie in the garden and passed away 5 years ago. Her daughter Lisa visits every Sunday afternoon for tea. The cozy reading corner in her classroom where children would gather on colorful pillows to hear stories.",
    common_trigger: "Becomes anxious thinking she needs to go teach her class. Worries about 'being late to school' and that 'the children are waiting for her.' Gets distressed about not preparing her lesson plans.",
    calming_topics: [
      "Stories about her favorite students over the years",
      "Her rose garden and how she cares for the flowers",
      "Her dog Biscuit and his funny habits",
      "Reading time with children and their favorite books",
      "Sunday tea time with her daughter Lisa"
    ],
    voice_preference: "warm_female"
  },
  
  robert_williams: {
    patient_id: "robert_williams",
    name: "Robert Williams",
    age: 71,
    preferred_address: "Robert",
    core_identity: "Retired postal worker who delivered mail on the Oak Street route for 40 years. Everyone in the neighborhood knew him by name. He took pride in delivering mail in all weather and knowing every family's story.",
    safe_place: "Living room in his apartment with family photos on the mantle—especially the large framed photo of his grandchildren Emma (age 8) and Jake (age 6). The apartment has a comfortable brown leather recliner where he likes to sit.",
    comfort_memory: "His mail route along Oak Street where families would wait to chat with him. The Johnsons always offered him lemonade in summer. Fishing trips every summer with his son David at Lake Arrowhead—they'd wake up at dawn and pack sandwiches. His grandchildren visiting and sitting in his lap to hear stories.",
    common_trigger: "Doesn't recognize where he is or whose house this is. Thinks he needs to 'finish his route' or that he hasn't delivered the mail yet. Becomes anxious about 'the mail being late' or 'people waiting for their packages.'",
    calming_topics: [
      "Memories of families on his mail route and their stories",
      "Fishing trips with his son David at Lake Arrowhead",
      "His grandchildren Emma and Jake and time spent with them",
      "The neighborhood he served and how it changed over 40 years",
      "Weather stories from delivering mail in rain, snow, heat"
    ],
    voice_preference: "warm_male"
  }
};

/**
 * Get patient profile by ID
 * @param {string} patientId - The patient identifier
 * @returns {object|null} - Patient profile or null if not found
 */
export function getProfile(patientId) {
  return profiles[patientId] || null;
}

/**
 * Get list of valid patient IDs
 * @returns {string[]} - Array of valid patient IDs
 */
export function getValidPatientIds() {
  return Object.keys(profiles);
}
