export interface Level {
  name: string;
  desc: string;
  color: string;
}

export interface Habit {
  id: number;
  name: string;
  levels: Level[];
  tracking: { [key: string]: number };
  activeDays: boolean[];
  isWeekly: boolean;
}
