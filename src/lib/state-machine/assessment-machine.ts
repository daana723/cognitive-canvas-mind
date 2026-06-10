import { QUESTIONS } from "../spark/questions";

/**
 * Assessment State Machine
 *
 * Lightweight FSM describing the flow of the SPARK assessment.
 * Phases are explicit so future surfaces (toolkit, mapping, AI companion)
 * can hook into transitions without rewriting flow logic.
 */

export type AssessmentPhase =
  | "intro"
  | "in_progress"
  | "review"
  | "complete";

export interface AssessmentState {
  phase: AssessmentPhase;
  index: number;          // current question index
  total: number;
}

export const initialState = (): AssessmentState => ({
  phase: "intro",
  index: 0,
  total: QUESTIONS.length,
});

export type AssessmentEvent =
  | { type: "BEGIN" }
  | { type: "ANSWER" }
  | { type: "BACK" }
  | { type: "REVIEW" }
  | { type: "COMPLETE" }
  | { type: "RESET" };

export function transition(
  state: AssessmentState,
  event: AssessmentEvent,
): AssessmentState {
  switch (event.type) {
    case "BEGIN":
      return { ...state, phase: "in_progress", index: 0 };
    case "ANSWER": {
      const next = state.index + 1;
      if (next >= state.total) return { ...state, phase: "review", index: state.total - 1 };
      return { ...state, index: next };
    }
    case "BACK":
      return { ...state, phase: "in_progress", index: Math.max(0, state.index - 1) };
    case "REVIEW":
      return { ...state, phase: "review" };
    case "COMPLETE":
      return { ...state, phase: "complete" };
    case "RESET":
      return initialState();
  }
}