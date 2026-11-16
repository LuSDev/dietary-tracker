/**
 * Formats a Date object as local YYYY-MM-DD string.
 */
export function toDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses a YYYY-MM-DD key into a local Date at noon to avoid DST shifts.
 */
export function parseDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0);
}

/**
 * Adds or subtracts days from a YYYY-MM-DD key.
 */
export function addDaysToKey(dateKey: string, deltaDays: number): string {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + deltaDays);
  return toDateKey(date);
}

/**
 * Formats a YYYY-MM-DD key into a friendly Spanish header label.
 */
export function formatSpanishDateHeader(dateKey: string, todayKey: string = toDateKey()): {
  primary: string;
  secondary: string;
  isToday: boolean;
} {
  const target = parseDateKey(dateKey);
  const yesterdayKey = addDaysToKey(todayKey, -1);
  const tomorrowKey = addDaysToKey(todayKey, 1);

  const formattedFull = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'short'
  }).format(target);

  const capitalized = formattedFull.charAt(0).toUpperCase() + formattedFull.slice(1);

  if (dateKey === todayKey) {
    return { primary: 'Hoy', secondary: capitalized, isToday: true };
  }
  if (dateKey === yesterdayKey) {
    return { primary: 'Ayer', secondary: capitalized, isToday: false };
  }
  if (dateKey === tomorrowKey) {
    return { primary: 'Mañana', secondary: capitalized, isToday: false };
  }

  const shortLabel = new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short'
  }).format(target);

  const weekday = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(target);
  return {
    primary: shortLabel,
    secondary: weekday.charAt(0).toUpperCase() + weekday.slice(1),
    isToday: false
  };
}

/**
 * Generates a 7-day strip centered or ending around the selected date.
 */
export function getWeekStripDays(selectedKey: string, todayKey: string = toDateKey()): Array<{
  dateKey: string;
  dayNameShort: string;
  dayNumber: number;
  isToday: boolean;
  isFuture: boolean;
}> {
  const selectedDate = parseDateKey(selectedKey);
  // Show 6 days ending on today if selected is near today, or centered around selected
  const todayDate = parseDateKey(todayKey);
  const diffDays = Math.round((todayDate.getTime() - selectedDate.getTime()) / (1000 * 60 * 60 * 24));

  const anchorKey = diffDays >= 0 && diffDays <= 5 ? todayKey : addDaysToKey(selectedKey, 2);

  const result = [];
  for (let i = 6; i >= 0; i--) {
    const key = addDaysToKey(anchorKey, -i);
    const d = parseDateKey(key);
    const weekday = new Intl.DateTimeFormat('es-ES', { weekday: 'short' })
      .format(d)
      .replace('.', '')
      .slice(0, 2);
    result.push({
      dateKey: key,
      dayNameShort: weekday.charAt(0).toUpperCase() + weekday.slice(1),
      dayNumber: d.getDate(),
      isToday: key === todayKey,
      isFuture: key > todayKey
    });
  }
  return result;
}

/**
 * Generates calendar month cells (Monday-first week) for a given year & month (0-indexed).
 */
export function getCalendarMonthGrid(year: number, monthIndex: number): {
  monthTitle: string;
  cells: Array<{ dateKey: string | null; dayNumber: number | null }>;
} {
  const firstDay = new Date(year, monthIndex, 1, 12, 0, 0);
  const daysInMonth = new Date(year, monthIndex + 1, 0, 12, 0, 0).getDate();

  const rawTitle = new Intl.DateTimeFormat('es-ES', {
    month: 'long',
    year: 'numeric'
  }).format(firstDay);
  const monthTitle = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);

  // Convert JS Sunday=0..Saturday=6 into Monday=0..Sunday=6
  const startOffset = (firstDay.getDay() + 6) % 7;

  const cells: Array<{ dateKey: string | null; dayNumber: number | null }> = [];
  for (let i = 0; i < startOffset; i++) {
    cells.push({ dateKey: null, dayNumber: null });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = toDateKey(new Date(year, monthIndex, day, 12, 0, 0));
    cells.push({ dateKey, dayNumber: day });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ dateKey: null, dayNumber: null });
  }

  return { monthTitle, cells };
}
