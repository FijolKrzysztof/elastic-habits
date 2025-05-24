import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitHeaderComponent } from './habit-header/habit-header.component';
import { LevelCardsComponent } from './level-cards/level-cards.component';
import { LevelKey } from '../../models/habit.model';

@Component({
  selector: 'app-level-selector',
  standalone: true,
  imports: [CommonModule, HabitHeaderComponent, LevelCardsComponent, LevelCardsComponent],
  styleUrl: './level-selector.component.scss',
  template: `
    <div class="level-selector-container">
      <app-habit-header />
      <app-level-cards (levelSelected)="onLevelSelected($event)" />
    </div>
  `
})
export class LevelSelectorComponent {
  selectedLevel = signal<LevelKey>('easy');

  onLevelSelected(level: LevelKey): void {
    this.selectedLevel.set(level);
    // Tutaj możesz dodać dodatkową logikę, np. powiadomienie innych komponentów
    console.log('Selected level:', level);
  }

  getSelectedLevel(): LevelKey {
    return this.selectedLevel();
  }
}
