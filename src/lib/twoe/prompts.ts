import type { OEId } from "./oes";

export type Likert = 1 | 2 | 3 | 4 | 5;

export interface TwoEPrompt {
  id: string;
  oe: OEId;
  prompt: string;
}

/** 8 prompts per OE = 40 total. */
export const TWOE_PROMPTS: TwoEPrompt[] = [
  // Intellectual
  { id: "i1", oe: "intellectual", prompt: "I often find myself questioning things others accept without thought." },
  { id: "i2", oe: "intellectual", prompt: "I prefer deep conversations over small talk." },
  { id: "i3", oe: "intellectual", prompt: "I can spend hours researching a topic that interests me." },
  { id: "i4", oe: "intellectual", prompt: "I often see connections between seemingly unrelated things." },
  { id: "i5", oe: "intellectual", prompt: "I enjoy debating ideas, even when it makes others uncomfortable." },
  { id: "i6", oe: "intellectual", prompt: "I think about ethical questions more than most people around me." },
  { id: "i7", oe: "intellectual", prompt: "I read, watch, or study across many fields at once." },
  { id: "i8", oe: "intellectual", prompt: "I feel restless when I go too long without something to think about." },

  // Emotional
  { id: "e1", oe: "emotional", prompt: "I feel others' emotions as if they were my own." },
  { id: "e2", oe: "emotional", prompt: "I have experienced grief so intense it felt physical." },
  { id: "e3", oe: "emotional", prompt: "I form deep attachments to people, places, and even objects." },
  { id: "e4", oe: "emotional", prompt: "I can be moved to tears by music, art, or stories." },
  { id: "e5", oe: "emotional", prompt: "I sometimes feel overwhelmed by the suffering in the world." },
  { id: "e6", oe: "emotional", prompt: "My emotional responses are often stronger than others expect." },
  { id: "e7", oe: "emotional", prompt: "I can feel the mood of a room the moment I walk in." },
  { id: "e8", oe: "emotional", prompt: "It takes me a long time to recover from emotionally intense events." },

  // Imaginational
  { id: "m1", oe: "imaginational", prompt: "I have a rich and vivid inner world." },
  { id: "m2", oe: "imaginational", prompt: "I often daydream or get lost in my thoughts." },
  { id: "m3", oe: "imaginational", prompt: "I use metaphors and imagery to understand complex ideas." },
  { id: "m4", oe: "imaginational", prompt: "I sometimes blur the line between my imagination and reality." },
  { id: "m5", oe: "imaginational", prompt: "I have recurring dreams that feel meaningful." },
  { id: "m6", oe: "imaginational", prompt: "Ideas often arrive as images before they arrive as words." },
  { id: "m7", oe: "imaginational", prompt: "I invent characters, worlds, or scenarios for my own enjoyment." },
  { id: "m8", oe: "imaginational", prompt: "I get absorbed in stories to the point of losing time." },

  // Psychomotor
  { id: "p1", oe: "psychomotor", prompt: "I have difficulty sitting still for long periods." },
  { id: "p2", oe: "psychomotor", prompt: "I think better when I'm moving." },
  { id: "p3", oe: "psychomotor", prompt: "I talk faster when I'm excited about something." },
  { id: "p4", oe: "psychomotor", prompt: "I feel restless when I have unstructured time." },
  { id: "p5", oe: "psychomotor", prompt: "I prefer to learn by doing rather than reading." },
  { id: "p6", oe: "psychomotor", prompt: "My hands, feet, or voice move when my mind is working." },
  { id: "p7", oe: "psychomotor", prompt: "I have surges of energy that need somewhere to go." },
  { id: "p8", oe: "psychomotor", prompt: "Physical intensity — walking, running, dancing — resets my head." },

  // Sensual
  { id: "s1", oe: "sensual", prompt: "I am deeply affected by my physical environment." },
  { id: "s2", oe: "sensual", prompt: "Certain textures, sounds, or smells can overwhelm me." },
  { id: "s3", oe: "sensual", prompt: "I have strong preferences about food, clothing, or aesthetics." },
  { id: "s4", oe: "sensual", prompt: "I can spend hours absorbed in a piece of music or art." },
  { id: "s5", oe: "sensual", prompt: "I notice sensory details that others seem to miss." },
  { id: "s6", oe: "sensual", prompt: "Beauty — of a room, a landscape, a face — reliably moves me." },
  { id: "s7", oe: "sensual", prompt: "Uncomfortable clothing or lighting can ruin my ability to focus." },
  { id: "s8", oe: "sensual", prompt: "I seek out specific sensory experiences the way others seek stories." },
];

export const LIKERT_LABELS: Record<Likert, string> = {
  1: "Strongly disagree",
  2: "Disagree",
  3: "Neutral",
  4: "Agree",
  5: "Strongly agree",
};