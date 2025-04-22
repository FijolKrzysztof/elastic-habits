import {Component} from '@angular/core';
import {ElasticHabitsComponent} from './elastic-habits/elastic-habits.component';

@Component({
  selector: 'app-root',
  imports: [ElasticHabitsComponent],
  template: `
    <app-elastic-habits></app-elastic-habits>`,
  standalone: true
})
export class AppComponent {
}
