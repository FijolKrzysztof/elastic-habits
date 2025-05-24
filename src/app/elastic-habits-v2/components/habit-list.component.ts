import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {HabitService} from '../services/habit.service';

@Component({
  selector: 'app-habit-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-6">
      <div class="flex items-center gap-3 mb-4">
        <h2 class="text-lg font-semibold text-gray-700">Twoje nawyki:</h2>
        <button
          (click)="showAddHabit.set(true)"
          class="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Dodaj
        </button>
      </div>

      <div class="flex flex-wrap gap-2">
        @for (habit of habitService.habits(); track habit.id) {
          <div class="flex items-center">
            <button
              (click)="habitService.setCurrentHabit(habit.id)"
              class="px-4 py-2 rounded-lg font-medium transition-all"
              [class]="habit.id === habitService.currentHabitId()
                ? 'text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              [style.background-color]="habit.id === habitService.currentHabitId() ? habit.color : ''"
            >
              {{ habit.name }}
            </button>
            @if (habitService.habits().length > 1) {
              <button
                (click)="habitService.deleteHabit(habit.id)"
                class="ml-1 p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            }
          </div>
        }
      </div>
    </div>

    @if (showAddHabit()) {
      <div class="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 class="font-medium mb-2">Dodaj nowy nawyk</h3>
        <div class="flex gap-2">
          <input
            type="text"
            [(ngModel)]="newHabitName"
            placeholder="Nazwa nawyku..."
            class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            (keyup.enter)="addHabit()"
          />
          <button
            (click)="addHabit()"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Dodaj
          </button>
          <button
            (click)="cancelAdd()"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Anuluj
          </button>
        </div>
      </div>
    }
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
