import { Injectable } from '@angular/core';

declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor() {}

  public event(eventName: string, params: {
    category?: string;
    label?: string;
    value?: number;
    [key: string]: any;
  } = {}) {
    gtag('event', eventName, params);
  }
}
