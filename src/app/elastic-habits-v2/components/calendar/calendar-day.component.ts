import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitService } from '../../services/habit.service';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'app-calendar-day',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (date) {
      <button
        (click)="onDayClick()"
        [disabled]="isFutureDate()"
        class="w-full h-full rounded-lg font-medium transition-all border-2 border-gray-300 hover:border-gray-400 flex flex-col bg-white hover:bg-gray-50 text-gray-700 shadow-sm relative overflow-hidden"
        [class.border-blue-500]="dateService.isToday(date)"
        [class.border-4]="dateService.isToday(date)"
        [class.opacity-50]="isFutureDate()"
        [class.cursor-not-allowed]="isFutureDate()"
        [class.hover:bg-white]="isFutureDate()"
        [class.hover:border-gray-300]="isFutureDate()"
      >
        <div class="flex-none pt-1">
          <span class="text-sm">{{ date.getDate() }}</span>
        </div>

        <div class="flex-1 flex items-center justify-center relative">
          @if (habitService.getDayStatus(date)) {
            <svg
              class="w-13 h-13 transition-all duration-200"
              [class.animate-check-pop]="isAnimating"
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
          @if (isAnimating) {
            <div class="absolute inset-0 pointer-events-none">
              @for (particle of [1,2,3,4,5,6,7,8]; track particle) {
                <div class="absolute animate-confetti-{{particle}} w-1 h-1 rounded-full opacity-0"
                     [style.background-color]="getConfettiColor(particle)"
                     [style.left]="getConfettiStart(particle) + '%'"
                     [style.top]="getConfettiStart(particle + 3) + '%'">
                </div>
              }
            </div>
          }
        </div>

        <!-- Animacja tła sukcesu -->
        @if (isAnimating) {
          <div class="absolute inset-0 bg-gradient-to-br from-green-200 to-emerald-200 rounded-lg animate-success-bg pointer-events-none"></div>
        }
      </button>
    }

    <style>
      @keyframes check-pop {
        0% {
          transform: scale(0) rotate(-12deg);
          opacity: 0;
        }
        50% {
          transform: scale(1.3) rotate(12deg);
          opacity: 1;
        }
        70% {
          transform: scale(0.9) rotate(-3deg);
        }
        100% {
          transform: scale(1) rotate(0deg);
          opacity: 1;
        }
      }

      @keyframes success-bg {
        0% {
          opacity: 0;
          transform: scale(0.8);
        }
        30% {
          opacity: 0.8;
          transform: scale(1.1);
        }
        100% {
          opacity: 0;
          transform: scale(1.2);
        }
      }

      /* Konfetti animacje */
      @keyframes confetti-1 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(-20px, -30px) rotate(180deg); opacity: 0; }
      }
      @keyframes confetti-2 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(25px, -35px) rotate(-180deg); opacity: 0; }
      }
      @keyframes confetti-3 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(-30px, -20px) rotate(270deg); opacity: 0; }
      }
      @keyframes confetti-4 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(35px, -25px) rotate(-90deg); opacity: 0; }
      }
      @keyframes confetti-5 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(-15px, -40px) rotate(360deg); opacity: 0; }
      }
      @keyframes confetti-6 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(20px, -30px) rotate(-270deg); opacity: 0; }
      }
      @keyframes confetti-7 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(-25px, -35px) rotate(450deg); opacity: 0; }
      }
      @keyframes confetti-8 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(30px, -20px) rotate(-360deg); opacity: 0; }
      }

      .animate-check-pop {
        animation: check-pop 0.8s cubic-bezier(0.68, -0.6, 0.32, 1.6);
      }

      .animate-success-bg {
        animation: success-bg 0.8s ease-out;
      }

      .animate-confetti-1 { animation: confetti-1 0.8s ease-out 0.1s forwards; }
      .animate-confetti-2 { animation: confetti-2 0.8s ease-out 0.15s forwards; }
      .animate-confetti-3 { animation: confetti-3 0.8s ease-out 0.2s forwards; }
      .animate-confetti-4 { animation: confetti-4 0.8s ease-out 0.25s forwards; }
      .animate-confetti-5 { animation: confetti-5 0.8s ease-out 0.1s forwards; }
      .animate-confetti-6 { animation: confetti-6 0.8s ease-out 0.2s forwards; }
      .animate-confetti-7 { animation: confetti-7 0.8s ease-out 0.15s forwards; }
      .animate-confetti-8 { animation: confetti-8 0.8s ease-out 0.3s forwards; }
    </style>
  `
})
export class CalendarDayComponent {
  @Input() date!: Date;
  @Input() isAnimating = false;
  @Output() dayClicked = new EventEmitter<Date>();

  constructor(
    public habitService: HabitService,
    public dateService: DateService
  ) {}

  onDayClick(): void {
    if (!this.isFutureDate()) {
      this.dayClicked.emit(this.date);
    }
  }

  isFutureDate(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(this.date);
    checkDate.setHours(0, 0, 0, 0);

    return checkDate > today;
  }

  getConfettiColor(particle: number): string {
    const colors = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899'];
    return colors[particle - 1] || '#10B981';
  }

  getConfettiStart(seed: number): number {
    return 40 + (seed * 7) % 20; // Random-ish pozycje od 40% do 60%
  }
}
