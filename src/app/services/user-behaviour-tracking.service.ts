import { Injectable } from '@angular/core';
import { AnalyticsService } from './analytics.service';

@Injectable({
  providedIn: 'root'
})
export class UserBehaviorTrackingService {
  private pageLoadTime: number = Date.now();
  private lastMouseActivity: number = 0;
  private isTracking = false;
  private inactivityTimeout: any;
  private timeTrackingInterval: any;

  constructor(private analytics: AnalyticsService) {}

  startTracking(): void {
    if (this.isTracking) return;
    this.isTracking = true;
    this.pageLoadTime = Date.now();


    this.startTimeTracking();

    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('mousemove', this.handleMouseMove);

    this.setupInactivityTracking();

    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  stopTracking(): void {
    if (!this.isTracking) return;
    this.isTracking = false;

    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('beforeunload', this.handleBeforeUnload);

    clearInterval(this.timeTrackingInterval);
    clearTimeout(this.inactivityTimeout);
  }

  private handleVisibilityChange = (): void => {
    this.analytics.event('page_visibility_changed', {
      category: 'Engagement',
      new_state: document.hidden ? 'hidden' : 'visible',
      time_since_load: Date.now() - this.pageLoadTime
    });
  }

  private startTimeTracking(): void {
    this.timeTrackingInterval = setInterval(() => {
      this.analytics.event('time_on_page', {
        category: 'Engagement',
        duration_seconds: Math.floor((Date.now() - this.pageLoadTime) / 1000),
        is_page_visible: !document.hidden
      });
    }, 30000);
  }

  private handleScroll = (() => {
    let lastScrollPosition = 0;
    let scrollTimeout: any;

    return (event: Event) => {
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        const currentScroll = window.scrollY;
        const viewportHeight = window.innerHeight;
        const pageHeight = document.documentElement.scrollHeight;

        this.analytics.event('scroll_activity', {
          category: 'Engagement',
          scroll_position: currentScroll,
          scroll_percentage: Math.round((currentScroll + viewportHeight) / pageHeight * 100),
          scroll_direction: currentScroll > lastScrollPosition ? 'down' : 'up'
        });

        lastScrollPosition = currentScroll;
      }, 150);
    };
  })();

  private handleMouseMove = (event: MouseEvent) => {
    if (!this.lastMouseActivity || Date.now() - this.lastMouseActivity > 5000) {
      this.analytics.event('mouse_activity', {
        category: 'Engagement',
        x_position: event.clientX,
        y_position: event.clientY,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight
      });
      this.lastMouseActivity = Date.now();
    }
  }

  private setupInactivityTracking(): void {
    const INACTIVITY_THRESHOLD = 60000;

    const resetInactivityTimer = () => {
      clearTimeout(this.inactivityTimeout);
      this.inactivityTimeout = setTimeout(() => {
        this.analytics.event('user_inactive', {
          category: 'Engagement',
          time_since_load: Date.now() - this.pageLoadTime
        });
      }, INACTIVITY_THRESHOLD);
    };

    ['mousemove', 'keypress', 'scroll', 'click'].forEach(eventType => {
      window.addEventListener(eventType, resetInactivityTimer);
    });
  }

  private handleBeforeUnload = () => {
    this.analytics.event('page_exit', {
      category: 'Engagement',
      total_time_seconds: Math.floor((Date.now() - this.pageLoadTime) / 1000)
    });
  }
}
