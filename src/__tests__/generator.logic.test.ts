import { generateProgramFromAnswers } from '../features/generator/model/generator.logic';

describe('generateProgramFromAnswers', () => {
  const baseAnswers = {
    duration: 45 as const,
    location: 'gym' as const,
    experience: 'under_year' as const,
    limitations: [] as string[],
  };

  it('creates matching templates and schedule for 3 workouts per week', () => {
    const result = generateProgramFromAnswers({ ...baseAnswers, frequency: 3 });

    expect(result.templates).toHaveLength(3);
    expect(result.program.days.filter((day) => day.type === 'workout')).toHaveLength(3);

    for (const day of result.program.days) {
      if (day.type !== 'workout') continue;
      expect(result.templates.some((template) => template.id === day.templateId)).toBe(true);
    }
  });

  it('creates enough templates when user selects 5 workouts per week', () => {
    const result = generateProgramFromAnswers({ ...baseAnswers, frequency: 5 });

    expect(result.templates).toHaveLength(5);
    expect(result.program.days.filter((day) => day.type === 'workout')).toHaveLength(5);

    for (const day of result.program.days) {
      if (day.type !== 'workout') continue;
      expect(result.templates.some((template) => template.id === day.templateId)).toBe(true);
    }
  });
});