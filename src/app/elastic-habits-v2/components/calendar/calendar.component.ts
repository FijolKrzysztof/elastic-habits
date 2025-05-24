import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitService } from '../../services/habit.service';
import { DateService } from '../../services/date.service';
import { LevelSelectorComponent } from '../level-selector/level-selector.component';
import { CalendarDayComponent } from './calendar-day/calendar-day.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, LevelSelectorComponent, CalendarDayComponent],
  template: `
    <style>
      .calendar-header {
        background: white;
        border-radius: 16px 16px 0 0;
        padding: 24px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05);
        margin-bottom: 0;
      }

      .header-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .nav-btn {
        padding: 12px;
        background: transparent;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .nav-btn:hover {
        background: #f3f4f6;
      }

      .nav-btn svg {
        width: 24px;
        height: 24px;
        color: #6b7280;
      }

      .nav-btn:hover svg {
        color: #1f2937;
      }

      .nav-controls {
        display: flex;
        gap: 8px;
      }

      .month-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1f2937;
      }

      .calendar-body {
        background: white;
        border-radius: 0 0 16px 16px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05);
        overflow: hidden; /* Kluczowe - wymusza respektowanie border-radius przez dzieci */
      }

      .weekdays-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        border-bottom: 1px solid #e5e7eb;
      }

      .weekday-header {
        padding: 16px;
        text-align: center;
        font-weight: 600;
        background: #f9fafb;
        color: #6b7280;
      }

      .weekday-weekend {
        color: #ef4444;
        background: #fef2f2;
      }

      .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
      }

      .day-slot {
        height: 96px;
        border-right: 1px solid #f3f4f6;
        border-bottom: 1px solid #f3f4f6;
        overflow: hidden; /* Wymusza zaokrąglenie dla przycisków wewnątrz */
        position: relative;
      }

      .day-slot:nth-child(7n) {
        border-right: none;
      }

      .day-slot:nth-child(6n), .day-slot:nth-child(7n) {
        background: #fef2f2;
      }

      /* Usunięcie dolnej ramki z ostatniego rzędu */
      .day-slot:nth-last-child(-n+7) {
        border-bottom: none;
      }

      /* Zaokrąglenie TYLKO dla lewego dolnego rogu - element musi być zarówno w ostatnim rzędzie JAK I w pierwszej kolumnie */
      .day-slot:nth-last-child(-n+7):nth-child(7n+1) {
        border-bottom-left-radius: 16px;
      }

      .day-slot:nth-last-child(-n+7):nth-child(7n+1) ::ng-deep .calendar-day-btn {
        border-bottom-left-radius: 16px;
      }

      /* Zaokrąglenie TYLKO dla prawego dolnego rogu - ostatni element w gridzie */
      .day-slot:last-child {
        border-bottom-right-radius: 16px;
      }

      .day-slot:last-child ::ng-deep .calendar-day-btn {
        border-bottom-right-radius: 16px;
      }
    </style>

    <div class="flex gap-6">
      <app-level-selector #levelSelector></app-level-selector>

      <div class="flex-1">
        <!-- Calendar Header -->
        <div class="calendar-header">
          <div class="header-controls">
            <h3 class="month-title">
              {{ dateService.months[dateService.currentDate().getMonth()] }}
              {{ dateService.currentDate().getFullYear() }}
            </h3>
            <div class="nav-controls">
              <button
                (click)="dateService.navigateMonth(-1)"
                class="nav-btn"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <button
                (click)="dateService.navigateMonth(1)"
                class="nav-btn"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Calendar Body -->
        <div class="calendar-body">
          <!-- Weekday Headers -->
          <div class="weekdays-grid">
            @for (day of dateService.weekDays; track day; let i = $index) {
              <div class="weekday-header" [class.weekday-weekend]="i >= 5">
                {{ day }}
              </div>
            }
          </div>

          <!-- Calendar Days -->
          <div class="calendar-grid">
            @for (date of dateService.getCalendarDays(); track $index) {
              <div class="day-slot">
                @if (date) {
                  <app-calendar-day
                    [date]="date"
                    (dayClicked)="onDayClicked($event)"
                  ></app-calendar-day>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class CalendarComponent {
  @ViewChild('levelSelector') levelSelector!: LevelSelectorComponent;
  @ViewChildren(CalendarDayComponent) calendarDays!: QueryList<CalendarDayComponent>;

  constructor(
    public habitService: HabitService,
    public dateService: DateService
  ) {}

  onDayClicked(event: { date: Date; selectedLevel: string }): void {
    const selectedLevel = this.levelSelector.getSelectedLevel();
    const { date } = event;

    // Znajdź odpowiedni CalendarDayComponent i uruchom animację
    const dayComponent = this.calendarDays.find(
      component => component.date.toDateString() === date.toDateString()
    );

    if (dayComponent && selectedLevel) {
      dayComponent.triggerAnimation(selectedLevel);
    }

    // Aktualizuj status w serwisie
    this.habitService.toggleDayStatus(date, selectedLevel);
  }
}
