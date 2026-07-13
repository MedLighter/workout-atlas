import {
  AI_IMPORT_SECTIONS,
  buildAiImportCopyPackage,
  buildAiImportJsonExample,
  buildAiImportMarkdownExample,
  buildAiImportPrompt,
} from '../features/import/model/ai-import.prompt';
import { validateWorkoutImport } from '../features/import/model/import.schema';

describe('ai import prompt kit', () => {
  it('builds prompt with selected unit', () => {
    expect(buildAiImportPrompt('lb')).toContain('unit: "lb"');
    expect(buildAiImportPrompt('kg')).toContain('unit: "kg"');
  });

  it('includes all sections in copy package', () => {
    const kit = buildAiImportCopyPackage('kg');

    expect(kit).toContain('Workout Atlas — AI Import Kit');
    expect(kit).toContain('ПРОМПТ ДЛЯ AI');
    expect(kit).toContain('ПРИМЕР JSON');
    expect(kit).toContain('ПРИМЕР MARKDOWN');
    expect(kit).toContain('СПРАВОЧНИК ПОЛЕЙ');
    expect(kit).toContain('ПРАВИЛА ВАЛИДАЦИИ');
  });

  it('provides valid json example', () => {
    const example = JSON.parse(buildAiImportJsonExample('kg'));
    const result = validateWorkoutImport(example);

    expect(result.success).toBe(true);
    expect(example.exercises.length).toBeGreaterThan(1);
  });

  it('provides markdown example with unit', () => {
    const markdown = buildAiImportMarkdownExample('lb');
    expect(markdown).toContain('Unit: lb');
    expect(markdown).toContain('## Жим лежа');
  });

  it('exposes copyable sections', () => {
    expect(AI_IMPORT_SECTIONS.length).toBeGreaterThanOrEqual(5);
    expect(AI_IMPORT_SECTIONS[0].getContent('kg').length).toBeGreaterThan(100);
  });
});