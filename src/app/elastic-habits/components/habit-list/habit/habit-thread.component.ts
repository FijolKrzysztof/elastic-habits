import { Component, Input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitTagComponent } from './habit-tag.component';
import { HabitService } from '../../../services/habit.service';
import { LanguageService } from '../../../services/language.service';
import { Habit } from '../../../models/habit.model';

@Component({
  selector: 'app-habit-thread',
  standalone: true,
  imports: [CommonModule, HabitTagComponent],
  template: `
    <div class="relative group w-32"
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
            (click)="onAddHabit()"
            class="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full hover:from-emerald-600 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110 flex items-center justify-center group z-30 border-2 border-emerald-400 add-button"
            [title]="translations().addHabit"
          >
            <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path>
            </svg>
          </button>
        }

        @if (isAddButton) {
          <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-16 pointer-events-none"
               [style.transform]="'translateX(-50%) translateY(' + getHangLength(index) + 'px) rotate(' + getSubtleRotation(index) + 'deg)'"
               style="transform-origin: 50% 8px;">
          </div>
        }

        @if (!isAddButton && showDeleteButton) {
          <button
            (click)="onDeleteHabit()"
            class="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-red-500 to-red-700 rounded-full hover:from-red-600 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110 flex items-center justify-center group z-30 border-2 border-red-400"
            [title]="translations().deleteHabit"
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
             [class.non-selected]="!isSelected()"
             [style.transform]="getTagTransform()"
             [style.--hang-length]="getHangLength(index) + 'px'"
             [style.--rotation]="getSubtleRotation(index) + 'deg'"
             [style.--is-selected]="isSelected() ? '1' : '0'"
             style="transform-origin: 50% 8px;">

          <div class="habit-tag-inner transition-transform duration-300 ease-out">
            <app-habit-tag
              [habit]="habit"
              [index]="index">
            </app-habit-tag>

            <div class="absolute inset-0 top-2 left-1 bg-black/20 blur-sm rounded-sm tag-shadow transition-all duration-300 -z-10"
                 style="clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 0 100%, 6px 50%);">
            </div>
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
      }

      .bg-thread { background-color: var(--thread); }
      .bg-thread-dark { background-color: var(--thread-dark); }
      .bg-thread-light { background-color: var(--thread-light); }

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

      /* Hover efekt tylko dla niewybranych nawykow */
      .habit-tag-container.non-selected:hover .habit-tag-inner {
        transform: scale(1.1);
        z-index: 20;
      }

      .habit-tag-container.non-selected:hover .tag-shadow {
        transform: scale(1.05);
        opacity: 0.3;
      }
    </style>
  `
})
export class HabitThreadComponent {
  @Input() habit?: Habit;
  @Input() index: number = 0;
  @Input() isAddButton: boolean = false;
  @Input() showDeleteButton: boolean = true;

  private languageService = inject(LanguageService);
  public habitService = inject(HabitService);

  translations = computed(() => this.languageService.translations());

  isSelected = computed(() =>
    this.habit ? this.habit.id === this.habitService.currentHabitId() : false
  );

  onAddHabit(): void {
    const newHabitName = this.translations().habitName || 'New Habit';
    const newHabitId = this.habitService.addHabit(newHabitName);
    this.habitService.setCurrentHabit(newHabitId);

    setTimeout(() => {
      const habitTagComponent = document.querySelector('app-habit-tag');
      if (habitTagComponent) {
        const component = (habitTagComponent as any).__ngContext__?.[8];
        if (component && component.startEditing) {
          component.startEditing();
        }
      }
    }, 100);
  }

  onDeleteHabit(): void {
    if (this.habit) {
      this.habitService.deleteHabit(this.habit.id);
    }
  }

  getHangLength(index: number): number {
    const baseHang = -5;
    return this.isSelected() ? baseHang + 35 : baseHang;
  }

  getTagTransform(): string {
    const hangLength = this.getHangLength(this.index);
    const baseTransform = `translateY(${hangLength}px)`;

    const rotation = this.isSelected()
      ? Math.abs(this.getSubtleRotation(this.index))
      : -Math.abs(this.getSubtleRotation(this.index));

    return `${baseTransform} rotate(${rotation}deg)`;
  }

  getHorizontalOffset(index: number): number {
    const pseudo = Math.sin(index * 45.678) * 43758.5453;
    const normalized = pseudo - Math.floor(pseudo);
    return Math.floor(normalized * 50) - 25;
  }

  getSubtleRotation(index: number): number {
    const pseudo = Math.sin(index * 34.567) * 43758.5453;
    const normalized = pseudo - Math.floor(pseudo);
    return (normalized * 20) - 10;
  }
}
