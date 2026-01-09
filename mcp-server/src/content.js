/**
 * Dynamic Content Data
 * Weekly-evolving content for brain engagement
 * Content organized by categories with versioning
 * 
 * This file serves as a simple CMS for educational content,
 * puzzles, recipes, and guided routines that can be updated
 * without code deployment.
 */

// Content versioning - update weekly
export const CONTENT_VERSION = "2026-01-09";
export const LAST_UPDATED = "2026-01-09T00:00:00Z";

// Featured content for this week
export const featuredContent = {
  senior: {
    id: "featured_senior_001",
    title: "Memory Lane Walk",
    description: "A gentle guided walk through your favorite memories",
    type: "activity",
    duration: "10 min",
    image: "🌳"
  },
  caregiver: {
    id: "featured_caregiver_001",
    title: "Understanding Sundowning",
    description: "New strategies for evening care routines",
    type: "article",
    duration: "8 min",
    image: "🌅"
  }
};

// Educational Articles
export const articles = {
  caregiver: [
    {
      id: "art_cg_001",
      title: "Understanding Alzheimer's Stages",
      description: "Learn about the 7 stages of Alzheimer's and what to expect at each phase",
      category: "basics",
      readTime: "8 min",
      icon: "🧠",
      color: "#8B5CF6",
      publishedAt: "2026-01-01",
      tags: ["stages", "progression", "understanding"]
    },
    {
      id: "art_cg_002",
      title: "Communication Strategies",
      description: "Effective ways to connect with your loved one even as language changes",
      category: "communication",
      readTime: "6 min",
      icon: "💬",
      color: "#3B82F6",
      publishedAt: "2026-01-02",
      tags: ["communication", "connection", "tips"]
    },
    {
      id: "art_cg_003",
      title: "Managing Behavioral Changes",
      description: "Tips for handling agitation, wandering, and sundowning behaviors",
      category: "behavior",
      readTime: "10 min",
      icon: "❤️",
      color: "#EC4899",
      publishedAt: "2026-01-03",
      tags: ["behavior", "sundowning", "management"]
    },
    {
      id: "art_cg_004",
      title: "Caregiver Self-Care",
      description: "Taking care of yourself while caring for others - it's not selfish, it's essential",
      category: "wellness",
      readTime: "5 min",
      icon: "☀️",
      color: "#F59E0B",
      publishedAt: "2026-01-04",
      tags: ["self-care", "burnout", "wellness"]
    },
    {
      id: "art_cg_005",
      title: "Daily Care Routines",
      description: "Creating structure and predictability for better days",
      category: "routines",
      readTime: "7 min",
      icon: "⏰",
      color: "#10B981",
      publishedAt: "2026-01-05",
      tags: ["routines", "structure", "daily"]
    },
    {
      id: "art_cg_006",
      title: "Safety & Wandering Prevention",
      description: "Home safety modifications and monitoring tips",
      category: "safety",
      readTime: "9 min",
      icon: "🛡️",
      color: "#EF4444",
      publishedAt: "2026-01-06",
      tags: ["safety", "wandering", "home"]
    },
    {
      id: "art_cg_007",
      title: "Nutrition for Brain Health",
      description: "Foods and meal planning for cognitive support",
      category: "nutrition",
      readTime: "6 min",
      icon: "🥗",
      color: "#14B8A6",
      publishedAt: "2026-01-07",
      isNew: true,
      tags: ["nutrition", "diet", "brain health"]
    }
  ],
  senior: [
    {
      id: "art_sr_001",
      title: "Understanding Your Journey",
      description: "Simple information about memory changes - you're not alone",
      category: "understanding",
      readTime: "5 min",
      icon: "🧠",
      color: "#8B5CF6",
      simplified: true,
      tags: ["memory", "journey", "support"]
    },
    {
      id: "art_sr_002",
      title: "Staying Connected",
      description: "Easy tips for talking with your loved ones",
      category: "connection",
      readTime: "4 min",
      icon: "❤️",
      color: "#EC4899",
      simplified: true,
      tags: ["family", "connection", "communication"]
    },
    {
      id: "art_sr_003",
      title: "Daily Wellness Tips",
      description: "Simple ways to feel your best each day",
      category: "wellness",
      readTime: "3 min",
      icon: "☀️",
      color: "#F59E0B",
      simplified: true,
      tags: ["wellness", "daily", "tips"]
    },
    {
      id: "art_sr_004",
      title: "Memory Helpers",
      description: "Tools and tricks that can help you remember",
      category: "tools",
      readTime: "4 min",
      icon: "💡",
      color: "#10B981",
      simplified: true,
      isNew: true,
      tags: ["memory", "tools", "helpers"]
    }
  ]
};

// Cognitive Exercises & Puzzles
export const cognitiveExercises = [
  {
    id: "cog_001",
    title: "Word Association",
    description: "Connect words that go together",
    type: "puzzle",
    difficulty: "easy",
    duration: "5 min",
    icon: "🔤",
    color: "#3B82F6",
    cognitiveAreas: ["language", "memory"],
    instructions: "Match words that are related to each other"
  },
  {
    id: "cog_002",
    title: "Picture Memory",
    description: "Remember what you see",
    type: "memory",
    difficulty: "easy",
    duration: "5 min",
    icon: "🖼️",
    color: "#8B5CF6",
    cognitiveAreas: ["visual memory", "attention"],
    instructions: "Look at pictures and remember what you saw"
  },
  {
    id: "cog_003",
    title: "Number Patterns",
    description: "Find the next number",
    type: "pattern",
    difficulty: "medium",
    duration: "7 min",
    icon: "🔢",
    color: "#10B981",
    cognitiveAreas: ["logic", "pattern recognition"],
    instructions: "Complete the number sequence"
  },
  {
    id: "cog_004",
    title: "Story Recall",
    description: "Listen and remember",
    type: "auditory",
    difficulty: "medium",
    duration: "10 min",
    icon: "📖",
    color: "#F59E0B",
    cognitiveAreas: ["auditory memory", "comprehension"],
    instructions: "Listen to a short story and answer questions"
  },
  {
    id: "cog_005",
    title: "Daily Trivia",
    description: "Fun facts and questions",
    type: "trivia",
    difficulty: "easy",
    duration: "5 min",
    icon: "❓",
    color: "#EC4899",
    cognitiveAreas: ["recall", "knowledge"],
    isDaily: true,
    instructions: "Answer fun trivia questions"
  },
  {
    id: "cog_006",
    title: "Sorting Challenge",
    description: "Group items by category",
    type: "categorization",
    difficulty: "easy",
    duration: "5 min",
    icon: "📦",
    color: "#6366F1",
    cognitiveAreas: ["categorization", "logic"],
    isNew: true,
    instructions: "Sort items into the correct groups"
  }
];

// Brain-Healthy Recipes
export const recipes = [
  {
    id: "recipe_001",
    title: "Mediterranean Quinoa Bowl",
    description: "Rich in omega-3s and antioxidants",
    prepTime: "15 min",
    cookTime: "20 min",
    difficulty: "easy",
    icon: "🥗",
    brainBenefits: ["omega-3", "antioxidants", "fiber"],
    tags: ["lunch", "healthy", "mediterranean"]
  },
  {
    id: "recipe_002",
    title: "Blueberry Brain Smoothie",
    description: "Packed with brain-boosting berries",
    prepTime: "5 min",
    cookTime: "0 min",
    difficulty: "easy",
    icon: "🫐",
    brainBenefits: ["antioxidants", "vitamins", "hydration"],
    tags: ["breakfast", "quick", "smoothie"]
  },
  {
    id: "recipe_003",
    title: "Omega-3 Salmon Dinner",
    description: "Heart and brain healthy protein",
    prepTime: "10 min",
    cookTime: "25 min",
    difficulty: "medium",
    icon: "🐟",
    brainBenefits: ["omega-3", "protein", "vitamin D"],
    tags: ["dinner", "protein", "seafood"]
  },
  {
    id: "recipe_004",
    title: "Turmeric Golden Milk",
    description: "Anti-inflammatory evening drink",
    prepTime: "5 min",
    cookTime: "5 min",
    difficulty: "easy",
    icon: "🥛",
    brainBenefits: ["anti-inflammatory", "relaxation", "curcumin"],
    isNew: true,
    tags: ["evening", "drink", "calming"]
  }
];

// Guided Routines
export const guidedRoutines = [
  {
    id: "routine_001",
    title: "Morning Mindfulness",
    description: "Start your day with calm and clarity",
    duration: "10 min",
    type: "mindfulness",
    icon: "🌅",
    color: "#F59E0B",
    timeOfDay: "morning",
    steps: [
      "Find a comfortable seated position",
      "Take 3 deep breaths",
      "Notice how your body feels",
      "Set an intention for the day"
    ]
  },
  {
    id: "routine_002",
    title: "Gentle Movement",
    description: "Easy stretches for flexibility",
    duration: "15 min",
    type: "exercise",
    icon: "🧘",
    color: "#10B981",
    timeOfDay: "morning",
    steps: [
      "Neck rolls - 5 each direction",
      "Shoulder shrugs - 10 times",
      "Arm circles - 10 each direction",
      "Gentle side stretches"
    ]
  },
  {
    id: "routine_003",
    title: "Memory Walk",
    description: "Walk through your favorite memories",
    duration: "10 min",
    type: "cognitive",
    icon: "🚶",
    color: "#8B5CF6",
    timeOfDay: "afternoon",
    steps: [
      "Think of a happy memory",
      "Picture the place clearly",
      "Remember who was there",
      "What sounds and smells do you recall?"
    ]
  },
  {
    id: "routine_004",
    title: "Evening Wind-Down",
    description: "Prepare for restful sleep",
    duration: "15 min",
    type: "relaxation",
    icon: "🌙",
    color: "#6366F1",
    timeOfDay: "evening",
    steps: [
      "Dim the lights",
      "Take slow, deep breaths",
      "Review 3 good things from today",
      "Listen to calming music"
    ]
  },
  {
    id: "routine_005",
    title: "Gratitude Practice",
    description: "Cultivate thankfulness and joy",
    duration: "5 min",
    type: "mindfulness",
    icon: "🙏",
    color: "#EC4899",
    timeOfDay: "any",
    isNew: true,
    steps: [
      "Think of 3 things you're grateful for",
      "Why are they meaningful?",
      "Share one with someone you love"
    ]
  }
];

// Helper functions
export function getContentByCategory(contentType, category) {
  switch (contentType) {
    case 'articles':
      return [...articles.caregiver, ...articles.senior].filter(a => a.category === category);
    case 'exercises':
      return cognitiveExercises.filter(e => e.type === category);
    case 'routines':
      return guidedRoutines.filter(r => r.type === category);
    default:
      return [];
  }
}

export function getNewContent() {
  return {
    articles: [...articles.caregiver, ...articles.senior].filter(a => a.isNew),
    exercises: cognitiveExercises.filter(e => e.isNew),
    recipes: recipes.filter(r => r.isNew),
    routines: guidedRoutines.filter(r => r.isNew)
  };
}

export function getDailyContent() {
  // Return content rotated by day of week
  const dayOfWeek = new Date().getDay();
  
  return {
    exercise: cognitiveExercises[dayOfWeek % cognitiveExercises.length],
    routine: guidedRoutines[dayOfWeek % guidedRoutines.length],
    recipe: recipes[dayOfWeek % recipes.length],
    article: articles.senior[dayOfWeek % articles.senior.length]
  };
}

export function getContentForRole(role) {
  if (role === 'senior') {
    return {
      articles: articles.senior,
      exercises: cognitiveExercises.filter(e => e.difficulty === 'easy'),
      recipes: recipes.filter(r => r.difficulty === 'easy'),
      routines: guidedRoutines,
      featured: featuredContent.senior
    };
  }
  
  return {
    articles: articles.caregiver,
    exercises: cognitiveExercises,
    recipes: recipes,
    routines: guidedRoutines,
    featured: featuredContent.caregiver
  };
}

export default {
  CONTENT_VERSION,
  LAST_UPDATED,
  featuredContent,
  articles,
  cognitiveExercises,
  recipes,
  guidedRoutines,
  getContentByCategory,
  getNewContent,
  getDailyContent,
  getContentForRole
};
