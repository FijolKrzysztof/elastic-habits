import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {HabitService} from '../services/habit.service';

@Component({
  selector: 'app-habit-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-6">
        <h2 class="text-xl font-semibold text-gray-800">Twoje nawyki:</h2>
        <button
          (click)="showAddHabit.set(true)"
          class="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Dodaj metkę
        </button>
      </div>

      <!-- Sznurek z metkami -->
      <div class="relative">
        <!-- Sznurek -->
        <div class="absolute top-4 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 shadow-sm"></div>
        <div class="absolute top-3.5 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-900/20 via-transparent to-amber-900/20"></div>

        <!-- Metki -->
        <div class="flex flex-wrap gap-6 pt-2 pb-4">
          @for (habit of habitService.habits(); track habit.id) {
            <div class="relative group">
              <!-- Nitka łącząca metkę ze sznurkiem -->
              <div class="absolute top-0 left-1/2 transform -translate-x-px w-0.5 h-6 bg-gradient-to-b from-amber-800 to-amber-600"></div>

              <!-- Metka -->
              <div class="relative mt-6">
                <button
                  (click)="habitService.setCurrentHabit(habit.id)"
                  class="relative px-4 py-3 font-medium transition-all duration-300 transform group-hover:-translate-y-1 group-hover:rotate-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  [class]="habit.id === habitService.currentHabitId()
                    ? 'text-white shadow-lg scale-105'
                    : 'text-gray-700 hover:text-gray-900'"
                  [style.background-color]="habit.color"
                  style="
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%, 8px 50%);
                    box-shadow:
                      0 4px 8px rgba(0,0,0,0.15),
                      inset 0 1px 0 rgba(255,255,255,0.2),
                      inset 0 -1px 0 rgba(0,0,0,0.1);
                  "
                >
                  <!-- Dziurka w metce -->
                  <div class="absolute left-2 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-white/30 rounded-full border border-black/10"></div>

                  <!-- Tekst nawyku -->
                  <span class="relative z-10 ml-3 text-sm font-medium drop-shadow-sm">
                    {{ habit.name }}
                  </span>

                  <!-- Efekt papieru - tekstura -->
                  <div class="absolute inset-0 opacity-20 bg-gradient-to-br from-transparent via-white/10 to-transparent pointer-events-none"
                       style="clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%, 8px 50%);">
                  </div>
                </button>

                <!-- Przycisk usuwania -->
                @if (habitService.habits().length > 1) {
                  <button
                    (click)="habitService.deleteHabit(habit.id)"
                    class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-110 flex items-center justify-center group z-20"
                    title="Usuń nawyk"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                }

                <!-- Cień metki -->
                <div class="absolute inset-0 mt-1 ml-1 bg-black/10 rounded-sm transform -z-10"
                     style="clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%, 8px 50%);">
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>

    @if (showAddHabit()) {
      <div class="mb-6 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 shadow-md">
        <h3 class="font-semibold mb-4 text-amber-800 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
          Dodaj nową metkę
        </h3>
        <div class="flex gap-3">
          <input
            type="text"
            [(ngModel)]="newHabitName"
            placeholder="Nazwa nawyku..."
            class="flex-1 px-4 py-3 border-2 border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
            (keyup.enter)="addHabit()"
          />
          <button
            (click)="addHabit()"
            class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
          >
            Dodaj
          </button>
          <button
            (click)="cancelAdd()"
            class="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
          >
            Anuluj
          </button>
        </div>
      </div>
    }

    <style>
      @keyframes sway {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-2px) rotate(1deg); }
      }

      .group:hover .relative {
        animation: sway 2s ease-in-out infinite;
      }

      /* Dodatkowe efekty dla metki */
      button[style*="clip-path"]:hover {
        filter: brightness(1.05) saturate(1.1);
      }

      button[style*="clip-path"]:active {
        transform: scale(0.98);
      }
    </style>
  `
})
export class HabitListComponent {
  showAddHabit = signal(false);
  newHabitName = '';

  constructor(public habitService: HabitService) {}

  addHabit(): void {
    if (this.newHabitName.trim()) {
      this.habitService.addHabit(this.newHabitName);
      this.newHabitName = '';
      this.showAddHabit.set(false);
    }
  }

  cancelAdd(): void {
    this.newHabitName = '';
    this.showAddHabit.set(false);
  }
}
