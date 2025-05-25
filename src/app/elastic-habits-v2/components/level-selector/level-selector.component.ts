import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitHeaderComponent } from './habit-header/habit-header.component';
import { LevelCardsComponent } from './level-cards/level-cards.component';
import { LevelKey } from '../../models/habit.model';
import { HabitService } from '../../services/habit.service';

@Component({
  selector: 'app-level-selector',
  standalone: true,
  imports: [CommonModule, HabitHeaderComponent, LevelCardsComponent],
  styleUrl: './level-selector.component.scss',
  template: `
    <div class="level-selector-container">
      <app-habit-header />
      <app-level-cards (levelSelected)="onLevelSelected($event)" />
    </div>
  `
})
export class LevelSelectorComponent {

  constructor(private habitService: HabitService) {}

  onLevelSelected(level: LevelKey): void {
    // Aktualizuj wybrany poziom w serwisie
    this.habitService.setSelectedLevel(level);
    console.log('Selected level:', level);
  }
}
