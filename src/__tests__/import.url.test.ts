import { normalizeMediaUrl } from '../features/import/model/import.url';
import { validateWorkoutImport } from '../features/import/model/import.schema';

describe('normalizeMediaUrl', () => {
  it('adds https:// when protocol is missing', () => {
    expect(normalizeMediaUrl('www.example.com/a.png')).toBe('https://www.example.com/a.png');
  });

  it('supports protocol-relative URLs', () => {
    expect(normalizeMediaUrl('//cdn.example.com/a.svg')).toBe('https://cdn.example.com/a.svg');
  });

  it('trims whitespace and trailing punctuation', () => {
    expect(normalizeMediaUrl(' "https://example.com/a.png", ')).toBe('https://example.com/a.png');
  });
});

describe('validateWorkoutImport media urls', () => {
  const base = {
    protocolVersion: '1.1',
    documentType: 'workout_template',
    title: 'Test',
    unit: 'kg',
    exercises: [
      {
        name: 'Жим',
        images: [{ role: 'exercise_demo', format: 'svg', url: 'www.example.com/a.svg', alt: 'demo' }],
        sets: [{ type: 'working', weight: 50, reps: 8 }],
      },
    ],
  };

  it('accepts URLs without protocol and normalizes them', () => {
    const result = validateWorkoutImport(base);
    expect(result.success).toBe(true);
    if (!result.success || result.document?.documentType !== 'workout_template') return;

    expect(result.document.exercises[0].images?.[0].url).toBe('https://www.example.com/a.svg');
  });
});