import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HabitService } from '../../../services/habit.service';
import { Habit } from '../../../models/habit.model';

@Component({
  selector: 'app-habit-tag',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <button
      (click)="selectHabit()"
      class="relative w-32 h-16 font-medium transition-all duration-300 focus:outline-none group habit-button"
      [class]="isSelected
        ? 'text-gray-800 shadow-2xl scale-110 z-10'
        : 'text-gray-700 hover:text-gray-900 shadow-xl hover:shadow-2xl'"
    >
      <div class="absolute inset-0 rounded-sm tag-background transition-all duration-300"
           [style.background]="getTagBackground(habit?.color || '#10B981')"
           style="
               clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 0 100%, 6px 50%);
               box-shadow:
                 0 8px 16px rgba(0,0,0,0.25),
                 0 4px 8px rgba(0,0,0,0.15),
                 inset 0 1px 0 rgba(255,255,255,0.4),
                 inset 0 -1px 0 rgba(0,0,0,0.1),
                 inset 2px 0 4px rgba(0,0,0,0.05);
             ">
        <div class="absolute inset-0 opacity-30 bg-paper-texture rounded-sm"
             style="
                 clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 0 100%, 6px 50%);
                 background-image:
                   radial-gradient(circle at 20% 30%, rgba(0,0,0,0.03) 1px, transparent 1px),
                   radial-gradient(circle at 70% 60%, rgba(0,0,0,0.02) 1px, transparent 1px),
                   radial-gradient(circle at 40% 80%, rgba(0,0,0,0.02) 1px, transparent 1px);
                 background-size: 15px 15px, 20px 20px, 12px 12px;
               ">
        </div>

        <div class="absolute top-0 left-2 right-4 h-4 bg-gradient-to-b from-white/20 to-transparent rounded-sm"
             style="clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 0 100%, 6px 50%);">
        </div>
      </div>

      <div class="absolute left-1/2 top-2 w-3 h-3 bg-white rounded-full border-2 border-gray-400 shadow-inner z-10 transform -translate-x-1/2">
        <div class="absolute inset-0.5 bg-gradient-to-br from-gray-50 to-gray-200 rounded-full"></div>
        <div class="absolute inset-0 border border-gray-500 rounded-full"></div>
      </div>

      <div class="absolute inset-0 flex items-center justify-center px-2">
        @if (isEditing()) {
          <input
            type="text"
            [(ngModel)]="editingName"
            (keyup.enter)="saveEdit()"
            (keyup.escape)="cancelEdit()"
            (blur)="saveEdit()"
            class="w-full text-sm font-bold text-center leading-tight bg-white border border-black border-dashed rounded px-1 py-0.5 focus:outline-none focus:border-black"
            style="color: #2d1810; font-family: 'Kalam', 'Caveat', 'Patrick Hand', cursive; font-weight: 500; letter-spacing: 0.5px;"
            #editInput
          />
        } @else {
          <div class="flex items-center justify-center px-1 py-0.5 rounded transition-all duration-200 editable-content"
               [class.is-selected]="isSelected"
               [class.cursor-pointer]="isSelected"
               (click)="startEditingIfCurrent($event)">
            <span
              class="text-sm font-bold drop-shadow-sm text-center leading-tight max-w-full overflow-hidden line-clamp-2"
              [style.color]="getTextColor(habit?.color || '#10B981')"
              style="font-family: 'Kalam', 'Caveat', 'Patrick Hand', cursive; font-weight: 500; letter-spacing: 0.5px;"
            >
                {{ habit?.name || 'Nowy nawyk' }}
              </span>
          </div>
        }
      </div>

      <div class="absolute inset-0 opacity-20 pointer-events-none"
           style="
               background-image:
                 radial-gradient(ellipse at 80% 20%, rgba(139,69,19,0.1) 2px, transparent 3px),
                 radial-gradient(ellipse at 30% 70%, rgba(101,67,33,0.1) 1px, transparent 2px);
               background-size: 25px 25px, 15px 15px;
               clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 0 100%, 6px 50%);
             ">
      </div>
    </button>

    <style>
      :root {
        --thread: #654321;
        --thread-dark: #4A2C14;
        --thread-light: #8B6914;
        --thread-highlight: #B8860B;
        --thread-shadow: #3E2723;

        --leather: #8B4513;
        --leather-dark: #654321;

        --cream: #FFF8DC;
        --parchment: #F5E6D3;
        --parchment-dark: #E8D2B8;
        --parchment-border: #D4B896;
      }

      .bg-leather { background-color: var(--leather); }
      .bg-leather-dark { background-color: var(--leather-dark); }
      .hover\\:bg-leather-dark:hover { background-color: var(--leather-dark); }

      .bg-cream { background-color: var(--cream); }
      .text-cream { color: var(--cream); }
      .text-leather-dark { color: var(--leather-dark); }
      .text-leather { color: var(--leather); }
      .bg-parchment { background-color: var(--parchment); }
      .bg-parchment-dark { background-color: var(--parchment-dark); }
      .border-parchment-border { border-color: var(--parchment-border); }
      .border-leather { border-color: var(--leather); }
      .focus\\:ring-leather:focus { --tw-ring-color: var(--leather); }
      .focus\\:border-leather:focus { border-color: var(--leather); }

      .editable-content.is-selected {
        position: relative;
      }

      .editable-content.is-selected::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: linear-gradient(90deg,
        transparent 0%,
        rgba(45, 24, 16, 0.4) 20%,
        rgba(45, 24, 16, 0.6) 50%,
        rgba(45, 24, 16, 0.4) 80%,
        transparent 100%
        );
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.3s ease;
      }

      .editable-content.is-selected:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }

      .editable-content.is-selected:hover::after {
        transform: scaleX(1);
      }

      button:focus {
        outline: none !important;
        box-shadow: none !important;
      }

      button:active .tag-background {
        transform: scale(0.98) rotate(2deg);
        box-shadow:
          0 4px 8px rgba(0,0,0,0.3),
          inset 0 2px 4px rgba(0,0,0,0.1);
      }

      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    </style>
  `
})
export class HabitTagComponent {
  @Input() habit?: Habit;
  @Input() index: number = 0;

  isEditing = signal<boolean>(false);
  editingName = '';

  constructor(public habitService: HabitService) {}

  get isSelected(): boolean {
    return this.habit ? this.habit.id === this.habitService.currentHabitId() : false;
  }

  selectHabit(): void {
    if (this.habit && !this.isEditing()) {
      this.habitService.setCurrentHabit(this.habit.id);
    }
  }

  startEditingIfCurrent(event: Event): void {
    if (this.isSelected) {
      event.stopPropagation();
      this.startEditing();
    }
  }

  saveEdit(): void {
    if (!this.habit) return;

    const trimmedName = this.editingName.trim();

    if (trimmedName) {
      this.habitService.updateHabitName(this.habit.id, trimmedName);
      this.isEditing.set(false);
      this.editingName = '';
    } else if (this.habit.name === 'Nowy nawyk') {
      this.habitService.deleteHabit(this.habit.id);
    } else {
      this.editingName = this.habit.name;
      this.isEditing.set(false);
    }
  }

  cancelEdit(): void {
    if (this.habit && this.editingName === 'Nowy nawyk' && this.habit.name === 'Nowy nawyk') {
      this.habitService.deleteHabit(this.habit.id);
    }

    this.isEditing.set(false);
    this.editingName = '';
  }

  startEditing(): void {
    this.isEditing.set(true);
    this.editingName = this.habit?.name || 'Nowy nawyk';

    setTimeout(() => {
      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }, 0);
  }

  getTagBackground(color: string): string {
    return `linear-gradient(135deg,
      ${color}f0 0%,
      ${color}e0 25%,
      ${color}f5 50%,
      ${color}d8 75%,
      ${color}e8 100%
    ), linear-gradient(45deg,
      rgba(245,245,220,0.3) 0%,
      rgba(255,248,220,0.2) 50%,
      rgba(240,230,210,0.3) 100%
    )`;
  }

  getTextColor(backgroundColor: string): string {
    const darkColors = ['#000', '#333', '#555', '#800', '#008', '#080'];
    const isDark = darkColors.some(dark => backgroundColor.toLowerCase().includes(dark.slice(1)));
    return isDark ? '#f5f5f5' : '#2d1810';
  }
}
