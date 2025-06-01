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
    <div class="relative group w-24"
         [class.add-button-container]="isAddButton"
         [style.margin-left]="getHorizontalOffset(index) + 'px'">

      <div class="absolute origin-top z-0"
           [style.top]="'-52px'"
           [style.left]="'50%'"
           [style.transform]="'translateX(-50%)'"
           [style.height]="(52 + getHangLength(index) + 8) + 'px'"
           style="width: 3px; transform-origin: top center;">

        <div class="relative w-full h-full thread-content">
          <div class="absolute inset-0 bg-gradient-to-b from-thread-light via-thread to-thread-dark rounded-full shadow-sm">
            <div class="absolute inset-0 opacity-70 rounded-full"
                 style="background-image:
                   repeating-linear-gradient(30deg,
                     transparent 0px,
                     rgba(101,67,33,0.4) 0.5px,
                     transparent 1px,
                     rgba(74,44,23,0.3) 1.5px,
                     transparent 2px
                   ),
                   repeating-linear-gradient(-30deg,
                     transparent 0px,
                     rgba(139,69,19,0.3) 0.5px,
                     transparent 1px
                   );
                   background-size: 4px 4px, 3px 3px;">
            </div>

            <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-thread-highlight/60 to-transparent rounded-full"></div>

            <div class="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-thread-shadow to-thread-shadow/80 rounded-full"></div>

            <div class="absolute inset-0 opacity-50 rounded-full"
                 style="background-image:
                   radial-gradient(ellipse 0.5px 3px at 30% 20%, rgba(139,69,19,0.8) 0%, transparent 70%),
                   radial-gradient(ellipse 0.5px 2px at 70% 60%, rgba(101,67,33,0.6) 0%, transparent 70%),
                   radial-gradient(ellipse 0.5px 4px at 20% 80%, rgba(160,82,45,0.7) 0%, transparent 70%);
                 background-size: 8px 8px, 12px 12px, 6px 6px;">
            </div>
          </div>

          <div class="absolute top-0 left-1 w-3 h-full bg-gradient-to-b from-black/15 via-black/10 to-black/5 rounded-full blur-sm"></div>
        </div>

        @if (isAddButton) {
          <button
            (click)="addHabit()"
            class="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full hover:from-emerald-600 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110 flex items-center justify-center group z-30 border-2 border-emerald-400 add-button"
            title="Dodaj nawyk"
          >
            <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path>
            </svg>
          </button>
        }

        @if (isAddButton) {
          <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-16 pointer-events-none"
               [style.transform]="'translateX(-50%) translateY(' + getHangLength(index) + 'px) rotate(' + getSubtleRotation(index) + 'deg)'"
               style="transform-origin: 50% 8px;">
          </div>
        }

        @if (!isAddButton && showDeleteButton) {
          <button
            (click)="deleteHabit()"
            class="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-red-500 to-red-700 rounded-full hover:from-red-600 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110 flex items-center justify-center group z-30 border-2 border-red-400"
            title="Usuń nawyk"
          >
            <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        }

        <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-4 bg-gradient-to-b from-thread to-thread-dark rounded-full shadow-sm thread-end"></div>
      </div>

      @if (!isAddButton) {
        <div class="relative transition-all duration-300 ease-out habit-tag-container z-10"
             [class.selected]="isSelected()"
             [style.transform]="getTagTransform()"
             style="transform-origin: 50% 8px;">

          <button
            (click)="selectHabit()"
            class="relative w-24 h-16 font-medium transition-all duration-300 focus:outline-none group habit-button"
            [class]="habit && habit.id === habitService.currentHabitId()
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
                  class="w-full text-xs font-bold text-center leading-tight font-serif bg-transparent border-none outline-none px-1"
                  [style.color]="getTextColor(habit?.color || '#10B981')"
                  #editInput
                />
              } @else {
                <span
                  class="text-xs font-bold drop-shadow-sm text-center leading-tight max-w-full overflow-hidden line-clamp-2 font-serif"
                  [class.cursor-pointer]="habit && habit.id === habitService.currentHabitId()"
                  [style.color]="getTextColor(habit?.color || '#10B981')"
                  (click)="startEditingIfCurrent($event)"
                >
                  {{ habit?.name || 'Nowy nawyk' }}
                </span>
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

          <div class="absolute inset-0 top-2 left-1 bg-black/20 blur-sm rounded-sm tag-shadow transition-all duration-300 -z-10"
               style="clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 0 100%, 6px 50%);">
          </div>
        </div>
      }
    </div>

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

      .bg-thread { background-color: var(--thread); }
      .bg-thread-dark { background-color: var(--thread-dark); }
      .bg-thread-light { background-color: var(--thread-light); }

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

      .group.add-button-container .thread-content {
        display: none;
      }

      .group.add-button-container .thread-end {
        display: none;
      }

      .group.add-button-container:hover .thread-content {
        display: block;
      }

      .group.add-button-container:hover .thread-end {
        display: block;
      }

      /* Efekty hover dla tagów - tylko skalowanie, bez zmiany wysokości */
      .habit-tag-container:hover {
        transform-origin: 50% 50%;
        z-index: 20;
      }

      .habit-tag-container:hover {
        scale: 1.15;
      }

      .habit-tag-container:hover .tag-background {
        box-shadow:
          0 12px 24px rgba(0,0,0,0.35),
          0 8px 16px rgba(0,0,0,0.25),
          inset 0 1px 0 rgba(255,255,255,0.5),
          inset 0 -1px 0 rgba(0,0,0,0.15),
          inset 2px 0 6px rgba(0,0,0,0.08);
      }

      .habit-tag-container:hover .tag-shadow {
        transform: scale(1.2) rotate(2deg);
        opacity: 0.4;
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
  @Input() isAddButton: boolean = false;
  @Input() showDeleteButton: boolean = true;

  isEditing = signal<boolean>(false);
  editingName = '';

  constructor(public habitService: HabitService) {}

  addHabit(): void {
    const newHabitId = this.habitService.addHabit('Nowy nawyk');

    this.habitService.setCurrentHabit(newHabitId);

    setTimeout(() => {
      this.isEditing.set(true);
      this.editingName = 'Nowy nawyk';

      setTimeout(() => {
        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (input) {
          input.focus();
          input.select();
        }
      }, 0);
    }, 100);
  }

  selectHabit(): void {
    if (this.habit && !this.isEditing()) {
      this.habitService.setCurrentHabit(this.habit.id);
    }
  }

  startEditingIfCurrent(event: Event): void {
    if (this.habit && this.habit.id === this.habitService.currentHabitId()) {
      event.stopPropagation();
      this.isEditing.set(true);
      this.editingName = this.habit.name;

      setTimeout(() => {
        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (input) {
          input.focus();
          input.select();
        }
      }, 0);
    }
  }

  saveEdit(): void {
    if (this.editingName.trim() && this.habit) {
      this.habitService.updateHabitName(this.habit.id, this.editingName.trim());
      this.isEditing.set(false);
      this.editingName = '';
    } else if (!this.editingName.trim() && this.habit) {
      this.habitService.deleteHabit(this.habit.id);
    }
  }

  cancelEdit(): void {
    if (this.habit && this.editingName === 'Nowy nawyk' && this.habit.name === 'Nowy nawyk') {
      this.habitService.deleteHabit(this.habit.id);
    }

    this.isEditing.set(false);
    this.editingName = '';
  }

  deleteHabit(): void {
    if (this.habit) {
      this.habitService.deleteHabit(this.habit.id);
    }
  }

  // Sprawdzanie czy tag jest wybrany
  isSelected(): boolean {
    return this.habit ? this.habit.id === this.habitService.currentHabitId() : false;
  }

  // Obliczanie długości zwisania - wybrany zwisa niżej
  getHangLength(index: number): number {
    const baseHang = 6; // Jeszcze krótsze nitki domyślnie
    return this.isSelected() ? baseHang + 30 : baseHang; // Wybrany +30px (większe wydłużenie)
  }

  // Obliczanie transformacji tagu
  getTagTransform(): string {
    const hangLength = this.getHangLength(this.index);
    const baseTransform = `translateY(${hangLength}px)`;
    const rotation = this.isSelected()
      ? Math.abs(this.getSubtleRotation(this.index)) // Wybrany = w prawo (dodatni kąt)
      : -Math.abs(this.getSubtleRotation(this.index)); // Niewybrany = w lewo (ujemny kąt)

    return `${baseTransform} rotate(${rotation}deg)`;
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

  getRandomHang(index: number): number {
    const pseudo = Math.sin(index * 12.9898) * 43758.5453;
    const normalized = pseudo - Math.floor(pseudo);
    return Math.floor(normalized * 30) + 10; // Od 10 do 40px w dół
  }

  getHorizontalOffset(index: number): number {
    const pseudo = Math.sin(index * 45.678) * 43758.5453;
    const normalized = pseudo - Math.floor(pseudo);
    return Math.floor(normalized * 50) - 25;
  }

  getSubtleRotation(index: number): number {
    const pseudo = Math.sin(index * 34.567) * 43758.5453;
    const normalized = pseudo - Math.floor(pseudo);
    return (normalized * 20) - 10; // Zwiększone z 12 do 20 (zakres -10 do +10 stopni)
  }
}
