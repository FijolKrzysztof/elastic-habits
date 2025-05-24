import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitService } from '../services/habit.service';
import { DateService } from '../services/date.service';
import {LevelSelectorComponent} from './level-selector.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, LevelSelectorComponent, LevelSelectorComponent],
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
                <button
                  (click)="toggleDay(date)"
                  class="w-full h-full rounded-lg font-medium transition-all border-2 border-gray-300 hover:border-gray-400 flex flex-col bg-white hover:bg-gray-50 text-gray-700 shadow-sm"
                  [class.border-blue-500]="dateService.isToday(date)"
                  [class.border-4]="dateService.isToday(date)"
                >
                  <div class="flex-none pt-1">
                    <span class="text-sm">{{ date.getDate() }}</span>
                  </div>
                  <div class="flex-1 flex items-center justify-center">
                    @if (habitService.getDayStatus(date)) {
                      <svg class="w-13 h-13" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                           [style.color]="habitService.levels[habitService.getDayStatus(date)!].color"
                           style="stroke-width: 3; width: 52px; height: 52px;">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                      </svg>
                    }
                  </div>
                </button>
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

  constructor(
    public habitService: HabitService,
    public dateService: DateService
  ) {}

  toggleDay(date: Date): void {
    const selectedLevel = this.levelSelector.getSelectedLevel();
    this.habitService.toggleDayStatus(date, selectedLevel);
  }
}
