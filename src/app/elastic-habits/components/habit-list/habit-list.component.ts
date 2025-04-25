import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Habit } from '../../models/habit.model';

@Component({
  selector: 'app-habit-list',
  standalone: true,
  imports: [NgForOf, NgClass, NgIf],
  templateUrl: './habit-list.component.html',
})
export class HabitListComponent {
  @Input() habits: Habit[] = [];
  @Input() weekDays: Date[] = [];
  @Output() editHabit = new EventEmitter<number>();
  @Output() deleteHabit = new EventEmitter<number>();
  @Output() toggleLevel = new EventEmitter<{habitId: number, date: Date, levelIndex: number}>();

  formatDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  displayDate(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return date.getDate() + ' ' + months[date.getMonth()];
  }

  getDayName(dayIndex: number): string {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayIndex];
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  getWeekKey(date: Date): string {
    const firstDay = new Date(date);
    firstDay.setDate(firstDay.getDate() - firstDay.getDay() + (firstDay.getDay() === 0 ? -6 : 1));
    return this.formatDate(firstDay);
  }

  getCompletedLevelIndex(habit: Habit, date: Date): number | undefined {
    if (habit.isWeekly) {
      const weekKey = this.getWeekKey(this.weekDays[0]);
      return habit.tracking[weekKey];
    }
    return habit.tracking[this.formatDate(date)];
  }

  isLevelCompleted(habit: Habit, date: Date, levelIndex: number): boolean {
    if (habit.isWeekly) {
      const weekKey = this.getWeekKey(this.weekDays[0]);
      return habit.tracking[weekKey] === levelIndex;
    }
    return habit.tracking[this.formatDate(date)] === levelIndex;
  }

  isDayActive(habit: Habit, dayIndex: number): boolean {
    if (habit.isWeekly) return true;
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    return habit.activeDays[adjustedIndex];
  }

  onToggleLevel(habitId: number, date: Date, levelIndex: number): void {
    const habit = this.habits.find(h => h.id === habitId);
    if (!habit) return;

    if (!habit.isWeekly && !this.isDayActive(habit, date.getDay())) {
      return;
    }

    if (habit.isWeekly) {
      const firstDayOfWeek = new Date(this.weekDays[0]);
      this.toggleLevel.emit({habitId, date: firstDayOfWeek, levelIndex});
    } else {
      this.toggleLevel.emit({habitId, date, levelIndex});
    }
  }

  onDelete(habitId: number): void {
    const habit = this.habits.find(h => h.id === habitId);
    if (!habit) return;

    const confirmDelete = confirm(`Are you sure you want to delete the habit "${habit.name}"?`);
    if (confirmDelete) {
      this.deleteHabit.emit(habitId);
    }
  }
}
