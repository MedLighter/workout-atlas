import type { MediaAsset, SetType, WorkoutUnit } from '../../workout/model/workout.types';
import type { ProgressionCadence, ProgressionMode } from '../../workout/model/progression.types';

export type ImportDocumentType = 'workout_template' | 'workout_session' | 'program';
export type ImportProtocolVersion = '1.0' | '1.1';

export interface ImportSet {
  type?: SetType;
  weight?: number;
  reps?: number;
  rpe?: number;
  notes?: string;
}

export interface ImportExercise {
  name: string;
  muscleGroups?: string[];
  equipment?: string[];
  restSec?: number;
  notes?: string;
  techniqueTips?: string[];
  safetyNotes?: string[];
  images?: MediaAsset[];
  sets?: ImportSet[];
}

export interface ImportProgressionPlan {
  enabled: boolean;
  mode: ProgressionMode;
  weightIncrementKg?: number;
  weightIncrementLb?: number;
  targetRpe?: number;
  cadence: ProgressionCadence;
  cadenceEverySessions?: number;
}

export interface ImportScheduleDay {
  weekday: number;
  type: 'workout' | 'rest';
  workoutTitle?: string;
}

export interface ImportWorkoutDefinition {
  title: string;
  goal?: string;
  difficulty?: string;
  estimatedDurationMin?: number;
  exercises: ImportExercise[];
}

export interface WorkoutTemplateDocument {
  protocolVersion: ImportProtocolVersion;
  documentType: 'workout_template' | 'workout_session';
  title: string;
  language?: string;
  unit: WorkoutUnit;
  goal?: string;
  difficulty?: string;
  estimatedDurationMin?: number;
  exercises: ImportExercise[];
}

export interface ProgramImportDocument {
  protocolVersion: ImportProtocolVersion;
  documentType: 'program';
  title: string;
  language?: string;
  unit: WorkoutUnit;
  goal?: string;
  progression?: ImportProgressionPlan;
  schedule: ImportScheduleDay[];
  workouts: ImportWorkoutDefinition[];
}

export type WorkoutImportDocument = WorkoutTemplateDocument | ProgramImportDocument;

export function isProgramImportDocument(
  document: WorkoutImportDocument,
): document is ProgramImportDocument {
  return document.documentType === 'program';
}

export type ValidationSeverity = 'error' | 'warning';

export interface ValidationMessage {
  severity: ValidationSeverity;
  message: string;
  path?: string;
}

export interface ImportValidationResult {
  success: boolean;
  document?: WorkoutImportDocument;
  errors: ValidationMessage[];
  warnings: ValidationMessage[];
}