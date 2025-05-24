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
          <div class="habit-badge" [style.background]="getHabitGradient()">
            <span class="habit-initial">{{ getHabitInitial() }}</span>
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
                <span class="progress-text">Ten miesiąc</span>
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
                <div class="description-edit">
                  <input
                    type="text"
                    [value]="habitService.getHabitDescription(level.key)"
                    (input)="updateDescription(level.key, $event)"
                    (blur)="editingDescription.set(null)"
                    (keyup.enter)="editingDescription.set(null)"
                    class="description-input"
                    placeholder="np. 20 pompek, 10 min biegania"
                    #descInput
                  />
                </div>
              } @else {
                <div class="description-display" (click)="startEditing(level.key)">
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

    <style>
      .level-selector-container {
        width: 100%;
        max-width: 380px;
        background: linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%);
        border-radius: 24px;
        padding: 28px;
        box-shadow:
          0 25px 50px -12px rgba(0, 0, 0, 0.08),
          0 8px 16px -4px rgba(0, 0, 0, 0.03),
          inset 0 1px 0 rgba(255, 255, 255, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
      }

      .habit-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 32px;
        padding: 20px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
      }

      .habit-badge {
        width: 52px;
        height: 52px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: 1.25rem;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        position: relative;
      }

      .habit-badge::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 16px;
        background: linear-gradient(145deg, rgba(255,255,255,0.2), transparent);
      }

      .habit-initial {
        position: relative;
        z-index: 1;
      }

      .habit-info {
        flex: 1;
      }

      .habit-name {
        font-size: 1.375rem;
        font-weight: 800;
        margin: 0 0 4px 0;
        background: linear-gradient(135deg, #1e293b, #475569);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .habit-subtitle {
        font-size: 0.875rem;
        color: #64748b;
        margin: 0;
        font-weight: 500;
      }

      .levels-grid {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .level-card {
        background: rgba(255, 255, 255, 0.9);
        border: 2px solid transparent;
        border-radius: 20px;
        padding: 24px;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      }

      .level-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: var(--level-color);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .level-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
        background: rgba(255, 255, 255, 1);
      }

      .level-card:hover::before {
        opacity: 1;
      }

      .level-card.selected {
        border-color: var(--level-color);
        transform: translateY(-2px);
        box-shadow:
          0 20px 60px rgba(0, 0, 0, 0.15),
          0 0 0 1px var(--level-color);
        background: rgba(255, 255, 255, 1);
      }

      .level-card.selected::before {
        opacity: 1;
        height: 100%;
        background: linear-gradient(135deg, var(--level-color), transparent);
        opacity: 0.03;
      }

      .level-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;
      }

      .level-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .level-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }

      .level-title {
        flex: 1;
        font-size: 1.125rem;
        font-weight: 700;
        margin: 0;
        color: #1e293b;
        letter-spacing: -0.025em;
      }

      .selection-badge {
        width: 28px;
        height: 28px;
        background: var(--level-color);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .progress-section {
        margin-bottom: 20px;
      }

      .progress-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .progress-text {
        font-size: 0.875rem;
        color: #64748b;
        font-weight: 500;
      }

      .progress-value {
        font-size: 0.875rem;
        font-weight: 700;
        color: #1e293b;
      }

      .progress-bar {
        height: 8px;
        background: #e2e8f0;
        border-radius: 6px;
        overflow: hidden;
        margin-bottom: 8px;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
      }

      .progress-fill {
        height: 100%;
        border-radius: 6px;
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }

      .progress-fill::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        animation: shimmer 2s infinite;
      }

      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }

      .progress-details {
        display: flex;
        justify-content: flex-end;
      }

      .days-count {
        font-size: 0.75rem;
        color: #64748b;
        font-weight: 600;
      }

      .description-area {
        border-top: 1px solid #f1f5f9;
        padding-top: 16px;
      }

      .description-edit {
        display: flex;
        align-items: center;
      }

      .description-input {
        flex: 1;
        padding: 12px 16px;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        font-size: 0.875rem;
        transition: all 0.3s ease;
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
      }

      .description-input:focus {
        outline: none;
        border-color: var(--level-color, #3b82f6);
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        transform: scale(1.02);
      }

      .description-display {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        border: 2px dashed #d1d5db;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        background: rgba(249, 250, 251, 0.8);
      }

      .description-display:hover {
        border-color: var(--level-color);
        background: rgba(255, 255, 255, 0.9);
        transform: translateY(-1px);
      }

      .edit-icon {
        color: #9ca3af;
        transition: color 0.2s ease;
      }

      .description-display:hover .edit-icon {
        color: var(--level-color);
      }

      .description-text {
        font-size: 0.875rem;
        color: #6b7280;
        font-style: italic;
        transition: color 0.2s ease;
      }

      .description-display:hover .description-text {
        color: #374151;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .level-selector-container {
          max-width: 100%;
          padding: 20px;
        }

        .habit-header {
          padding: 16px;
        }

        .level-card {
          padding: 20px;
        }
      }

      /* Animation for cards */
      .level-card {
        animation: slideInUp 0.5s ease-out backwards;
      }

      .level-card:nth-child(1) { animation-delay: 0.1s; }
      .level-card:nth-child(2) { animation-delay: 0.2s; }
      .level-card:nth-child(3) { animation-delay: 0.3s; }

      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Focus states for accessibility */
      .level-card:focus {
        outline: 2px solid var(--level-color);
        outline-offset: 2px;
      }

      .description-input:focus,
      .description-display:focus {
        outline: 2px solid var(--level-color);
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
    const currentDate = new Date();
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
    const currentDate = new Date();
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

  getHabitInitial(): string {
    const habitName = this.habitService.currentHabit()?.name || '';
    return habitName.charAt(0).toUpperCase();
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
