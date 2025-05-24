import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HabitService} from '../../services/habit.service';
import {DateService} from '../../services/date.service';
import {LevelEntry, LevelKey} from '../../models/habit.model';

@Component({
  selector: 'app-level-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './level-selector.component.scss',
  template: `
    <div class="level-selector-container">
      @if (habitService.currentHabit()) {
        <div class="habit-header">
          <div class="habit-badge" [style.background]="getHabitGradient()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div class="habit-info">
            <h2 class="habit-name">{{ habitService.currentHabit()?.name }}</h2>
            <p class="habit-subtitle">Wybierz intensywność treningu</p>
          </div>
        </div>
      }

      <div class="levels-grid">
        @for (level of levels; track level.key) {
          <div class="level-card"
               [class.selected]="selectedLevel() === level.key"
               [style.--level-color]="level.data.color"
               (click)="selectedLevel.set(level.key)">

            <div class="level-header">
              <div class="level-indicator">
                <div class="level-dot" [style.background-color]="level.data.color"></div>
              </div>
              <h3 class="level-title">{{ level.data.name }}</h3>
              @if (selectedLevel() === level.key) {
                <div class="selection-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
              }
            </div>

            <div class="progress-section">
              <div class="progress-info">
                <span class="progress-text">{{ getCurrentMonthName() }}</span>
                <span class="progress-value">{{ getMonthlyProgress(level.key) }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill"
                     [style.width]="getMonthlyProgress(level.key) + '%'"
                     [style.background-color]="level.data.color">
                </div>
              </div>
              <div class="progress-details">
                <span class="days-count">{{ getDaysCount(level.key) }} dni</span>
              </div>
            </div>

            <div class="description-area">
              @if (editingDescription() === habitService.currentHabitId() + '-' + level.key) {
                <div class="description-edit" (click)="$event.stopPropagation()">
                  <input
                    type="text"
                    [value]="habitService.getHabitDescription(level.key)"
                    (input)="updateDescription(level.key, $event)"
                    (blur)="editingDescription.set(null)"
                    (keyup.enter)="editingDescription.set(null)"
                    (keyup.escape)="editingDescription.set(null)"
                    class="description-input"
                    placeholder="np. 20 pompek, 10 min biegania"
                    #descInput
                  />
                </div>
              } @else {
                <div class="description-display" (click)="startEditing(level.key); $event.stopPropagation()">
                  <svg class="edit-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                  <span class="description-text">
                    {{ habitService.getHabitDescription(level.key) || 'Kliknij aby opisać...' }}
                  </span>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class LevelSelectorComponent {
  selectedLevel = signal<LevelKey>('easy');
  editingDescription = signal<string | null>(null);

  readonly habitService = inject(HabitService);
  readonly dateService = inject(DateService);

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

  getMonthlyProgress(levelKey: LevelKey): number {
    const currentDate = this.dateService.currentDate();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let daysWithLevel = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayStatus = this.habitService.getDayStatus(date);
      if (dayStatus === levelKey) {
        daysWithLevel++;
      }
    }

    return Math.round((daysWithLevel / daysInMonth) * 100);
  }

  getDaysCount(levelKey: LevelKey): number {
    const currentDate = this.dateService.currentDate();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let daysWithLevel = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayStatus = this.habitService.getDayStatus(date);
      if (dayStatus === levelKey) {
        daysWithLevel++;
      }
    }

    return daysWithLevel;
  }

  getCurrentMonthName(): string {
    const currentDate = this.dateService.currentDate();
    return this.dateService.months[currentDate.getMonth()];
  }

  getHabitGradient(): string {
    const color = this.habitService.currentHabit()?.color || '#3b82f6';
    return `linear-gradient(135deg, ${color}, ${this.adjustColor(color, -20)})`;
  }

  private adjustColor(color: string, amount: number): string {
    const usePound = color[0] === '#';
    const col = usePound ? color.slice(1) : color;
    const num = parseInt(col, 16);
    let r = (num >> 16) + amount;
    let g = (num >> 8 & 0x00FF) + amount;
    let b = (num & 0x0000FF) + amount;
    r = r > 255 ? 255 : r < 0 ? 0 : r;
    g = g > 255 ? 255 : g < 0 ? 0 : g;
    b = b > 255 ? 255 : b < 0 ? 0 : b;
    return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
  }
}
