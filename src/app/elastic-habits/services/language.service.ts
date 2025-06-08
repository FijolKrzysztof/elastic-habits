import { Injectable, signal, computed } from '@angular/core';

export type LanguageCode = 'en' | 'pl';

export interface Translations {
  addHabit: string;
  editHabit: string;
  deleteHabit: string;
  habitName: string;
  habitDescription: string;
  newHabit: string;

  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;

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

  readonly currentLanguage = this.currentLanguageSignal.asReadonly();

  readonly translations = computed(() => this.getTranslationsFor(this.currentLanguage()));

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
      t.monday.slice(0, 3),
      t.tuesday.slice(0, 3),
      t.wednesday.slice(0, 3),
      t.thursday.slice(0, 3),
      t.friday.slice(0, 3),
      t.saturday.slice(0, 3),
      t.sunday.slice(0, 3)
    ];
  });

  private translationsData: Record<LanguageCode, Translations> = {
    en: {
      addHabit: 'Add Habit',
      editHabit: 'Edit Habit',
      deleteHabit: 'Delete Habit',
      habitName: 'Habit Name',
      habitDescription: 'Your daily goal',
      newHabit: 'New Habit',

      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',

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
      addHabit: 'Dodaj Nawyk',
      editHabit: 'Edytuj Nawyk',
      deleteHabit: 'Usuń Nawyk',
      habitName: 'Nazwa Nawyku',
      habitDescription: 'Twój codzienny cel',
      newHabit: 'Nowy Nawyk',

      monday: 'Poniedziałek',
      tuesday: 'Wtorek',
      wednesday: 'Środa',
      thursday: 'Czwartek',
      friday: 'Piątek',
      saturday: 'Sobota',
      sunday: 'Niedziela',

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
