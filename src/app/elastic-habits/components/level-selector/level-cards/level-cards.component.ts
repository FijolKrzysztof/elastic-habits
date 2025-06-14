import {afterNextRender, Component, inject, output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HabitService} from '../../../services/habit.service';
import {DateService} from '../../../services/date.service';
import {LevelEntry, LevelKey} from '../../../models/habit.model';

@Component({
  selector: 'app-level-cards',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './level-cards.component.scss',
  template: `
    <div class="levels-grid">
      @for (level of levels; track level.key; let i = $index) {
        <div class="level-card"
             [class.selected]="selectedLevel() === level.key"
             [style.--level-color]="level.data.color"
             [style.animation-delay]="(i * 0.1) + 's'"
             (click)="selectLevel(level.key)">

          <div class="level-header">
            <div class="level-indicator">
              <div class="level-dot" [style.background-color]="level.data.color"></div>
            </div>
            <h3 class="level-title">{{ level.data.name }}</h3>
          </div>

          <div class="progress-section">
            <div class="progress-info">
              <span class="progress-text">{{ dateService.getCurrentMonthName() }}</span>
              <span class="progress-value">{{ getMonthlyProgress(level.key) }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill"
                   [style.--target-width]="getMonthlyProgress(level.key) + '%'"
                   [style.background-color]="level.data.color"
                   [attr.data-progress]="getMonthlyProgress(level.key)">
              </div>
            </div>
            <div class="progress-details">
              <span class="days-count">{{ getDaysCount(level.key) }} dni</span>
            </div>
          </div>

          <div class="target-area">
            @if (editingTarget() === habitService.currentHabitId() + '-' + level.key) {
              <div class="target-edit" (click)="$event.stopPropagation()">
                <input
                  type="text"
                  [value]="habitService.getHabitTarget(level.key)"
                  (input)="updateTarget(level.key, $event)"
                  (blur)="editingTarget.set(null)"
                  (keyup.enter)="editingTarget.set(null)"
                  (keyup.escape)="editingTarget.set(null)"
                  class="target-input"
                  placeholder="np. 20 pompek, 10 min biegania"
                  #descInput
                />
              </div>
            } @else {
              <div class="target-display" (click)="startEditing(level.key); $event.stopPropagation()">
                <span class="target-text">
                  {{ habitService.getHabitTarget(level.key) || (selectedLevel() === level.key ? 'Kliknij aby opisać...' : 'Wybierz aby edytować...') }}
                </span>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class LevelCardsComponent {
  selectedLevel = signal<LevelKey>('mini');
  editingTarget = signal<string | null>(null);

  levelSelected = output<LevelKey>();

  readonly habitService = inject(HabitService);
  readonly dateService = inject(DateService);

  levels: LevelEntry[] = Object.entries(this.habitService.levels).map(([key, data]) => ({
    key: key as LevelKey,
    data
  }));

  constructor() {
    afterNextRender(() => {
      setTimeout(() => {
        this.animateProgressBars();
      }, 100);
    });
  }

  selectLevel(level: LevelKey): void {
    this.selectedLevel.set(level);
    this.levelSelected.emit(level);
  }

  startEditing(level: string): void {
    if (this.selectedLevel() !== level) {
      this.selectLevel(level as LevelKey);
      return;
    }

    this.editingTarget.set(`${this.habitService.currentHabitId()}-${level}`);
  }

  updateTarget(level: LevelKey, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.habitService.updateHabitTarget(level, target.value);
  }

  private animateProgressBars(): void {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach((bar, index) => {
      const progressElement = bar as HTMLElement;
      const targetWidth = progressElement.getAttribute('data-progress');

      setTimeout(() => {
        progressElement.style.width = targetWidth + '%';
      }, index * 200);
    });
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
}
