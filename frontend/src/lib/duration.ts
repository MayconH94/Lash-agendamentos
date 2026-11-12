export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
}

// 15 min, 30 min ... até 4h, de 15 em 15
export const DURATION_OPTIONS = Array.from({ length: 16 }, (_, i) => (i + 1) * 15);

export const BUFFER_OPTIONS = [0, 5, 10, 15, 20, 30];

// mantém o valor atual do serviço como opção, mesmo que esteja fora da lista
export function withCurrent(options: number[], current: number): number[] {
  return options.includes(current) ? options : [...options, current].sort((a, b) => a - b);
}
