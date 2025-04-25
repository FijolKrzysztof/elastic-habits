import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HabitListComponent} from '../habit-list.component';
import {Habit} from '../../../models/habit.model';

@Component({
  selector: 'app-habit-list-mobile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./habit-list-mobile.component.html`,
  styles: []
})
export class HabitListMobileComponent extends HabitListComponent {
  currentDayIndex = 0;
  selectedHabit: number | null = null;

  constructor() {
    super();
    setTimeout(() => {
      for (let i = 0; i < this.weekDays.length; i++) {
        if (this.isToday(this.weekDays[i])) {
          this.currentDayIndex = i;
          break;
        }
      }
    });
  }

  getDateDay(date: Date): string {
    return String(date.getDate());
  }

  getDayShortName(dayIndex: number): string {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayIndex];
  }

  getCompletedLevelCount(habit: Habit, date: Date): number {
    const dateStr = habit.isWeekly ? this.getWeekKey(this.weekDays[0]) : this.formatDate(date);
    return habit.tracking[dateStr] !== undefined ? 1 : 0;
  }

  selectHabit(index: number): void {
    this.selectedHabit = index;
  }

  backToList(): void {
    this.selectedHabit = null;
  }

  previousDay(): void {
    this.currentDayIndex = this.currentDayIndex > 0 ? this.currentDayIndex - 1 : 6;
  }

  nextDay(): void {
    this.currentDayIndex = this.currentDayIndex < 6 ? this.currentDayIndex + 1 : 0;
  }
}
