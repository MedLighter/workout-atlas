import type { WeeklyProgram, WorkoutSession } from '../../workout/model/workout.types';
import { mockFullBodyASession } from '../../../shared/mock/mock-data';
import { templateFullBodyB } from '../../workout/model/workout.templates';
import type {
  GeneratorDuration,
  GeneratorExperience,
  GeneratorFrequency,
  GeneratorLocation,
} from '../../onboarding/model/onboarding.store';

interface GeneratorAnswers {
  frequency: GeneratorFrequency;
  duration: GeneratorDuration;
  location: GeneratorLocation;
  experience: GeneratorExperience;
  limitations: string[];
}

function cloneTemplate(session: WorkoutSession, id: string, title: string): WorkoutSession {
  const today = new Date().toISOString().split('T')[0];
  return {
    ...JSON.parse(JSON.stringify(session)),
    id,
    title,
    date: today,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    exercises: session.exercises.map((ex) => ({
      ...ex,
      status: 'not_started' as const,
      sets: ex.sets.map((s) => ({ ...s, completed: false })),
    })),
  };
}

export function generateProgramFromAnswers(answers: GeneratorAnswers): {
  templates: WorkoutSession[];
  program: WeeklyProgram;
} {
  const templateA = cloneTemplate(mockFullBodyASession, 'template-full-body-a', 'Full Body A');
  const templateB = cloneTemplate(templateFullBodyB, 'template-full-body-b', 'Full Body B');
  const templateC = cloneTemplate(mockFullBodyASession, 'template-full-body-c', 'Full Body C');

  const templates = [templateA, templateB, templateC].slice(0, Math.min(answers.frequency, 3));

  const workoutDays: WeeklyProgram['days'] = [
    { weekday: 0, type: 'workout', title: 'Full Body A', templateId: 'template-full-body-a' },
    { weekday: 1, type: 'rest', title: 'Отдых' },
    { weekday: 2, type: 'workout', title: 'Full Body B', templateId: 'template-full-body-b' },
    { weekday: 3, type: 'rest', title: 'Отдых' },
    { weekday: 4, type: 'workout', title: 'Full Body C', templateId: 'template-full-body-c' },
    { weekday: 5, type: 'rest', title: 'Отдых' },
    { weekday: 6, type: 'rest', title: 'Отдых' },
  ];

  const activeWorkouts = workoutDays.filter((d) => d.type === 'workout').slice(0, answers.frequency);
  const restDays = workoutDays.filter((d) => d.type === 'rest');
  const days = [...activeWorkouts, ...restDays].sort((a, b) => a.weekday - b.weekday);

  return {
    templates,
    program: {
      id: 'program-generated',
      name: `Full Body · ${answers.frequency}x`,
      days,
    },
  };
}