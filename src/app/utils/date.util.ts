import { environment } from '../../environments/environment';

export function getYears(): number[] {
  const currentYear = new Date().getFullYear();
  return Array.from(
    { length: currentYear - environment.START_YEAR + 1 },
    (_, i) => environment.START_YEAR + i
  ).reverse();
}
