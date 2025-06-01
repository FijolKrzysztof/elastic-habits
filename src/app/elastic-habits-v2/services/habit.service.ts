import {computed, effect, Injectable, signal} from '@angular/core';
import {Habit, Level, LevelKey} from '../models/habit.model';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private readonly STORAGE_KEYS = {
    HABITS: 'habit-tracker-habits',
    HABIT_DATA: 'habit-tracker-habit-data',
    HABIT_DESCRIPTIONS: 'habit-tracker-habit-descriptions'
  };

  private habitsSignal = signal<Habit[]>(this.loadHabits());
  private currentHabitIdSignal = signal<number>(this.getDefaultCurrentHabitId());
  private habitDataSignal = signal<Record<string, LevelKey>>(this.loadHabitData());
  private habitDescriptionsSignal = signal<Record<string, string>>(this.loadHabitDescriptions());
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

  constructor() {
    // Nasłuchiwanie zmian i automatyczne zapisywanie tylko dla trwałych danych
    effect(() => {
      this.habits(); // odczytanie sygnału
      this.saveHabits();
    });

    effect(() => {
      this.habitData(); // odczytanie sygnału
      this.saveHabitData();
    });

    effect(() => {
      this.habitDescriptions(); // odczytanie sygnału
      this.saveHabitDescriptions();
    });
  }

  // Metody ładowania z localStorage
  private loadHabits(): Habit[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.HABITS);
      return stored ? JSON.parse(stored) : [
        { id: 1, name: 'Ćwiczenia', color: '#10B981' },
        { id: 2, name: 'Czytanie', color: '#3B82F6' }
      ];
    } catch (error) {
      console.error('Błąd ładowania nawyków:', error);
      return [
        { id: 1, name: 'Ćwiczenia', color: '#10B981' },
        { id: 2, name: 'Czytanie', color: '#3B82F6' }
      ];
    }
  }

  private getDefaultCurrentHabitId(): number {
    // Zawsze zaczynamy od pierwszego nawyku z listy
    const habits = this.loadHabits();
    return habits.length > 0 ? habits[0].id : 1;
  }

  private loadHabitData(): Record<string, LevelKey> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.HABIT_DATA);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Błąd ładowania danych nawyków:', error);
      return {};
    }
  }

  private loadHabitDescriptions(): Record<string, string> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.HABIT_DESCRIPTIONS);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Błąd ładowania opisów nawyków:', error);
      return {};
    }
  }

  // Metody zapisywania do localStorage
  private saveHabits(): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.HABITS, JSON.stringify(this.habits()));
    } catch (error) {
      console.error('Błąd zapisywania nawyków:', error);
    }
  }

  private saveHabitData(): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.HABIT_DATA, JSON.stringify(this.habitData()));
    } catch (error) {
      console.error('Błąd zapisywania danych nawyków:', error);
    }
  }

  private saveHabitDescriptions(): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.HABIT_DESCRIPTIONS, JSON.stringify(this.habitDescriptions()));
    } catch (error) {
      console.error('Błąd zapisywania opisów nawyków:', error);
    }
  }

  // Metody publiczne - bez zmian w logice biznesowej
  addHabit(name: string): number {
    const newId = Math.max(...this.habits().map(h => h.id)) + 1;
    const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280'];
    const color = colors[this.habits().length % colors.length];

    this.habitsSignal.update(habits => [
      ...habits,
      { id: newId, name: name.trim(), color }
    ]);

    this.setCurrentHabit(newId);
    return newId;
  }

  updateHabitName(habitId: number, newName: string): void {
    this.habitsSignal.update(habits =>
      habits.map(habit =>
        habit.id === habitId
          ? { ...habit, name: newName.trim() }
          : habit
      )
    );
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

  setSelectedLevel(level: LevelKey): void {
    this.selectedLevelSignal.set(level);
  }

  getSelectedLevel(): LevelKey {
    return this.selectedLevel();
  }

  toggleDayStatus(date: Date, selectedLevel?: LevelKey): void {
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

  // Metoda do czyszczenia wszystkich danych (opcjonalna)
  clearAllData(): void {
    try {
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });

      // Resetowanie do wartości domyślnych
      this.habitsSignal.set([
        { id: 1, name: 'Ćwiczenia', color: '#10B981' },
        { id: 2, name: 'Czytanie', color: '#3B82F6' }
      ]);
      this.currentHabitIdSignal.set(1);
      this.habitDataSignal.set({});
      this.habitDescriptionsSignal.set({});
      this.selectedLevelSignal.set('easy');
    } catch (error) {
      console.error('Błąd czyszczenia danych:', error);
    }
  }

  // Metoda do eksportu danych (opcjonalna)
  exportData(): string {
    try {
      const data = {
        habits: this.habits(),
        habitData: this.habitData(),
        habitDescriptions: this.habitDescriptions(),
        exportDate: new Date().toISOString()
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Błąd eksportu danych:', error);
      return '';
    }
  }

  // Metoda do importu danych (opcjonalna)
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);

      if (data.habits) this.habitsSignal.set(data.habits);
      if (data.habitData) this.habitDataSignal.set(data.habitData);
      if (data.habitDescriptions) this.habitDescriptionsSignal.set(data.habitDescriptions);

      // Po imporcie ustawiamy pierwszy nawyk jako aktualny
      if (data.habits && data.habits.length > 0) {
        this.currentHabitIdSignal.set(data.habits[0].id);
      }

      return true;
    } catch (error) {
      console.error('Błąd importu danych:', error);
      return false;
    }
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
