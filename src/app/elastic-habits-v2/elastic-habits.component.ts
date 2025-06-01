import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HabitListComponent} from './components/habit-list/habit-list.component';
import {CalendarComponent} from './components/calendar/calendar.component';
import {LevelSelectorComponent} from './components/level-selector/level-selector.component';
import {LanguageSelectorComponent} from './components/language-selector.component';

@Component({
  selector: 'app-elastic-habits',
  standalone: true,
  imports: [
    CommonModule,
    CalendarComponent,
    HabitListComponent,
    LevelSelectorComponent,
    LanguageSelectorComponent,
    LanguageSelectorComponent,
  ],
  template: `
    <div class="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div class="bg-white rounded-xl shadow-lg p-6">

        <div class="flex gap-6">
          <div class="flex-shrink-0 flex flex-col items-start gap-4">
            <app-language-selector></app-language-selector>
            <app-level-selector></app-level-selector>
          </div>

          <div class="flex-1">
            <div>
              <app-habit-list></app-habit-list>
            </div>

            <div class="rounded-xl px-6">
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
