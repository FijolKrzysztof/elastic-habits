import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitService } from '../../../services/habit.service';

@Component({
  selector: 'app-habit-header',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './habit-header.component.scss',
  template: `
    @if (habitService.currentHabit()) {
      <div class="habit-header">
        <div class="habit-badge" [style.background]="getHabitGradient()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div class="habit-info">
          <h2 class="habit-name">{{ habitService.currentHabit()?.name }}</h2>
          <p class="habit-subtitle">{{ getHabitSubtitle() }}</p>
        </div>
      </div>
    }
  `
})
export class HabitHeaderComponent {
  readonly habitService = inject(HabitService);

  getHabitGradient(): string {
    const color = this.habitService.currentHabit()?.color || '#3b82f6';
    return `linear-gradient(135deg, ${color}, ${this.adjustColor(color, -20)})`;
  }

  getHabitSubtitle(): string {
    const currentHabit = this.habitService.currentHabit();
    if (!currentHabit) return '';

    return this.habitService.getHabitGeneralDescription() || 'Rozwijaj swój nawyk';
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
