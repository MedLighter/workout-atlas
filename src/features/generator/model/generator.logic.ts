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

const WORKOUT_WEEKDAYS: Record<GeneratorFrequency, number[]> = {
  2: [0, 3],
  3: [0, 2, 4],
  4: [0, 1, 3, 4],
  5: [0, 1, 2, 3, 4],
};

const TEMPLATE_SOURCES = [mockFullBodyASession, templateFullBodyB, mockFullBodyASession];

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
  const workoutWeekdays = WORKOUT_WEEKDAYS[answers.frequency];

  const templates = workoutWeekdays.map((_, index) => {
    const source = TEMPLATE_SOURCES[index % TEMPLATE_SOURCES.length];
    const id = `template-generated-${index + 1}`;
    const title = `Full Body ${index + 1}`;
    return cloneTemplate(source, id, title);
  });

  const days: WeeklyProgram['days'] = Array.from({ length: 7 }, (_, weekday) => {
    const workoutIndex = workoutWeekdays.indexOf(weekday);
    if (workoutIndex === -1) {
      return { weekday, type: 'rest', title: 'Отдых' };
    }

    const template = templates[workoutIndex];
    return {
      weekday,
      type: 'workout',
      title: template.title,
      templateId: template.id,
    };
  });

  return {
    templates,
    program: {
      id: 'program-generated',
      name: `Full Body · ${answers.frequency}x`,
      days,
    },
  };
}