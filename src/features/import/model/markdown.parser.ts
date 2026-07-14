import type { ImportExercise, ImportSet, WorkoutTemplateDocument } from './import.types';
import { normalizeMediaUrl } from './import.url';

const SET_LINE_REGEX =
  /^-\s*(warmup|working|drop|amrap|failure|backoff):\s*([\d.]+)\s*(kg|lb)?\s*x\s*(\d+)(?:\s*@RPE\s*([\d.]+))?/i;

const FIELD_REGEX = /^([A-Za-zА-Яа-я]+):\s*(.+)$/;

function parseSetLine(line: string): ImportSet | null {
  const match = line.match(SET_LINE_REGEX);
  if (!match) return null;
  return {
    type: match[1].toLowerCase() as ImportSet['type'],
    weight: Number(match[2]),
    reps: Number(match[4]),
    rpe: match[5] ? Number(match[5]) : undefined,
  };
}

function parseListValue(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function createMedia(url: string, role: 'exercise_demo' | 'muscle_map' = 'exercise_demo') {
  const lower = url.toLowerCase();
  let format: 'svg' | 'webp' | 'png' | 'jpg' | 'gif' = 'png';
  if (lower.endsWith('.svg')) format = 'svg';
  else if (lower.endsWith('.webp')) format = 'webp';
  else if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) format = 'jpg';
  else if (lower.endsWith('.gif')) format = 'gif';

  return {
    role,
    format,
    url: normalizeMediaUrl(url),
    alt: role,
    priority: format === 'svg' ? 1 : 5,
  };
}

export function parseWorkoutMarkdown(markdown: string): WorkoutTemplateDocument {
  const lines = markdown.split('\n').map((line) => line.trim());
  const doc: WorkoutTemplateDocument = {
    protocolVersion: '1.1',
    documentType: 'workout_template',
    title: 'Imported Workout',
    unit: 'kg',
    exercises: [],
  };

  let currentExercise: ImportExercise | null = null;
  let inSets = false;

  for (const line of lines) {
    if (!line) continue;

    if (line.startsWith('# ')) {
      doc.title = line.replace('# ', '').trim();
      continue;
    }

    const fieldMatch = line.match(FIELD_REGEX);
    if (fieldMatch && !line.startsWith('##')) {
      const key = fieldMatch[1].toLowerCase();
      const value = fieldMatch[2].trim();

      if (key === 'type' && (value === 'workout_template' || value === 'workout_session')) {
        doc.documentType = value;
      }
      if (key === 'unit') doc.unit = value as WorkoutTemplateDocument['unit'];
      if (key === 'goal') doc.goal = value;
      if (key === 'difficulty') doc.difficulty = value;
      if (key === 'duration') doc.estimatedDurationMin = Number(value.replace(/\D/g, '')) || undefined;
      continue;
    }

    if (line.startsWith('## ')) {
      if (currentExercise) {
        doc.exercises.push(currentExercise);
      }
      currentExercise = {
        name: line.replace('## ', '').trim(),
        sets: [],
      };
      inSets = false;
      continue;
    }

    if (!currentExercise) continue;

    if (line.toLowerCase() === 'sets:') {
      inSets = true;
      continue;
    }

    if (inSets && line.startsWith('-')) {
      const set = parseSetLine(line);
      if (set) currentExercise.sets = [...(currentExercise.sets ?? []), set];
      continue;
    }

    const exerciseField = line.match(FIELD_REGEX);
    if (exerciseField) {
      const key = exerciseField[1].toLowerCase();
      const value = exerciseField[2].trim();
      inSets = false;

      if (key === 'muscles') currentExercise.muscleGroups = parseListValue(value);
      if (key === 'equipment') currentExercise.equipment = parseListValue(value);
      if (key === 'rest') currentExercise.restSec = Number(value.replace(/\D/g, '')) || undefined;
      if (key === 'image') {
        currentExercise.images = [...(currentExercise.images ?? []), createMedia(value, 'exercise_demo')];
      }
      if (key === 'musclemap') {
        currentExercise.images = [...(currentExercise.images ?? []), createMedia(value, 'muscle_map')];
      }
    }
  }

  if (currentExercise) {
    doc.exercises.push(currentExercise);
  }

  return doc;
}