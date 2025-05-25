import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HabitListComponent} from './components/habit-list.component';
import {CalendarComponent} from './components/calendar/calendar.component';
import {LevelSelectorComponent} from './components/level-selector/level-selector.component';

@Component({
  selector: 'app-elastic-habits',
  standalone: true,
  imports: [
    CommonModule,
    CalendarComponent,
    HabitListComponent,
    LevelSelectorComponent,
  ],
  template: `
    <div class="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Elastic Habits</h1>
          <p class="text-gray-600">Elastyczne podejście do budowania nawyków</p>
        </div>

        <!-- Nowy layout: Level Selector po lewej, HabitList i Calendar po prawej -->
        <div class="flex gap-6">
          <!-- Lewa strona: Level Selector -->
          <div class="flex-shrink-0">
            <app-level-selector></app-level-selector>
          </div>

          <!-- Prawa strona: Habit List i Calendar -->
          <div class="flex-1 space-y-6">
            <!-- Habit List na górze -->
            <div>
              <app-habit-list></app-habit-list>
            </div>

            <!-- Calendar na dole -->
            <div class="rounded-xl p-6">
              <app-calendar></app-calendar>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ElasticHabitsComponent {
}
