import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitService } from '../../services/habit.service';
import { DateService } from '../../services/date.service';
import { LevelSelectorComponent } from '../level-selector.component';
import { CalendarDayComponent } from './calendar-day.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, LevelSelectorComponent, CalendarDayComponent],
  template: `
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold" [style.color]="habitService.currentHabit()?.color">
        {{ habitService.currentHabit()?.name }}
      </h2>
      <div class="flex gap-2">
        <button
          (click)="dateService.navigateMonth(-1)"
          class="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <button
          (click)="dateService.navigateMonth(1)"
          class="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>

    <div class="flex gap-6">
      <app-level-selector #levelSelector></app-level-selector>

      <div class="flex-1">
        <h3 class="text-lg font-medium text-center mb-4 text-gray-800">
          {{ dateService.months[dateService.currentDate().getMonth()] }}
          {{ dateService.currentDate().getFullYear() }}
        </h3>

        <div class="grid grid-cols-7 gap-2">
          @for (day of dateService.weekDays; track day) {
            <div class="text-center font-medium text-gray-600 py-2">
              {{ day }}
            </div>
          }

          @for (date of dateService.getCalendarDays(); track $index) {
            <div class="aspect-square">
              @if (date) {
                <app-calendar-day
                  [date]="date"
                  [isAnimating]="isAnimating(date)"
                  (dayClicked)="onDayClicked($event)"
                ></app-calendar-day>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class CalendarComponent {
  @ViewChild('levelSelector') levelSelector!: LevelSelectorComponent;
  private animatingDates = new Set<string>();

  constructor(
    public habitService: HabitService,
    public dateService: DateService
  ) {}

  onDayClicked(date: Date): void {
    const selectedLevel = this.levelSelector.getSelectedLevel();
    const dateKey = date.toDateString();

    // Dodaj animację tylko jeśli dodajemy nowy status (nie usuwamy)
    const currentStatus = this.habitService.getDayStatus(date);
    if (!currentStatus && selectedLevel) {
      this.animatingDates.add(dateKey);

      // Usuń animację po zakończeniu
      setTimeout(() => {
        this.animatingDates.delete(dateKey);
      }, 800);
    }

    this.habitService.toggleDayStatus(date, selectedLevel);
  }

  isAnimating(date: Date): boolean {
    return this.animatingDates.has(date.toDateString());
  }
}
