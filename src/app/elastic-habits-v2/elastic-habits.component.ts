import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HabitListComponent} from './components/habit-list.component';
import {CalendarComponent} from './components/calendar.component';

@Component({
  selector: 'app-elastic-habits',
  standalone: true,
  imports: [
    CommonModule,
    CalendarComponent,
    HabitListComponent,
  ],
  template: `
    <div class="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Elastic Habits</h1>
          <p class="text-gray-600">Elastyczne podejście do budowania nawyków</p>
        </div>

        <app-habit-list></app-habit-list>

        <div class="bg-gray-50 rounded-xl p-6">
          <app-calendar></app-calendar>
        </div>
      </div>
    </div>
  `
})
export class ElasticHabitsComponent {
}
