import { Component, Input, Output, EventEmitter, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitService } from '../../../services/habit.service';
import { DateService } from '../../../services/date.service';

@Component({
  selector: 'app-calendar-day',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./calendar-day.component.scss'],
  template: `
    @if (date) {
      <button
        (click)="onDayClick()"
        [disabled]="isFutureDate()"
        class="calendar-day-btn"
        [class.calendar-day-today]="dateService.isToday(date)"
        [class.calendar-day-weekend]="isWeekend()"
      >
        <div class="day-number">
          {{ date.getDate() }}
        </div>

        <div class="checkmark-container">
          @if (habitService.getDayStatus(date)) {
            <svg
              class="w-13 h-13 transition-all duration-200"
              [class.animate-check-mini]="isAnimating && animationLevel === 'mini'"
              [class.animate-check-standard]="isAnimating && animationLevel === 'standard'"
              [class.animate-check-plus]="isAnimating && animationLevel === 'plus'"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              [style.color]="habitService.levels[habitService.getDayStatus(date)!].color"
              style="stroke-width: 3; width: 52px; height: 52px;"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
            </svg>
          }

          @if (isAnimating && animationLevel) {
            <div class="absolute inset-0 pointer-events-none">
              @if (animationLevel === 'mini') {
                @for (particle of [1, 2, 3]; track particle) {
                  <div class="absolute animate-confetti-mini-{{particle}} w-1 h-1 rounded-full opacity-0"
                       [style.background-color]="getMiniColor(particle)"
                       [style.left]="getConfettiStart(particle) + '%'"
                       [style.top]="getConfettiStart(particle + 2) + '%'">
                  </div>
                }
              }

              @if (animationLevel === 'standard') {
                @for (particle of [1, 2, 3, 4, 5]; track particle) {
                  <div class="absolute animate-confetti-standard-{{particle}} w-1.5 h-1.5 rounded-full opacity-0"
                       [style.background-color]="getStandardColor(particle)"
                       [style.left]="getConfettiStart(particle) + '%'"
                       [style.top]="getConfettiStart(particle + 3) + '%'">
                  </div>
                }
              }

              @if (animationLevel === 'plus') {
                @for (particle of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; track particle) {
                  <div class="absolute animate-confetti-plus-{{particle}} w-2 h-2 opacity-0"
                       [class.rounded-full]="particle <= 5"
                       [class.rotate-45]="particle > 5"
                       [style.background-color]="getPlusColor(particle)"
                       [style.left]="getConfettiStart(particle) + '%'"
                       [style.top]="getConfettiStart(particle + 4) + '%'">
                  </div>
                }
              }
            </div>
          }
        </div>

        @if (isAnimating && animationLevel) {
          <div class="absolute inset-0 pointer-events-none opacity-0"
               [class.bg-gradient-to-br]="true"
               [class.from-green-100]="animationLevel === 'mini'"
               [class.to-green-200]="animationLevel === 'mini'"
               [class.from-blue-200]="animationLevel === 'standard'"
               [class.to-indigo-200]="animationLevel === 'standard'"
               [class.from-purple-200]="animationLevel === 'plus'"
               [class.to-pink-200]="animationLevel === 'plus'"
               [class.animate-success-bg-mini]="animationLevel === 'mini'"
               [class.animate-success-bg-standard]="animationLevel === 'standard'"
               [class.animate-success-bg-plus]="animationLevel === 'plus'">
          </div>
        }
      </button>
    }
  `
})
export class CalendarDayComponent {
  @Input() date!: Date;
  @Output() dayClicked = new EventEmitter<{ date: Date }>();

  isAnimating = false;
  animationLevel: string | null = null;
  private animationTimeout: any;
  private previousStatus: string | null = null;

  constructor(
    public habitService: HabitService,
    public dateService: DateService
  ) {
    effect(() => {
      const currentStatus = this.habitService.getDayStatus(this.date);

      if (this.previousStatus === null && currentStatus) {
        this.triggerAnimation(currentStatus);
      }

      this.previousStatus = currentStatus;
    });
  }

  onDayClick(): void {
    if (!this.isFutureDate()) {
      this.dayClicked.emit({ date: this.date });
    }
  }

  private triggerAnimation(level: string): void {
    this.isAnimating = true;
    this.animationLevel = level;

    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }

    const duration = this.getAnimationDuration(level);
    this.animationTimeout = setTimeout(() => {
      this.isAnimating = false;
      this.animationLevel = null;
    }, duration);
  }

  private getAnimationDuration(level: string): number {
    switch (level) {
      case 'mini': return 700;
      case 'standard': return 900;
      case 'plus': return 1300;
      default: return 900;
    }
  }

  isFutureDate(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(this.date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate > today;
  }

  isWeekend(): boolean {
    const day = this.date.getDay();
    return day === 0 || day === 6;
  }

  getMiniColor(particle: number): string {
    const miniColors = ['#10B981', '#34D399', '#6EE7B7'];
    return miniColors[particle - 1] || '#10B981';
  }

  getStandardColor(particle: number): string {
    const standardColors = ['#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE', '#1E40AF'];
    return standardColors[particle - 1] || '#3B82F6';
  }

  getPlusColor(particle: number): string {
    const plusColors = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#E879F9', '#F472B6',
      '#FBBF24', '#F59E0B', '#EF4444', '#10B981', '#06B6D4'];
    return plusColors[particle - 1] || '#8B5CF6';
  }

  getConfettiStart(seed: number): number {
    return 35 + (seed * 7) % 30;
  }
}
