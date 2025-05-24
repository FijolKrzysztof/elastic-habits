import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HabitService} from '../services/habit.service';
import {LevelEntry, LevelKey} from '../models/habit.model';

@Component({
  selector: 'app-level-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="w-64 space-y-4">
      <h3 class="font-semibold text-gray-700 mb-4">Poziomy wykonania:</h3>
      @for (level of levels; track level.key) {
        <div class="space-y-2">
          <button
            (click)="selectedLevel.set(level.key)"
            class="w-full px-4 py-3 rounded-lg font-semibold transition-all border-2 text-left hover:border-gray-300"
            [class]="selectedLevel() === level.key
              ? 'border-gray-400 bg-gray-50'
              : 'border-gray-200 hover:bg-gray-50'"
            [style.color]="level.data.color"
          >
            <div class="flex items-center justify-between">
              <span class="font-semibold">{{ level.data.name }}</span>
              @if (selectedLevel() === level.key) {
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              }
            </div>
          </button>

          <div class="pl-2">
            @if (editingDescription() === habitService.currentHabitId() + '-' + level.key) {
              <input
                type="text"
                [value]="habitService.getHabitDescription(level.key)"
                (input)="updateDescription(level.key, $event)"
                (blur)="editingDescription.set(null)"
                (keyup.enter)="editingDescription.set(null)"
                class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="np. 5 min biegania"
                #descInput
              />
            } @else {
              <button
                (click)="startEditing(level.key)"
                class="w-full text-left px-2 py-1 text-sm text-gray-600 hover:bg-white hover:text-gray-800 rounded transition-colors"
              >
                {{ habitService.getHabitDescription(level.key) || 'Kliknij aby dodać opis...' }}
              </button>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class LevelSelectorComponent {
  selectedLevel = signal<LevelKey>('easy');
  editingDescription = signal<string | null>(null);

  readonly habitService = inject(HabitService);

  levels: LevelEntry[] = Object.entries(this.habitService.levels).map(([key, data]) => ({
    key: key as LevelKey,
    data
  }));

  startEditing(level: string): void {
    this.editingDescription.set(`${this.habitService.currentHabitId()}-${level}`);
  }

  updateDescription(level: LevelKey, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.habitService.updateHabitDescription(level, target.value);
  }

  getSelectedLevel(): LevelKey {
    return this.selectedLevel();
  }
}
