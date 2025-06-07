import { Injectable, signal, computed, inject } from '@angular/core';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private languageService = inject(LanguageService);
  private currentDateSignal = signal<Date>(new Date());

  readonly currentDate = this.currentDateSignal.asReadonly();

  readonly months = computed(() => this.languageService.months());
  readonly weekDays = computed(() => this.languageService.weekDays());

  navigateMonth(direction: number): void {
    this.currentDateSignal.update(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  }

  getCalendarDays(): (Date | null)[] {
    const currentDate = this.currentDate();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;

    const days: (Date | null)[] = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  getCurrentMonthName(): string {
    const currentDate = this.currentDate();
    return this.months()[currentDate.getMonth()];
  }

  getCurrentYear(): number {
    return this.currentDate().getFullYear();
  }
}
