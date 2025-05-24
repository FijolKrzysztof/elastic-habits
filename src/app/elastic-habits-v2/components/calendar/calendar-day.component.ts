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

          <!-- Konfetti animacja - różne dla każdego poziomu -->
          @if (isAnimating) {
            <div class="absolute inset-0 pointer-events-none">
              @if (animationLevel === 'easy') {
                <!-- Proste konfetti dla easy -->
                @for (particle of [1,2,3]; track particle) {
                  <div class="absolute animate-confetti-easy-{{particle}} w-1 h-1 rounded-full opacity-0"
                       [style.background-color]="getEasyColor(particle)"
                       [style.left]="getConfettiStart(particle) + '%'"
                       [style.top]="getConfettiStart(particle + 2) + '%'">
                  </div>
                }
              }

              @if (animationLevel === 'standard') {
                <!-- Średnie konfetti dla standard -->
                @for (particle of [1,2,3,4,5]; track particle) {
                  <div class="absolute animate-confetti-standard-{{particle}} w-1.5 h-1.5 rounded-full opacity-0"
                       [style.background-color]="getStandardColor(particle)"
                       [style.left]="getConfettiStart(particle) + '%'"
                       [style.top]="getConfettiStart(particle + 3) + '%'">
                  </div>
                }
              }

              @if (animationLevel === 'plus') {
                <!-- Eksplozja konfetti dla plus -->
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

        <!-- Animacja tła sukcesu - różne dla każdego poziomu -->
        @if (isAnimating) {
          <div class="absolute inset-0 rounded-lg pointer-events-none"
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

    <style>
      /* EASY - Prosta animacja */
      @keyframes check-easy {
        0% {
          transform: scale(0.8);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }

      /* STANDARD - Średnia animacja z bounce */
      @keyframes check-standard {
        0% {
          transform: scale(0) rotate(-5deg);
          opacity: 0;
        }
        60% {
          transform: scale(1.2) rotate(5deg);
          opacity: 1;
        }
        100% {
          transform: scale(1) rotate(0deg);
          opacity: 1;
        }
      }

      /* PLUS - Najlepsza animacja z dramatycznym bounce */
      @keyframes check-plus {
        0% {
          transform: scale(0) rotate(-15deg);
          opacity: 0;
        }
        40% {
          transform: scale(1.4) rotate(15deg);
          opacity: 1;
        }
        65% {
          transform: scale(0.85) rotate(-5deg);
        }
        80% {
          transform: scale(1.1) rotate(2deg);
        }
        100% {
          transform: scale(1) rotate(0deg);
          opacity: 1;
        }
      }

      /* Tła animacji */
      @keyframes success-bg-easy {
        0% { opacity: 0; transform: scale(0.9); }
        50% { opacity: 0.5; transform: scale(1.05); }
        100% { opacity: 0; transform: scale(1.1); }
      }

      @keyframes success-bg-standard {
        0% { opacity: 0; transform: scale(0.8); }
        40% { opacity: 0.7; transform: scale(1.1); }
        100% { opacity: 0; transform: scale(1.2); }
      }

      @keyframes success-bg-plus {
        0% { opacity: 0; transform: scale(0.7); }
        30% { opacity: 0.9; transform: scale(1.15); }
        70% { opacity: 0.5; transform: scale(1.25); }
        100% { opacity: 0; transform: scale(1.3); }
      }

      /* Konfetti EASY - 3 cząsteczki, spokojne */
      @keyframes confetti-easy-1 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(-15px, -20px) rotate(90deg); opacity: 0; }
      }
      @keyframes confetti-easy-2 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(15px, -20px) rotate(-90deg); opacity: 0; }
      }
      @keyframes confetti-easy-3 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(0px, -25px) rotate(180deg); opacity: 0; }
      }

      /* Konfetti STANDARD - 5 cząsteczek, średnie */
      @keyframes confetti-standard-1 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(-25px, -30px) rotate(180deg); opacity: 0; }
      }
      @keyframes confetti-standard-2 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(25px, -30px) rotate(-180deg); opacity: 0; }
      }
      @keyframes confetti-standard-3 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(-20px, -35px) rotate(270deg); opacity: 0; }
      }
      @keyframes confetti-standard-4 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(20px, -35px) rotate(-270deg); opacity: 0; }
      }
      @keyframes confetti-standard-5 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(0px, -40px) rotate(360deg); opacity: 0; }
      }

      /* Konfetti PLUS - 10 cząsteczek, eksplozja! */
      @keyframes confetti-plus-1 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(-35px, -40px) rotate(270deg); opacity: 0; }
      }
      @keyframes confetti-plus-2 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(35px, -40px) rotate(-270deg); opacity: 0; }
      }
      @keyframes confetti-plus-3 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(-40px, -25px) rotate(180deg); opacity: 0; }
      }
      @keyframes confetti-plus-4 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(40px, -25px) rotate(-180deg); opacity: 0; }
      }
      @keyframes confetti-plus-5 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(-20px, -45px) rotate(450deg); opacity: 0; }
      }
      @keyframes confetti-plus-6 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(20px, -45px) rotate(-450deg); opacity: 0; }
      }
      @keyframes confetti-plus-7 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(-30px, -50px) rotate(360deg); opacity: 0; }
      }
      @keyframes confetti-plus-8 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(30px, -50px) rotate(-360deg); opacity: 0; }
      }
      @keyframes confetti-plus-9 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(-45px, -35px) rotate(540deg); opacity: 0; }
      }
      @keyframes confetti-plus-10 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
        100% { transform: translate(45px, -35px) rotate(-540deg); opacity: 0; }
      }

      /* Klasy animacji */
      .animate-check-easy {
        animation: check-easy 0.4s ease-out;
      }

      .animate-check-standard {
        animation: check-standard 0.6s cubic-bezier(0.68, -0.4, 0.32, 1.4);
      }

      .animate-check-plus {
        animation: check-plus 1s cubic-bezier(0.68, -0.6, 0.32, 1.6);
      }

      .animate-success-bg-easy {
        animation: success-bg-easy 0.5s ease-out;
      }

      .animate-success-bg-standard {
        animation: success-bg-standard 0.7s ease-out;
      }

      .animate-success-bg-plus {
        animation: success-bg-plus 1s ease-out;
      }

      /* Konfetti klasy z różnymi delay */
      .animate-confetti-easy-1 { animation: confetti-easy-1 0.6s ease-out 0.1s forwards; }
      .animate-confetti-easy-2 { animation: confetti-easy-2 0.6s ease-out 0.15s forwards; }
      .animate-confetti-easy-3 { animation: confetti-easy-3 0.6s ease-out 0.2s forwards; }

      .animate-confetti-standard-1 { animation: confetti-standard-1 0.8s ease-out 0.1s forwards; }
      .animate-confetti-standard-2 { animation: confetti-standard-2 0.8s ease-out 0.15s forwards; }
      .animate-confetti-standard-3 { animation: confetti-standard-3 0.8s ease-out 0.2s forwards; }
      .animate-confetti-standard-4 { animation: confetti-standard-4 0.8s ease-out 0.25s forwards; }
      .animate-confetti-standard-5 { animation: confetti-standard-5 0.8s ease-out 0.3s forwards; }

      .animate-confetti-plus-1 { animation: confetti-plus-1 1s ease-out 0.1s forwards; }
      .animate-confetti-plus-2 { animation: confetti-plus-2 1s ease-out 0.15s forwards; }
      .animate-confetti-plus-3 { animation: confetti-plus-3 1s ease-out 0.2s forwards; }
      .animate-confetti-plus-4 { animation: confetti-plus-4 1s ease-out 0.25s forwards; }
      .animate-confetti-plus-5 { animation: confetti-plus-5 1s ease-out 0.1s forwards; }
      .animate-confetti-plus-6 { animation: confetti-plus-6 1s ease-out 0.2s forwards; }
      .animate-confetti-plus-7 { animation: confetti-plus-7 1s ease-out 0.3s forwards; }
      .animate-confetti-plus-8 { animation: confetti-plus-8 1s ease-out 0.35s forwards; }
      .animate-confetti-plus-9 { animation: confetti-plus-9 1s ease-out 0.15s forwards; }
      .animate-confetti-plus-10 { animation: confetti-plus-10 1s ease-out 0.4s forwards; }
    </style>
  `
})
export class CalendarDayComponent {
  @Input() date!: Date;
  @Input() isAnimating = false;
  @Input() animationLevel: string | null = null;
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

  getEasyColor(particle: number): string {
    const easyColors = ['#10B981', '#34D399', '#6EE7B7']; // Zielone odcienie
    return easyColors[particle - 1] || '#10B981';
  }

  getStandardColor(particle: number): string {
    const standardColors = ['#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE', '#1E40AF']; // Niebieskie odcienie
    return standardColors[particle - 1] || '#3B82F6';
  }

  getPlusColor(particle: number): string {
    const plusColors = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#E879F9', '#F472B6', '#FBBF24', '#F59E0B', '#EF4444', '#10B981', '#06B6D4']; // Tęczowe kolory
    return plusColors[particle - 1] || '#8B5CF6';
  }

  getConfettiStart(seed: number): number {
    return 40 + (seed * 7) % 20; // Random-ish pozycje od 40% do 60%
  }
}
