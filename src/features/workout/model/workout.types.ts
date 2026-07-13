export type WorkoutUnit = 'kg' | 'lb';

export type TrackingMode = 'simple' | 'detailed';

export type ExerciseStatus = 'not_started' | 'in_progress' | 'done' | 'skipped';

export type ScheduleDayType = 'workout' | 'rest';

export interface ScheduleDay {
  weekday: number;
  type: ScheduleDayType;
  title: string;
  templateId?: string;
}

export interface WeeklyProgram {
  id: string;
  name: string;
  days: ScheduleDay[];
}

export type SetType = 'warmup' | 'working' | 'drop' | 'amrap' | 'failure' | 'backoff';

export interface WorkoutSession {
  id: string;
  title: string;
  date: string;
  unit: WorkoutUnit;
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  status: ExerciseStatus;
  muscleGroups?: string[];
  equipment?: string[];
  restSec?: number;
  notes?: string;
  techniqueTips?: string[];
  safetyNotes?: string[];
  media?: MediaAsset[];
  sets: WorkoutSet[];
  history?: ExerciseHistoryEntry[];
}

export interface WorkoutSet {
  id: string;
  type: SetType;
  weight?: number;
  reps?: number;
  previousWeight?: number;
  previousReps?: number;
  rpe?: number;
  completed: boolean;
  notes?: string;
}

export interface ExerciseHistoryEntry {
  id: string;
  date: string;
  sets: WorkoutSet[];
}

export interface MediaAsset {
  id?: string;
  role:
    | 'thumbnail'
    | 'exercise_demo'
    | 'muscle_map'
    | 'equipment'
    | 'technique'
    | 'cover'
    | 'fallback';
  format: 'svg' | 'lottie' | 'webp' | 'png' | 'jpg' | 'gif';
  url: string;
  alt: string;
  priority?: number;
  width?: number;
  height?: number;
  theme?: 'dark' | 'light' | 'any';
}