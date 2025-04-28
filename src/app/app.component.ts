import {Component, OnDestroy, OnInit} from '@angular/core';
import {ElasticHabitsComponent} from './elastic-habits/elastic-habits.component';
import {UserBehaviorTrackingService} from './services/user-behaviour-tracking.service';
import {PerformanceTrackingService} from './services/performance-tracking.service';

@Component({
  selector: 'app-root',
  imports: [ElasticHabitsComponent],
  template: `
    <app-elastic-habits></app-elastic-habits>`,
  standalone: true
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private performanceTracking: PerformanceTrackingService,
    private behaviorTracking: UserBehaviorTrackingService
  ) {}

  ngOnInit() {
    this.performanceTracking.startTracking();
    this.behaviorTracking.startTracking();
  }

  ngOnDestroy() {
    this.performanceTracking.stopTracking();
    this.behaviorTracking.stopTracking();
  }
}
