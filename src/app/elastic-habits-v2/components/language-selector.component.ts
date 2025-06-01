import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, LanguageCode } from '../services/language.service';
import { Subscription } from 'rxjs';

export interface Language {
  code: LanguageCode;
  name: string;
  flag: string;
}

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-1 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
      <button
        *ngFor="let language of languages"
        [class]="getButtonClass(language.code)"
        (click)="selectLanguage(language.code)"
        [title]="language.name"
        type="button"
        class="w-10 h-8 flex items-center justify-center rounded transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      >
        <span class="text-xl">{{ language.flag }}</span>
      </button>
    </div>
  `
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {
  selectedLanguage: LanguageCode = 'en';
  private subscription?: Subscription;

  languages: Language[] = [
    {
      code: 'en',
      name: 'English',
      flag: '🇬🇧'
    },
    {
      code: 'pl',
      name: 'Polski',
      flag: '🇵🇱'
    }
  ];

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.subscription = this.languageService.currentLanguage$.subscribe(
      language => this.selectedLanguage = language
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  selectLanguage(langCode: LanguageCode): void {
    this.languageService.setLanguage(langCode);
  }

  getButtonClass(langCode: LanguageCode): string {
    const baseClass = 'transition-all duration-200 hover:bg-gray-50';
    return this.selectedLanguage === langCode
      ? `${baseClass} ring-2 ring-blue-500 bg-blue-50`
      : baseClass;
  }
}
