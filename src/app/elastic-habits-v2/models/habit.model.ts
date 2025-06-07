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

export type LevelKey = 'mini' | 'standard' | 'plus';

export type LevelEntry = {
  key: LevelKey;
  data: Level;
};
