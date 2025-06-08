import { Injectable, signal, computed } from '@angular/core';

export type LanguageCode = 'en' | 'pl';

export interface Translations {
  // Habit related
  addHabit: string;
  editHabit: string;
  deleteHabit: string;
  habitName: string;
  habitDescription: string;
  newHabit: string;

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
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSignal = signal<LanguageCode>('en');

  // Readonly signal for external access
  readonly currentLanguage = this.currentLanguageSignal.asReadonly();

  // Computed translations that automatically update when language changes
  readonly translations = computed(() => this.getTranslationsFor(this.currentLanguage()));

  // Computed arrays for calendar - automatically translated
  readonly months = computed(() => [
    this.translations().january,
    this.translations().february,
    this.translations().march,
    this.translations().april,
    this.translations().may,
    this.translations().june,
    this.translations().july,
    this.translations().august,
    this.translations().september,
    this.translations().october,
    this.translations().november,
    this.translations().december
  ]);

  readonly weekDays = computed(() => {
    const t = this.translations();
    return [
      t.monday.slice(0, 3),    // Pon / Mon
      t.tuesday.slice(0, 3),   // Wt / Tue
      t.wednesday.slice(0, 3), // Śr / Wed
      t.thursday.slice(0, 3),  // Czw / Thu
      t.friday.slice(0, 3),    // Pt / Fri
      t.saturday.slice(0, 3),  // Sob / Sat
      t.sunday.slice(0, 3)     // Ndz / Sun
    ];
  });

  private translationsData: Record<LanguageCode, Translations> = {
    en: {
      // Habit related
      addHabit: 'Add Habit',
      editHabit: 'Edit Habit',
      deleteHabit: 'Delete Habit',
      habitName: 'Habit Name',
      habitDescription: 'Your daily goal',
      newHabit: 'New Habit',

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
    },
    pl: {
      // Habit related
      addHabit: 'Dodaj Nawyk',
      editHabit: 'Edytuj Nawyk',
      deleteHabit: 'Usuń Nawyk',
      habitName: 'Nazwa Nawyku',
      habitDescription: 'Twój codzienny cel',
      newHabit: 'Nowy Nawyk',

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
    }
  };

  constructor() {
    const savedLanguage = localStorage.getItem('selectedLanguage') as LanguageCode;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'pl')) {
      this.currentLanguageSignal.set(savedLanguage);
    }
  }

  setLanguage(language: LanguageCode): void {
    this.currentLanguageSignal.set(language);
    localStorage.setItem('selectedLanguage', language);
  }

  getTranslationsFor(language: LanguageCode): Translations {
    return this.translationsData[language];
  }
}
