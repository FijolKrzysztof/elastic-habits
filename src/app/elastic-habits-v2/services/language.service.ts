import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export type LanguageCode = 'en' | 'pl';

export interface Translations {
  // Navigation & General
  habits: string;
  calendar: string;
  level: string;

  // Habit related
  addHabit: string;
  editHabit: string;
  deleteHabit: string;
  habitName: string;
  habitDescription: string;

  // Calendar
  today: string;
  thisWeek: string;
  thisMonth: string;

  // Days of week
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;

  // Months
  january: string;
  february: string;
  march: string;
  april: string;
  may: string;
  june: string;
  july: string;
  august: string;
  september: string;
  october: string;
  november: string;
  december: string;

  // Actions
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  add: string;

  // Status
  completed: string;
  pending: string;
  streak: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<LanguageCode>('en');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private translations: Record<LanguageCode, Translations> = {
    en: {
      // Navigation & General
      habits: 'Habits',
      calendar: 'Calendar',
      level: 'Level',

      // Habit related
      addHabit: 'Add Habit',
      editHabit: 'Edit Habit',
      deleteHabit: 'Delete Habit',
      habitName: 'Habit Name',
      habitDescription: 'Description',

      // Calendar
      today: 'Today',
      thisWeek: 'This Week',
      thisMonth: 'This Month',

      // Days of week
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',

      // Months
      january: 'January',
      february: 'February',
      march: 'March',
      april: 'April',
      may: 'May',
      june: 'June',
      july: 'July',
      august: 'August',
      september: 'September',
      october: 'October',
      november: 'November',
      december: 'December',

      // Actions
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',

      // Status
      completed: 'Completed',
      pending: 'Pending',
      streak: 'Streak'
    },
    pl: {
      // Navigation & General
      habits: 'Nawyki',
      calendar: 'Kalendarz',
      level: 'Poziom',

      // Habit related
      addHabit: 'Dodaj Nawyk',
      editHabit: 'Edytuj Nawyk',
      deleteHabit: 'Usuń Nawyk',
      habitName: 'Nazwa Nawyku',
      habitDescription: 'Opis',

      // Calendar
      today: 'Dzisiaj',
      thisWeek: 'Ten Tydzień',
      thisMonth: 'Ten Miesiąc',

      // Days of week
      monday: 'Poniedziałek',
      tuesday: 'Wtorek',
      wednesday: 'Środa',
      thursday: 'Czwartek',
      friday: 'Piątek',
      saturday: 'Sobota',
      sunday: 'Niedziela',

      // Months
      january: 'Styczeń',
      february: 'Luty',
      march: 'Marzec',
      april: 'Kwiecień',
      may: 'Maj',
      june: 'Czerwiec',
      july: 'Lipiec',
      august: 'Sierpień',
      september: 'Wrzesień',
      october: 'Październik',
      november: 'Listopad',
      december: 'Grudzień',

      // Actions
      save: 'Zapisz',
      cancel: 'Anuluj',
      delete: 'Usuń',
      edit: 'Edytuj',
      add: 'Dodaj',

      // Status
      completed: 'Ukończone',
      pending: 'Oczekujące',
      streak: 'Seria'
    }
  };

  constructor() {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage') as LanguageCode;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'pl')) {
      this.currentLanguageSubject.next(savedLanguage);
    }
  }

  get currentLanguage(): LanguageCode {
    return this.currentLanguageSubject.value;
  }

  setLanguage(language: LanguageCode): void {
    this.currentLanguageSubject.next(language);
    localStorage.setItem('selectedLanguage', language);
  }

  getTranslations(): Translations {
    return this.translations[this.currentLanguage];
  }

  getTranslation(key: keyof Translations): string {
    return this.translations[this.currentLanguage][key];
  }

  // Utility method to get translations for a specific language
  getTranslationsFor(language: LanguageCode): Translations {
    return this.translations[language];
  }
}
