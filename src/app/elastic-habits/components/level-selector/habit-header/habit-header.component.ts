import { Component, inject, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HabitService } from '../../../services/habit.service';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-habit-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './habit-header.component.scss',
  template: `
    @if (habitService.currentHabit()) {
      <div class="habit-header">
        <div class="habit-badge" [style.background]="getHabitGradient()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div class="habit-info">
          <h2 class="habit-name">{{ habitService.currentHabit()?.name }}</h2>

          <div class="target-area">
            @if (!isEditing()) {
              <div class="target-display" (click)="startEditing()">
                <span class="target-text">{{ getHabitDescription() }}</span>
                <svg class="edit-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </div>
            } @else {
              <input
                #descriptionInput
                type="text"
                class="target-input"
                [(ngModel)]="editingDescription"
                (blur)="saveDescription()"
                (keydown)="onKeyDown($event)"
                (click)="$event.stopPropagation()"
                [placeholder]="languageService.translations().habitDescription"
              />
            }
          </div>
        </div>
      </div>
    }
  `
})
export class HabitHeaderComponent {
  readonly habitService = inject(HabitService);
  readonly languageService = inject(LanguageService);

  @ViewChild('descriptionInput') descriptionInput!: ElementRef<HTMLInputElement>;

  private isEditingSignal = signal(false);
  private editingDescriptionSignal = signal('');
  private originalDescriptionSignal = signal('');

  readonly isEditing = this.isEditingSignal.asReadonly();

  get editingDescription(): string {
    return this.editingDescriptionSignal();
  }

  set editingDescription(value: string) {
    this.editingDescriptionSignal.set(value);
  }

  getHabitGradient(): string {
    const color = this.habitService.currentHabit()?.color || '#3b82f6';
    return `linear-gradient(135deg, ${color}, ${this.adjustColor(color, -20)})`;
  }

  getHabitDescription(): string {
    const currentDescription = this.habitService.getHabitDescription();
    return currentDescription || this.languageService.translations().habitDescription;
  }

  startEditing(): void {
    const currentDescription = this.habitService.getHabitDescription();
    const defaultDescription = this.languageService.translations().habitDescription;

    // If current description is empty or is the default, start with empty input
    const descriptionToEdit = (currentDescription && currentDescription !== defaultDescription)
      ? currentDescription
      : '';

    this.editingDescriptionSignal.set(descriptionToEdit);
    this.originalDescriptionSignal.set(currentDescription);
    this.isEditingSignal.set(true);

    // Focus the input after view update
    setTimeout(() => {
      this.descriptionInput?.nativeElement.focus();
      this.descriptionInput?.nativeElement.select();
    });
  }

  saveDescription(): void {
    if (!this.isEditing()) return;

    const newDescription = this.editingDescription.trim();
    this.habitService.updateHabitDescription(newDescription);
    this.isEditingSignal.set(false);
  }

  cancelEditing(): void {
    this.editingDescriptionSignal.set(this.originalDescriptionSignal());
    this.isEditingSignal.set(false);
  }

  onKeyDown(event: KeyboardEvent): void {
    event.stopPropagation();

    if (event.key === 'Enter') {
      this.saveDescription();
    } else if (event.key === 'Escape') {
      this.cancelEditing();
    }
  }

  private adjustColor(color: string, amount: number): string {
    const usePound = color[0] === '#';
    const col = usePound ? color.slice(1) : color;
    const num = parseInt(col, 16);
    let r = (num >> 16) + amount;
    let g = (num >> 8 & 0x00FF) + amount;
    let b = (num & 0x0000FF) + amount;
    r = r > 255 ? 255 : r < 0 ? 0 : r;
    g = g > 255 ? 255 : g < 0 ? 0 : g;
    b = b > 255 ? 255 : b < 0 ? 0 : b;
    return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
  }
}
