export type WorkoutPhase =
  | 'idle'
  | 'prep'
  | 'active'
  | 'rest'
  | 'exercise_complete'
  | 'paused'
  | 'summary';

export interface FocusFlowState {
  workoutPhase: WorkoutPhase;
  activeExerciseIndex: number;
  activeSetIndex: number;
  restEndsAt: number | null;
  workoutStartedAt: string | null;
  pausedAt: string | null;
  elapsedBeforePauseMs: number;
  lastFinishedSessionId: string | null;
  workoutFeedback: 'easy' | 'normal' | 'hard' | null;
  hadPain: boolean;
}

export const initialFocusFlowState: FocusFlowState = {
  workoutPhase: 'idle',
  activeExerciseIndex: 0,
  activeSetIndex: 0,
  restEndsAt: null,
  workoutStartedAt: null,
  pausedAt: null,
  elapsedBeforePauseMs: 0,
  lastFinishedSessionId: null,
  workoutFeedback: null,
  hadPain: false,
};