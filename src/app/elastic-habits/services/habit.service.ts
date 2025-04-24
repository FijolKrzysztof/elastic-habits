import { Injectable } from '@angular/core';
import { Habit } from '../models/habit.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private habits: Habit[] = [];
  private habitsSubject = new BehaviorSubject<Habit[]>([]);

  constructor() {
    this.loadHabits();
  }

  private loadHabits(): void {
    const savedHabits = localStorage.getItem('elasticHabits');
    if (savedHabits) {
      this.habits = JSON.parse(savedHabits);
      this.habits.forEach(habit => {
        if (!habit.activeDays) {
          habit.activeDays = [true, true, true, true, true, true, true];
        }
        if (habit.isWeekly === undefined) {
          habit.isWeekly = false;
        }
      });
      this.habitsSubject.next(this.habits);
    }
  }

  getHabits(): Observable<Habit[]> {
    return this.habitsSubject.asObservable();
  }

  addHabit(habit: Habit): void {
    this.habits.push(habit);
    this.saveHabits();
  }

  updateHabit(updatedHabit: Habit): void {
    const index = this.habits.findIndex(h => h.id === updatedHabit.id);
    if (index !== -1) {
      this.habits[index] = updatedHabit;
      this.saveHabits();
    }
  }

  deleteHabit(habitId: number): void {
    this.habits = this.habits.filter(habit => habit.id !== habitId);
    this.saveHabits();
  }

  private saveHabits(): void {
    localStorage.setItem('elasticHabits', JSON.stringify(this.habits));
    this.habitsSubject.next(this.habits);
  }

  importHabits(habits: Habit[]): void {
    this.habits = habits;
    this.saveHabits();
  }

  exportHabits(): string {
    return JSON.stringify(this.habits, null, 2);
  }
}
