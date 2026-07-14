import { buildAiImportProgramJsonExample } from '../features/import/model/ai-import.prompt';
import { validateWorkoutImport } from '../features/import/model/import.schema';
import {
  buildWeeklyProgramFromImport,
  mapImportProgressionToSettings,
  transformProgramWorkouts,
} from '../features/import/model/import.program';
import { isProgramImportDocument } from '../features/import/model/import.types';

describe('program import', () => {
  const example = JSON.parse(buildAiImportProgramJsonExample('kg'));

  it('validates weekly program example', () => {
    const result = validateWorkoutImport(example);
    expect(result.success).toBe(true);
    expect(result.document && isProgramImportDocument(result.document)).toBe(true);
  });

  it('creates templates and weekly schedule', () => {
    const result = validateWorkoutImport(example);
    expect(result.success).toBe(true);
    if (!result.document || !isProgramImportDocument(result.document)) return;

    const templates = transformProgramWorkouts(result.document);
    const program = buildWeeklyProgramFromImport(result.document, templates);

    expect(templates).toHaveLength(2);
    expect(program.days.filter((day) => day.type === 'workout')).toHaveLength(3);
    expect(program.days[0]).toMatchObject({ type: 'workout', title: 'Full Body A' });
    expect(program.days[2]).toMatchObject({ type: 'workout', title: 'Full Body B' });
  });

  it('maps progression block to settings', () => {
    const result = validateWorkoutImport(example);
    if (!result.document || !isProgramImportDocument(result.document)) return;

    const settings = mapImportProgressionToSettings(result.document.progression);
    expect(settings.mode).toBe('linear');
    expect(settings.cadence).toBe('weekly');
    expect(settings.weightIncrementKg).toBe(2.5);
  });
});