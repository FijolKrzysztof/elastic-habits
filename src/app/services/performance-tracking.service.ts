import { Injectable } from '@angular/core';
import { AnalyticsService } from './analytics.service';

@Injectable({
  providedIn: 'root'
})
export class PerformanceTrackingService {
  private isTracking = false;
  private performanceObserver: PerformanceObserver | null = null;
  private navigationObserver: PerformanceObserver | null = null;
  private paintObserver: PerformanceObserver | null = null;

  constructor(private analytics: AnalyticsService) {}

  startTracking(): void {
    if (this.isTracking) return;
    this.isTracking = true;

    this.trackInitialPageLoad();
    this.setupResourceTracking();
    this.setupNavigationTracking();
    this.setupPaintTracking();
    this.trackMemoryUsage();
  }

  stopTracking(): void {
    if (!this.isTracking) return;

    this.performanceObserver?.disconnect();
    this.navigationObserver?.disconnect();
    this.paintObserver?.disconnect();

    this.isTracking = false;
  }

  private trackInitialPageLoad(): void {
    window.addEventListener('load', () => {
      const performanceEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      this.analytics.event('page_load_performance', {
        category: 'Performance',
        dns_time: performanceEntry.domainLookupEnd - performanceEntry.domainLookupStart,
        connection_time: performanceEntry.connectEnd - performanceEntry.connectStart,
        ttfb: performanceEntry.responseStart - performanceEntry.requestStart,
        dom_load_time: performanceEntry.domContentLoadedEventEnd - performanceEntry.domContentLoadedEventStart,
        total_page_load: performanceEntry.loadEventEnd - performanceEntry.startTime,
        redirect_count: performanceEntry.redirectCount,
        navigation_type: performanceEntry.type,
        protocol: performanceEntry.nextHopProtocol
      });
    });
  }

  private setupResourceTracking(): void {
    this.performanceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      entries.forEach(entry => {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming;

          if (!resource.name.includes('analytics') && !resource.name.includes('tracking')) {
            this.analytics.event('resource_performance', {
              category: 'Performance',
              resource_type: resource.initiatorType,
              resource_name: this.getResourceName(resource.name),
              duration: Math.round(resource.duration),
              size: resource.transferSize,
              protocol: resource.nextHopProtocol,
              cache_hit: resource.transferSize === 0 && resource.decodedBodySize > 0,
              timing: {
                dns: resource.domainLookupEnd - resource.domainLookupStart,
                tcp: resource.connectEnd - resource.connectStart,
                ttfb: resource.responseStart - resource.requestStart,
                download: resource.responseEnd - resource.responseStart
              }
            });
          }
        }
      });
    });

    this.performanceObserver.observe({ entryTypes: ['resource'] });
  }

  private setupNavigationTracking(): void {
    this.navigationObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      entries.forEach(entry => {
        const navEntry = entry as PerformanceNavigationTiming;
        this.analytics.event('navigation_performance', {
          category: 'Performance',
          navigation_type: navEntry.type,
          redirect_time: navEntry.redirectEnd - navEntry.redirectStart,
          worker_time: navEntry.workerStart > 0 ? navEntry.responseEnd - navEntry.workerStart : 0,
          response_time: navEntry.responseEnd - navEntry.responseStart,
          dom_interactive: navEntry.domInteractive - navEntry.startTime,
          dom_complete: navEntry.domComplete - navEntry.startTime
        });
      });
    });

    this.navigationObserver.observe({ entryTypes: ['navigation'] });
  }

  private setupPaintTracking(): void {
    this.paintObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      entries.forEach(entry => {
        this.analytics.event('paint_metrics', {
          category: 'Performance',
          paint_type: entry.name,
          timestamp: Math.round(entry.startTime),
          duration: Math.round(entry.duration)
        });
      });
    });

    this.paintObserver.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
  }

  private trackMemoryUsage(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.analytics.event('memory_usage', {
          category: 'Performance',
          used_js_heap_size: Math.round(memory.usedJSHeapSize / (1024 * 1024)),
          total_js_heap_size: Math.round(memory.totalJSHeapSize / (1024 * 1024)),
          js_heap_size_limit: Math.round(memory.jsHeapSizeLimit / (1024 * 1024))
        });
      }, 30000);
    }
  }

  private getResourceName(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.split('/').pop() || urlObj.pathname;
    } catch {
      return url.split('/').pop() || url;
    }
  }
}
