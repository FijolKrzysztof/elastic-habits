export interface Habit {
  id: number;
  name: string;
  color: string;
}

export interface Level {
  name: string;
  color: string;
  bg: string;
}

export interface HabitEntry {
  habitId: number;
  date: string;
  level: string;
}

export interface HabitDescription {
  habitId: number;
  level: string;
  description: string;
}
