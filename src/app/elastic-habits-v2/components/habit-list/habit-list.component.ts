import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitService } from '../../services/habit.service';
import { HabitTagComponent } from './habit-tag/habit-tag.component';

@Component({
    selector: 'app-habit-list',
    standalone: true,
    imports: [CommonModule, HabitTagComponent],
    template: `
        <div class="mb-8 px-4">
            <div class="flex items-center gap-3 mb-8">
                <h2 class="text-2xl font-bold text-gray-800 font-serif">Twoje nawyki</h2>
            </div>

            <div class="relative min-h-40 p-4">
                <div class="absolute top-8 left-4 right-4 h-4">
                    <div class="relative w-full h-full">
                        <div class="absolute inset-0 bg-gradient-to-b from-rope-shadow via-rope-base to-rope-dark rounded-full">
                            <div class="absolute inset-0 bg-gradient-to-b from-rope-light via-rope to-rope-dark rounded-full"></div>

                            <div class="absolute inset-0 opacity-80 rounded-full"
                                 style="background: repeating-conic-gradient(
                     from 0deg at 50% 50%,
                     var(--rope-fiber-1) 0deg,
                     var(--rope-fiber-2) 60deg,
                     var(--rope-fiber-3) 120deg,
                     var(--rope-fiber-1) 180deg,
                     var(--rope-fiber-2) 240deg,
                     var(--rope-fiber-3) 300deg,
                     var(--rope-fiber-1) 360deg
                   );">
                            </div>

                            <div class="absolute inset-0 opacity-60 rounded-full"
                                 style="background-image:
                     repeating-linear-gradient(45deg,
                       transparent 0px,
                       rgba(139,69,19,0.3) 1px,
                       transparent 2px,
                       rgba(101,67,33,0.2) 3px,
                       transparent 4px,
                       rgba(160,82,45,0.3) 5px,
                       transparent 6px
                     ),
                     repeating-linear-gradient(-45deg,
                       transparent 0px,
                       rgba(139,69,19,0.2) 1px,
                       transparent 2px,
                       rgba(101,67,33,0.3) 3px,
                       transparent 4px
                     );">
                            </div>

                            <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-rope-highlight to-transparent rounded-full opacity-70"></div>
                            <div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-rope-shadow to-transparent rounded-full opacity-80"></div>
                            <div class="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-r from-rope-shadow to-transparent rounded-l-full opacity-60"></div>
                            <div class="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-l from-rope-shadow to-transparent rounded-r-full opacity-60"></div>

                            <div class="absolute inset-0 opacity-40 rounded-full"
                                 style="background-image:
                     radial-gradient(ellipse 1px 8px at 20% 30%, rgba(139,69,19,0.8) 0%, transparent 70%),
                     radial-gradient(ellipse 1px 6px at 60% 80%, rgba(101,67,33,0.6) 0%, transparent 70%),
                     radial-gradient(ellipse 1px 7px at 40% 15%, rgba(160,82,45,0.7) 0%, transparent 70%),
                     radial-gradient(ellipse 1px 5px at 80% 60%, rgba(139,69,19,0.5) 0%, transparent 70%),
                     radial-gradient(ellipse 1px 9px at 10% 90%, rgba(101,67,33,0.8) 0%, transparent 70%);
                   background-size: 15px 15px, 20px 20px, 18px 18px, 12px 12px, 25px 25px;">
                            </div>

                            <div class="absolute inset-0 opacity-30 rounded-full"
                                 style="background-image:
                     radial-gradient(circle 2px at 25% 40%, rgba(101,67,33,0.8) 0%, transparent 50%),
                     radial-gradient(circle 1px at 70% 20%, rgba(139,69,19,0.9) 0%, transparent 40%),
                     radial-gradient(circle 3px at 45% 75%, rgba(160,82,45,0.6) 0%, transparent 60%),
                     radial-gradient(circle 1px at 85% 85%, rgba(101,67,33,0.7) 0%, transparent 45%);
                   background-size: 30px 30px, 25px 25px, 35px 35px, 20px 20px;">
                            </div>
                        </div>

                        <div class="absolute top-2 left-1 right-0 h-4 bg-gradient-to-b from-black/20 via-black/15 to-black/10 rounded-full blur-sm"></div>
                    </div>

                    <div class="absolute top-0.5 left-1/4 w-3 h-5 bg-gradient-to-br from-rope-knot-light to-rope-knot-dark rounded-full shadow-lg opacity-90">
                        <div class="absolute inset-0.5 bg-gradient-to-br from-rope-knot-highlight to-transparent rounded-full opacity-60"></div>
                    </div>
                    <div class="absolute top-0.5 right-1/3 w-2.5 h-4 bg-gradient-to-br from-rope-knot-light to-rope-knot-dark rounded-full shadow-md opacity-85">
                        <div class="absolute inset-0.5 bg-gradient-to-br from-rope-knot-highlight to-transparent rounded-full opacity-50"></div>
                    </div>
                    <div class="absolute top-1 left-2/3 w-2 h-3 bg-gradient-to-br from-rope-knot-light to-rope-knot-dark rounded-full shadow-md opacity-75"></div>
                </div>

                <!-- Gwoździe równo rozłożone po sznurku -->
                <!-- Gwóźdź 1 - lewy -->
                <div class="absolute top-8 left-2 z-10">
                    <div class="relative w-4 h-4 transform -rotate-12">
                        <div class="absolute inset-0 rounded-full bg-gradient-to-br from-gray-400 to-gray-600"></div>
                        <div class="absolute top-1 left-1 w-1 h-0.5 bg-white/40 rounded-full"></div>
                        <div class="absolute top-1.5 left-1.5 w-1 h-1 bg-gray-800 rounded-full"></div>
                    </div>
                </div>

                <!-- Gwóźdź 2 -->
                <div class="absolute top-8 left-1/4 z-10">
                    <div class="relative w-4 h-4 transform rotate-8">
                        <div class="absolute inset-0 rounded-full bg-gradient-to-br from-gray-400 to-gray-600"></div>
                        <div class="absolute top-1 left-1 w-1 h-0.5 bg-white/40 rounded-full"></div>
                        <div class="absolute top-1.5 left-1.5 w-1 h-1 bg-gray-800 rounded-full"></div>
                    </div>
                </div>

                <!-- Gwóźdź 3 - środek -->
                <div class="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
                    <div class="relative w-4 h-4 transform -rotate-5">
                        <div class="absolute inset-0 rounded-full bg-gradient-to-br from-gray-400 to-gray-600"></div>
                        <div class="absolute top-1 left-1 w-1 h-0.5 bg-white/40 rounded-full"></div>
                        <div class="absolute top-1.5 left-1.5 w-1 h-1 bg-gray-800 rounded-full"></div>
                    </div>
                </div>

                <!-- Gwóźdź 4 -->
                <div class="absolute top-8 right-1/4 z-10">
                    <div class="relative w-4 h-4 transform rotate-15">
                        <div class="absolute inset-0 rounded-full bg-gradient-to-br from-gray-400 to-gray-600"></div>
                        <div class="absolute top-1 right-1 w-1 h-0.5 bg-white/40 rounded-full"></div>
                        <div class="absolute top-1.5 right-1.5 w-1 h-1 bg-gray-800 rounded-full"></div>
                    </div>
                </div>

                <!-- Gwóźdź 5 - prawy -->
                <div class="absolute top-8 right-2 z-10">
                    <div class="relative w-4 h-4 transform rotate-12">
                        <div class="absolute inset-0 rounded-full bg-gradient-to-br from-gray-400 to-gray-600"></div>
                        <div class="absolute top-1 right-1 w-1 h-0.5 bg-white/40 rounded-full"></div>
                        <div class="absolute top-1.5 right-1.5 w-1 h-1 bg-gray-800 rounded-full"></div>
                    </div>
                </div>

                <div class="flex flex-wrap gap-8 pt-[4.8rem] justify-start">
                    @for (habit of habitService.habits(); track habit.id; let i = $index) {
                        <app-habit-tag
                                [habit]="habit"
                                [index]="i"
                                [showDeleteButton]="habitService.habits().length > 1">
                        </app-habit-tag>
                    }

                    <app-habit-tag
                            [isAddButton]="true"
                            [index]="habitService.habits().length">
                    </app-habit-tag>
                </div>
            </div>
        </div>

        <style>
            :root {
                --rope: #8B4513;
                --rope-dark: #654321;
                --rope-light: #A0522D;
                --rope-base: #7D4017;
                --rope-shadow: #4A2C14;
                --rope-highlight: #D2B48C;
                --rope-fiber-1: #8B4513;
                --rope-fiber-2: #654321;
                --rope-fiber-3: #A0522D;
                --rope-knot-light: #A67C52;
                --rope-knot-dark: #5C3317;
                --rope-knot-highlight: #D4A574;
            }

            .bg-rope { background-color: var(--rope); }
            .bg-rope-dark { background-color: var(--rope-dark); }
            .bg-rope-light { background-color: var(--rope-light); }
            .bg-rope-base { background-color: var(--rope-base); }
            .bg-rope-shadow { background-color: var(--rope-shadow); }
            .bg-rope-highlight { background-color: var(--rope-highlight); }
        </style>
    `
})
export class HabitListComponent {
    constructor(public habitService: HabitService) {}
}
