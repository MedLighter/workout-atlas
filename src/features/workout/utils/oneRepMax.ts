export function calculateOneRepMax(weight: number, reps: number): number {
  return weight * (1 + reps / 30);
}

export function formatOneRepMax(weight: number, reps: number): string | null {
  if (!weight || weight <= 0 || !reps || reps <= 0) {
    return null;
  }
  const value = calculateOneRepMax(weight, reps);
  return `${value.toFixed(1)} (оценка)`;
}