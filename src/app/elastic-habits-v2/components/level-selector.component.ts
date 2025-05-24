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
    <div class="level-selector-container">
      @if (habitService.currentHabit()) {
        <div class="habit-header">
          <div class="habit-icon" [style.background-color]="habitService.currentHabit()?.color">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div class="habit-info">
            <h2 class="habit-name" [style.color]="habitService.currentHabit()?.color">
              {{ habitService.currentHabit()?.name }}
            </h2>
            <p class="habit-subtitle">Wybierz poziom aktywności</p>
          </div>
        </div>
      }

      <div class="levels-container">
        @for (level of levels; track level.key) {
          <div class="level-card"
               [class.selected]="selectedLevel() === level.key"
               [class.level-easy]="level.key === 'easy'"
               [class.level-standard]="level.key === 'standard'"
               [class.level-plus]="level.key === 'plus'">

            <button
              (click)="selectedLevel.set(level.key)"
              class="level-button"
              [style.border-color]="level.data.color"
              [style.color]="selectedLevel() === level.key ? '#fff' : level.data.color"
              [style.background-color]="selectedLevel() === level.key ? level.data.color : 'transparent'"
            >
              <!-- Level Content -->
              <div class="level-content">
                <div class="level-header">
                  <span class="level-name">{{ level.data.name }}</span>
                  @if (selectedLevel() === level.key) {
                    <div class="selected-indicator">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                  }
                </div>

                <!-- Progress Bar -->
                <div class="progress-container">
                  <div class="progress-track">
                    <div class="progress-fill"
                         [style.width]="getMonthlyProgress(level.key) + '%'"
                         [style.background-color]="selectedLevel() === level.key ? '#fff' : level.data.color">
                    </div>
                  </div>
                  <span class="progress-label">{{ getMonthlyProgress(level.key) }}%</span>
                </div>
              </div>
            </button>

            <!-- Description Section -->
            <div class="description-section">
              @if (editingDescription() === habitService.currentHabitId() + '-' + level.key) {
                <div class="description-input-container">
                  <input
                    type="text"
                    [value]="habitService.getHabitDescription(level.key)"
                    (input)="updateDescription(level.key, $event)"
                    (blur)="editingDescription.set(null)"
                    (keyup.enter)="editingDescription.set(null)"
                    class="description-input"
                    placeholder="np. 10 minut joggingu"
                    #descInput
                  />
                  <button
                    (click)="editingDescription.set(null)"
                    class="input-confirm-btn"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </button>
                </div>
              } @else {
                <button
                  (click)="startEditing(level.key)"
                  class="description-button"
                  [style.border-color]="level.data.color + '40'"
                >
                  <div class="description-content">
                    <svg class="description-icon" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                    <span class="description-text">
                      {{ habitService.getHabitDescription(level.key) || 'Dodaj opis aktywności...' }}
                    </span>
                  </div>
                </button>
              }
            </div>
          </div>
        }
      </div>

      <!-- Summary Card -->
      <div class="summary-card">
        <div class="summary-header">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
          </svg>
          <span>Aktualny wybór</span>
        </div>
        <div class="summary-content">
          <div class="selected-level-display" [style.color]="getCurrentLevelData().color">
            {{ getCurrentLevelData().name }}
          </div>
          @if (habitService.getHabitDescription(selectedLevel())) {
            <div class="selected-description">
              {{ habitService.getHabitDescription(selectedLevel()) }}
            </div>
          }
        </div>
      </div>
    </div>

    <style>
      .level-selector-container {
        width: 320px;
        background: #ffffff;
        border-radius: 20px;
        padding: 24px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 20px rgba(0, 0, 0, 0.05);
        border: 1px solid #f1f5f9;
      }

      .habit-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 24px;
        padding-bottom: 20px;
        border-bottom: 2px solid #f1f5f9;
      }

      .habit-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .habit-info {
        flex: 1;
      }

      .habit-name {
        font-size: 1.25rem;
        font-weight: 700;
        margin: 0 0 4px 0;
        line-height: 1.2;
      }

      .habit-subtitle {
        font-size: 0.875rem;
        color: #64748b;
        margin: 0;
        font-weight: 500;
      }

      .levels-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 24px;
      }

      .level-card {
        border-radius: 16px;
        background: #fafbfc;
        border: 2px solid transparent;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
      }

      .level-card.selected {
        transform: translateY(-2px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.05);
        background: #ffffff;
      }

      .level-card.level-easy.selected {
        border-color: #10b981;
        box-shadow: 0 12px 24px rgba(16, 185, 129, 0.2), 0 4px 8px rgba(16, 185, 129, 0.1);
      }

      .level-card.level-standard.selected {
        border-color: #3b82f6;
        box-shadow: 0 12px 24px rgba(59, 130, 246, 0.2), 0 4px 8px rgba(59, 130, 246, 0.1);
      }

      .level-card.level-plus.selected {
        border-color: #ef4444;
        box-shadow: 0 12px 24px rgba(239, 68, 68, 0.2), 0 4px 8px rgba(239, 68, 68, 0.1);
      }

      .level-button {
        width: 100%;
        border: 2px solid;
        background: transparent;
        border-radius: 14px;
        padding: 16px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
      }

      .level-button:hover {
        transform: translateY(-1px);
      }

      .level-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 0 16px;
      }

      .level-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .level-name {
        font-weight: 700;
        font-size: 1rem;
        letter-spacing: -0.025em;
      }

      .selected-indicator {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: currentColor;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }

      .progress-container {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .progress-track {
        flex: 1;
        height: 6px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 3px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        border-radius: 3px;
        transition: width 0.3s ease;
      }

      .progress-label {
        font-size: 0.75rem;
        font-weight: 600;
        opacity: 0.8;
      }

      .description-section {
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.7);
        margin-top: 8px;
      }

      .description-input-container {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .description-input {
        flex: 1;
        padding: 8px 12px;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        font-size: 0.875rem;
        transition: border-color 0.2s;
        background: white;
      }

      .description-input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .input-confirm-btn {
        width: 32px;
        height: 32px;
        border: none;
        background: #10b981;
        color: white;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
      }

      .input-confirm-btn:hover {
        background: #059669;
      }

      .description-button {
        width: 100%;
        border: 1px dashed;
        background: transparent;
        border-radius: 8px;
        padding: 12px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .description-button:hover {
        background: rgba(255, 255, 255, 0.8);
      }

      .description-content {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .description-icon {
        width: 16px;
        height: 16px;
        color: #64748b;
      }

      .description-text {
        font-size: 0.875rem;
        color: #64748b;
        text-align: left;
        font-style: italic;
      }

      .summary-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 16px;
        padding: 20px;
        color: white;
      }

      .summary-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        font-weight: 600;
        font-size: 0.875rem;
        opacity: 0.9;
      }

      .summary-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .selected-level-display {
        font-size: 1.125rem;
        font-weight: 700;
        color: white !important;
      }

      .selected-description {
        font-size: 0.875rem;
        opacity: 0.8;
        font-style: italic;
      }

      /* Responsive improvements */
      @media (max-width: 768px) {
        .level-selector-container {
          width: 100%;
          max-width: 320px;
        }
      }

      /* Animation for level transitions */
      .level-card {
        animation: slideInUp 0.3s ease-out;
      }

      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Accessibility improvements */
      .level-button:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }

      .description-button:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }
    </style>
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

  getMonthlyProgress(levelKey: LevelKey): number {
    // Pobierz wszystkie dni z bieżącego miesiąca
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Policz dni w miesiącu
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Policz dni oznaczone danym poziomem
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

  getCurrentLevelData() {
    const currentLevel = this.levels.find(level => level.key === this.selectedLevel());
    return currentLevel?.data || this.levels[0].data;
  }
}
