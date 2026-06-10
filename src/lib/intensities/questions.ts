import type { IntensityId } from "./intensities";
import type { LikertValue } from "../spark/questions";

/**
 * Intensity question bank — 3 prompts per channel.
 * Same Likert scale and conventions as SPARK.
 */

export interface IntensityQuestion {
  id: string;
  intensity: IntensityId;
  prompt: string;
  reverse?: boolean;
}

export const INTENSITY_QUESTIONS: IntensityQuestion[] = [
  // Drive (Psychomotor)
  { id: "i-d1", intensity: "drive", prompt: "Sitting still without something to think about feels louder than working." },
  { id: "i-d2", intensity: "drive", prompt: "I gesture, pace, or move my hands while I'm working through an idea." },
  { id: "i-d3", intensity: "drive", prompt: "Movement — walking, running, dancing — clarifies my thinking faster than sitting does." },

  // Sense (Sensual)
  { id: "i-s1", intensity: "sense", prompt: "Beauty, in any form, can stop me mid-sentence." },
  { id: "i-s2", intensity: "sense", prompt: "The texture, light, or sound of a space materially changes my mood." },
  { id: "i-s3", intensity: "sense", prompt: "I'm rarely moved by aesthetic detail.", reverse: true },

  // Mind (Intellectual)
  { id: "i-m1", intensity: "mind", prompt: "I can't let go of a question once it's lodged — I'll chase it across days." },
  { id: "i-m2", intensity: "mind", prompt: "Shallow answers irritate me; I want first principles." },
  { id: "i-m3", intensity: "mind", prompt: "My mind runs analytical loops long after the conversation has ended." },

  // Vision (Imaginational)
  { id: "i-v1", intensity: "vision", prompt: "I think in metaphors, images, and scenes as much as in words." },
  { id: "i-v2", intensity: "vision", prompt: "When the world gets heavy, I retreat into vivid inner worlds." },
  { id: "i-v3", intensity: "vision", prompt: "Dreams or imagined futures stay with me long after they end." },

  // Heart (Emotional)
  { id: "i-h1", intensity: "heart", prompt: "I feel other people's emotional weather almost before they speak." },
  { id: "i-h2", intensity: "heart", prompt: "My feelings arrive at higher volume than the room expects." },
  { id: "i-h3", intensity: "heart", prompt: "Emotional memories stay vivid for years, not days." },
];

export const INTENSITY_LIKERT: Record<LikertValue, string> = {
  1: "Not me",
  2: "Rarely",
  3: "Sometimes",
  4: "Often",
  5: "Deeply me",
};