import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitService } from '../../../services/habit.service';
import { DateService } from '../../../services/date.service';

@Component({
  selector: 'app-calendar-day',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./calendar-day.component.scss'], // Oddzielny plik CSS
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
              [class.animate-check-easy]="isAnimating && animationLevel === 'easy'"
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

          <!-- Konfetti animacja -->
          @if (isAnimating && animationLevel) {
            <div class="absolute inset-0 pointer-events-none">
              @if (animationLevel === 'easy') {
                @for (particle of [1,2,3]; track particle) {
                  <div class="absolute animate-confetti-easy-{{particle}} w-1 h-1 rounded-full opacity-0"
                       [style.background-color]="getEasyColor(particle)"
                       [style.left]="getConfettiStart(particle) + '%'"
                       [style.top]="getConfettiStart(particle + 2) + '%'">
                  </div>
                }
              }

              @if (animationLevel === 'standard') {
                @for (particle of [1,2,3,4,5]; track particle) {
                  <div class="absolute animate-confetti-standard-{{particle}} w-1.5 h-1.5 rounded-full opacity-0"
                       [style.background-color]="getStandardColor(particle)"
                       [style.left]="getConfettiStart(particle) + '%'"
                       [style.top]="getConfettiStart(particle + 3) + '%'">
                  </div>
                }
              }

              @if (animationLevel === 'plus') {
                @for (particle of [1,2,3,4,5,6,7,8,9,10]; track particle) {
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

        <!-- Animacja tła sukcesu -->
        @if (isAnimating && animationLevel) {
          <div class="absolute inset-0 pointer-events-none opacity-0"
               [class.bg-gradient-to-br]="true"
               [class.from-green-100]="animationLevel === 'easy'"
               [class.to-green-200]="animationLevel === 'easy'"
               [class.from-blue-200]="animationLevel === 'standard'"
               [class.to-indigo-200]="animationLevel === 'standard'"
               [class.from-purple-200]="animationLevel === 'plus'"
               [class.to-pink-200]="animationLevel === 'plus'"
               [class.animate-success-bg-easy]="animationLevel === 'easy'"
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
  @Output() dayClicked = new EventEmitter<{ date: Date; selectedLevel: string }>();

  // Lokalna logika animacji
  isAnimating = false;
  animationLevel: string | null = null;
  private animationTimeout: any;

  constructor(
    public habitService: HabitService,
    public dateService: DateService
  ) {}

  onDayClick(): void {
    if (!this.isFutureDate()) {
      // Emituj event z datą, parent component określi level
      this.dayClicked.emit({ date: this.date, selectedLevel: '' });
    }
  }

  // Publiczna metoda do uruchomienia animacji
  triggerAnimation(level: string): void {
    // Sprawdź czy dodajemy nowy status (nie usuwamy)
    const currentStatus = this.habitService.getDayStatus(this.date);
    if (!currentStatus && level) {
      this.isAnimating = true;
      this.animationLevel = level;

      // Wyczyść poprzedni timeout jeśli istnieje
      if (this.animationTimeout) {
        clearTimeout(this.animationTimeout);
      }

      // Ustaw timeout na zakończenie animacji
      const duration = this.getAnimationDuration(level);
      this.animationTimeout = setTimeout(() => {
        this.isAnimating = false;
        this.animationLevel = null;
      }, duration);
    }
  }

  private getAnimationDuration(level: string): number {
    switch (level) {
      case 'easy': return 700;      // 0.7s
      case 'standard': return 900;  // 0.9s
      case 'plus': return 1300;     // 1.3s
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
    return day === 0 || day === 6; // Niedziela lub sobota
  }

  getEasyColor(particle: number): string {
    const easyColors = ['#10B981', '#34D399', '#6EE7B7'];
    return easyColors[particle - 1] || '#10B981';
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
    return 35 + (seed * 7) % 30; // Pozycje od 35% do 65%
  }
}
