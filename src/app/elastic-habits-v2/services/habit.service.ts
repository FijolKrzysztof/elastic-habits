import {computed, Injectable, signal} from '@angular/core';
import {Habit, Level, LevelKey} from '../models/habit.model';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private habitsSignal = signal<Habit[]>([
    { id: 1, name: 'Ćwiczenia', color: '#10B981' },
    { id: 2, name: 'Czytanie', color: '#3B82F6' }
  ]);

  private currentHabitIdSignal = signal<number>(1);
  private habitDataSignal = signal<Record<string, LevelKey>>({});
  private habitDescriptionsSignal = signal<Record<string, string>>({});

  // Nowy signal dla aktualnie wybranego poziomu
  private selectedLevelSignal = signal<LevelKey>('easy');

  readonly habits = this.habitsSignal.asReadonly();
  readonly currentHabitId = this.currentHabitIdSignal.asReadonly();
  readonly habitData = this.habitDataSignal.asReadonly();
  readonly habitDescriptions = this.habitDescriptionsSignal.asReadonly();
  readonly selectedLevel = this.selectedLevelSignal.asReadonly();

  readonly currentHabit = computed(() =>
    this.habits().find(h => h.id === this.currentHabitId())
  );

  readonly levels: Record<LevelKey, Level> = {
    easy: { name: 'Easy', color: '#10B981', bg: '#DCFCE7' },
    standard: { name: 'Standard', color: '#3B82F6', bg: '#DBEAFE' },
    plus: { name: 'Plus', color: '#EF4444', bg: '#FEE2E2' }
  };

  addHabit(name: string): void {
    const newId = Math.max(...this.habits().map(h => h.id)) + 1;
    const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280'];
    const color = colors[this.habits().length % colors.length];

    this.habitsSignal.update(habits => [
      ...habits,
      { id: newId, name: name.trim(), color }
    ]);

    this.setCurrentHabit(newId);
  }

  deleteHabit(habitId: number): void {
    const habits = this.habits();
    if (habits.length <= 1) return;

    this.habitsSignal.update(habits => habits.filter(h => h.id !== habitId));

    const habitData = this.habitData();
    const newHabitData: Record<string, LevelKey> = {};
    Object.keys(habitData).forEach(key => {
      if (!key.startsWith(`${habitId}-`)) {
        newHabitData[key] = habitData[key];
      }
    });
    this.habitDataSignal.set(newHabitData);

    const descriptions = this.habitDescriptions();
    const newDescriptions: Record<string, string> = {};
    Object.keys(descriptions).forEach(key => {
      if (!key.startsWith(`${habitId}-`)) {
        newDescriptions[key] = descriptions[key];
      }
    });
    this.habitDescriptionsSignal.set(newDescriptions);

    if (this.currentHabitId() === habitId) {
      const remainingHabit = this.habits().find(h => h.id !== habitId);
      if (remainingHabit) {
        this.setCurrentHabit(remainingHabit.id);
      }
    }
  }

  setCurrentHabit(habitId: number): void {
    this.currentHabitIdSignal.set(habitId);
  }

  // Nowa metoda do ustawiania wybranego poziomu
  setSelectedLevel(level: LevelKey): void {
    this.selectedLevelSignal.set(level);
  }

  // Metoda do pobierania aktualnie wybranego poziomu
  getSelectedLevel(): LevelKey {
    return this.selectedLevel();
  }

  toggleDayStatus(date: Date, selectedLevel?: LevelKey): void {
    // Jeśli nie podano poziomu, użyj aktualnie wybranego
    const levelToUse = selectedLevel || this.getSelectedLevel();
    const key = `${this.currentHabitId()}-${this.formatDateKey(date)}`;
    const currentStatus = this.habitData()[key];

    this.habitDataSignal.update(prev => {
      const newData = { ...prev };

      if (!currentStatus) {
        newData[key] = levelToUse;
      } else if (currentStatus === levelToUse) {
        delete newData[key];
      } else {
        newData[key] = levelToUse;
      }

      return newData;
    });
  }

  getDayStatus(date: Date): LevelKey | null {
    const key = `${this.currentHabitId()}-${this.formatDateKey(date)}`;
    return this.habitData()[key] || null;
  }

  getHabitDescription(level: LevelKey): string {
    const key = `${this.currentHabitId()}-${level}`;
    return this.habitDescriptions()[key] || this.getDefaultDescription(level);
  }

  updateHabitDescription(level: LevelKey, description: string): void {
    const key = `${this.currentHabitId()}-${level}`;
    this.habitDescriptionsSignal.update(prev => ({
      ...prev,
      [key]: description
    }));
  }

  private getDefaultDescription(level: LevelKey): string {
    const defaults: Record<LevelKey, string> = {
      easy: '5 min',
      standard: '15 min',
      plus: '30 min'
    };
    return defaults[level];
  }

  private formatDateKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }
}
