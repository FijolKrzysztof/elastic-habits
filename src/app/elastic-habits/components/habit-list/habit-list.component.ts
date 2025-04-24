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
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][dayIndex === 0 ? 6 : dayIndex - 1];
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  getCompletedLevelIndex(habit: Habit, date: Date): number {
    const dateStr = this.formatDate(date);
    return habit.tracking[dateStr];
  }

  isLevelCompleted(habit: Habit, date: Date, levelIndex: number): boolean {
    const dateStr = this.formatDate(date);
    return habit.tracking[dateStr] === levelIndex;
  }

  isDayActive(habit: Habit, dayIndex: number): boolean {
    return habit.activeDays[dayIndex];
  }

  onToggleLevel(habitId: number, date: Date, levelIndex: number): void {
    this.toggleLevel.emit({habitId, date, levelIndex});
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
