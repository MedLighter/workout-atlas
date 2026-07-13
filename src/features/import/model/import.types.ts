import type { MediaAsset, SetType, WorkoutUnit } from '../../workout/model/workout.types';

export type ImportDocumentType = 'workout_template' | 'workout_session' | 'program';

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

export interface WorkoutImportDocument {
  protocolVersion: '1.0';
  documentType: ImportDocumentType;
  title: string;
  language?: string;
  unit: WorkoutUnit;
  goal?: string;
  difficulty?: string;
  estimatedDurationMin?: number;
  exercises: ImportExercise[];
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