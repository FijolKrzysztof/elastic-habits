import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {HabitService} from '../services/habit.service';

@Component({
  selector: 'app-habit-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-8 px-4">
      <div class="flex items-center gap-3 mb-8">
        <h2 class="text-2xl font-bold text-gray-800 font-serif">Twoje nawyki</h2>
        <button
          (click)="showAddHabit.set(true)"
          class="flex items-center gap-2 px-4 py-2 bg-leather text-cream rounded-md hover:bg-leather-dark transition-all duration-300 shadow-lg font-medium text-sm border border-leather-dark"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Dodaj metkę
        </button>
      </div>

      <!-- Sznurek z metkami -->
      <div class="relative min-h-40 p-4">
        <!-- Sznurek główny - bardziej realistyczny -->
        <div class="absolute top-8 left-4 right-4 h-4 transform -rotate-1">
          <!-- Główny sznurek z wielowarstwową strukturą -->
          <div class="relative w-full h-full">
            <!-- Bazowa warstwa sznurka -->
            <div class="absolute inset-0 bg-gradient-to-b from-rope-shadow via-rope-base to-rope-dark rounded-full">
              <!-- Pierwsza warstwa - główny kolor -->
              <div class="absolute inset-0 bg-gradient-to-b from-rope-light via-rope to-rope-dark rounded-full"></div>

              <!-- Druga warstwa - struktura splotu -->
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

              <!-- Trzecia warstwa - spiralne włókna -->
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

              <!-- Górny highlight dla 3D efektu -->
              <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-rope-highlight to-transparent rounded-full opacity-70"></div>

              <!-- Dolny cień dla głębi -->
              <div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-rope-shadow to-transparent rounded-full opacity-80"></div>

              <!-- Boczne cienie -->
              <div class="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-r from-rope-shadow to-transparent rounded-l-full opacity-60"></div>
              <div class="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-l from-rope-shadow to-transparent rounded-r-full opacity-60"></div>

              <!-- Wystające włókna -->
              <div class="absolute inset-0 opacity-40 rounded-full"
                   style="background-image:
                     radial-gradient(ellipse 1px 8px at 20% 30%, rgba(139,69,19,0.8) 0%, transparent 70%),
                     radial-gradient(ellipse 1px 6px at 60% 80%, rgba(101,67,33,0.6) 0%, transparent 70%),
                     radial-gradient(ellipse 1px 7px at 40% 15%, rgba(160,82,45,0.7) 0%, transparent 70%),
                     radial-gradient(ellipse 1px 5px at 80% 60%, rgba(139,69,19,0.5) 0%, transparent 70%),
                     radial-gradient(ellipse 1px 9px at 10% 90%, rgba(101,67,33,0.8) 0%, transparent 70%);
                   background-size: 15px 15px, 20px 20px, 18px 18px, 12px 12px, 25px 25px;">
              </div>

              <!-- Miejscowe strzępienia i nierówności -->
              <div class="absolute inset-0 opacity-30 rounded-full"
                   style="background-image:
                     radial-gradient(circle 2px at 25% 40%, rgba(101,67,33,0.8) 0%, transparent 50%),
                     radial-gradient(circle 1px at 70% 20%, rgba(139,69,19,0.9) 0%, transparent 40%),
                     radial-gradient(circle 3px at 45% 75%, rgba(160,82,45,0.6) 0%, transparent 60%),
                     radial-gradient(circle 1px at 85% 85%, rgba(101,67,33,0.7) 0%, transparent 45%);
                   background-size: 30px 30px, 25px 25px, 35px 35px, 20px 20px;">
              </div>
            </div>

            <!-- Zewnętrzny cień sznurka na ścianie -->
            <div class="absolute top-2 left-1 right-0 h-4 bg-gradient-to-b from-black/20 via-black/15 to-black/10 rounded-full blur-sm transform rotate-0.5"></div>
          </div>

          <!-- Węzły i nieregularności na sznurku -->
          <div class="absolute top-0.5 left-1/4 w-3 h-5 bg-gradient-to-br from-rope-knot-light to-rope-knot-dark rounded-full transform rotate-12 shadow-lg opacity-90">
            <div class="absolute inset-0.5 bg-gradient-to-br from-rope-knot-highlight to-transparent rounded-full opacity-60"></div>
          </div>
          <div class="absolute top-0.5 right-1/3 w-2.5 h-4 bg-gradient-to-br from-rope-knot-light to-rope-knot-dark rounded-full transform -rotate-8 shadow-md opacity-85">
            <div class="absolute inset-0.5 bg-gradient-to-br from-rope-knot-highlight to-transparent rounded-full opacity-50"></div>
          </div>
          <div class="absolute top-1 left-2/3 w-2 h-3 bg-gradient-to-br from-rope-knot-light to-rope-knot-dark rounded-full transform rotate-15 shadow-md opacity-75"></div>
        </div>

        <!-- Punkty zaczepienia - bardziej realistyczne -->
        <div class="absolute top-6 left-2 w-6 h-6 bg-gradient-to-br from-metal-light to-metal-dark rounded-full shadow-xl border-2 border-metal-darker">
          <div class="absolute inset-1 bg-gradient-to-br from-metal-light via-metal to-metal-dark rounded-full">
            <div class="absolute inset-0.5 bg-gradient-to-br from-metal-bright to-metal-mid rounded-full"></div>
          </div>
          <div class="absolute top-1 left-1 w-2 h-2 bg-white/60 rounded-full blur-sm"></div>
          <div class="absolute top-0.5 left-0.5 w-1 h-1 bg-white/80 rounded-full"></div>
          <!-- Śruby/gwoździe w punkcie zaczepienia -->
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-metal-darker rounded-full"></div>
        </div>
        <div class="absolute top-6 right-2 w-6 h-6 bg-gradient-to-br from-metal-light to-metal-dark rounded-full shadow-xl border-2 border-metal-darker">
          <div class="absolute inset-1 bg-gradient-to-br from-metal-light via-metal to-metal-dark rounded-full">
            <div class="absolute inset-0.5 bg-gradient-to-br from-metal-bright to-metal-mid rounded-full"></div>
          </div>
          <div class="absolute top-1 left-1 w-2 h-2 bg-white/60 rounded-full blur-sm"></div>
          <div class="absolute top-0.5 left-0.5 w-1 h-1 bg-white/80 rounded-full"></div>
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-metal-darker rounded-full"></div>
        </div>

        <!-- Metki -->
        <div class="flex flex-wrap gap-8 pt-20 justify-start">
          @for (habit of habitService.habits(); track habit.id; let i = $index) {
            <div class="relative group"
                 [style.margin-left]="getHorizontalOffset(i) + 'px'">

              <!-- Sznurek od głównego sznura do metki - bardziej realistyczny -->
              <div class="absolute origin-top z-10"
                   [style.top]="'-52px'"
                   [style.left]="'50%'"
                   [style.transform]="'translateX(-50%)'"
                   [style.height]="(52 + getRandomHang(i) + 8) + 'px'"
                   style="width: 3px; transform-origin: top center;">

                <div class="relative w-full h-full">
                  <!-- Główna nitka -->
                  <div class="absolute inset-0 bg-gradient-to-b from-thread-light via-thread to-thread-dark rounded-full shadow-sm">
                    <!-- Struktura skręconych włókien -->
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

                    <!-- Highlight dla 3D efektu -->
                    <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-thread-highlight/60 to-transparent rounded-full"></div>

                    <!-- Cień po prawej stronie -->
                    <div class="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-thread-shadow to-thread-shadow/80 rounded-full"></div>

                    <!-- Drobne włókna wystające -->
                    <div class="absolute inset-0 opacity-50 rounded-full"
                         style="background-image:
                           radial-gradient(ellipse 0.5px 3px at 30% 20%, rgba(139,69,19,0.8) 0%, transparent 70%),
                           radial-gradient(ellipse 0.5px 2px at 70% 60%, rgba(101,67,33,0.6) 0%, transparent 70%),
                           radial-gradient(ellipse 0.5px 4px at 20% 80%, rgba(160,82,45,0.7) 0%, transparent 70%);
                         background-size: 8px 8px, 12px 12px, 6px 6px;">
                    </div>
                  </div>

                  <!-- Cień nitki -->
                  <div class="absolute top-0 left-1 w-3 h-full bg-gradient-to-b from-black/15 via-black/10 to-black/5 rounded-full blur-sm"></div>
                </div>

                <!-- Przycisk do przecięcia nitki - tylko jeśli więcej niż 1 nawyk -->
                @if (habitService.habits().length > 1) {
                  <button
                    (click)="habitService.deleteHabit(habit.id)"
                    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-red-500 to-red-700 rounded-full hover:from-red-600 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110 flex items-center justify-center group z-30 border-2 border-red-400"
                    title="Przetnij nitkę"
                  >
                    <!-- Ikona nożyczek -->
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.5 2a3.5 3.5 0 101.665 6.58L8.585 10l-1.42 1.42A3.5 3.5 0 105.5 18a3.5 3.5 0 001.665-6.58L8.585 10l1.42-1.42A3.5 3.5 0 1014.5 2a3.5 3.5 0 00-1.665 6.58L11.415 10l1.42 1.42A3.5 3.5 0 1014.5 18a3.5 3.5 0 00-1.665-6.58L11.415 10l-1.42-1.42A3.5 3.5 0 1014.5 2zM5.5 4a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm9 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM5.5 13a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm9 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" clip-rule="evenodd"></path>
                    </svg>
                  </button>
                }

                <!-- Koniec sznurka przechodzi przez dziurkę -->
                <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-4 bg-gradient-to-b from-thread to-thread-dark rounded-full shadow-sm"></div>
              </div>

              <!-- Metka papierowa - subtelnie przekręcona -->
              <div class="relative transition-all duration-300 ease-out"
                   [style.transform]="'translateY(' + getRandomHang(i) + 'px) rotate(' + getSubtleRotation(i) + 'deg)'"
                   style="transform-origin: 50% 8px;">
                <button
                  (click)="habitService.setCurrentHabit(habit.id)"
                  class="relative w-24 h-16 font-medium transition-all duration-300 focus:outline-none group"
                  [class]="habit.id === habitService.currentHabitId()
                    ? 'text-gray-800 shadow-2xl scale-110 z-10'
                    : 'text-gray-700 hover:text-gray-900 shadow-xl hover:shadow-2xl'"
                >
                  <!-- Metka - kształt i tło -->
                  <div class="absolute inset-0 rounded-sm transform rotate-1"
                       [style.background]="getTagBackground(habit.color)"
                       style="
                         clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 0 100%, 6px 50%);
                         box-shadow:
                           0 8px 16px rgba(0,0,0,0.25),
                           0 4px 8px rgba(0,0,0,0.15),
                           inset 0 1px 0 rgba(255,255,255,0.4),
                           inset 0 -1px 0 rgba(0,0,0,0.1),
                           inset 2px 0 4px rgba(0,0,0,0.05);
                       ">
                    <!-- Tekstura papieru -->
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

                    <!-- Highlight papieru -->
                    <div class="absolute top-0 left-2 right-4 h-4 bg-gradient-to-b from-white/20 to-transparent rounded-sm"
                         style="clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 0 100%, 6px 50%);">
                    </div>
                  </div>

                  <!-- Dziurka w metce - na środku górnej krawędzi -->
                  <div class="absolute left-1/2 top-2 w-3 h-3 bg-white rounded-full border-2 border-gray-400 shadow-inner z-10 transform -translate-x-1/2">
                    <div class="absolute inset-0.5 bg-gradient-to-br from-gray-50 to-gray-200 rounded-full"></div>
                    <!-- Metalowy pierścień wzmacniający -->
                    <div class="absolute inset-0 border border-gray-500 rounded-full"></div>
                  </div>

                  <!-- Tekst na metce -->
                  <div class="absolute inset-0 flex items-center justify-center px-2">
                    <span class="text-xs font-bold drop-shadow-sm text-center leading-tight max-w-full overflow-hidden line-clamp-2 font-serif"
                          [style.color]="getTextColor(habit.color)">
                      {{ habit.name }}
                    </span>
                  </div>

                  <!-- Wytarcia i zniszczenia -->
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

                <!-- Cień metki na powierzchni -->
                <div class="absolute inset-0 top-2 left-1 bg-black/20 blur-sm rounded-sm transform rotate-1 -z-10"
                     style="clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 0 100%, 6px 50%);">
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>

    @if (showAddHabit()) {
      <div class="mb-6 p-6 bg-gradient-to-br from-parchment to-parchment-dark rounded-lg shadow-2xl border-2 border-parchment-border relative overflow-hidden">
        <!-- Tekstura pergaminu -->
        <div class="absolute inset-0 opacity-10 bg-repeat"
             style="background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22><g fill=%22%238B4513%22 opacity=%220.3%22><circle cx=%2215%22 cy=%2215%22 r=%220.5%22/><circle cx=%2245%22 cy=%2235%22 r=%220.5%22/><circle cx=%2225%22 cy=%2245%22 r=%220.5%22/></g></svg>');">
        </div>

        <h3 class="font-bold mb-4 text-leather-dark flex items-center gap-2 text-lg font-serif relative z-10">
          <svg class="w-6 h-6 text-leather" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
          Dodaj nową metkę
        </h3>

        <div class="flex gap-4 relative z-10">
          <input
            type="text"
            [(ngModel)]="newHabitName"
            placeholder="Nazwa nawyku..."
            class="flex-1 px-4 py-3 border-2 border-parchment-border rounded-md focus:outline-none focus:ring-2 focus:ring-leather focus:border-leather bg-cream/90 backdrop-blur-sm shadow-inner font-serif placeholder-gray-500"
            (keyup.enter)="addHabit()"
          />
          <button
            (click)="addHabit()"
            class="px-6 py-3 bg-gradient-to-br from-emerald-500 to-emerald-700 text-cream rounded-md hover:from-emerald-600 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-bold text-sm border border-emerald-600"
          >
            Dodaj
          </button>
          <button
            (click)="cancelAdd()"
            class="px-6 py-3 bg-gradient-to-br from-stone-400 to-stone-600 text-cream rounded-md hover:from-stone-500 hover:to-stone-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-bold text-sm border border-stone-500"
          >
            Anuluj
          </button>
        </div>
      </div>
    }

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

        --thread: #654321;
        --thread-dark: #4A2C14;
        --thread-light: #8B6914;
        --thread-highlight: #B8860B;
        --thread-shadow: #3E2723;

        --leather: #8B4513;
        --leather-dark: #654321;

        --metal: #C0C0C0;
        --metal-dark: #A0A0A0;
        --metal-light: #E8E8E8;
        --metal-bright: #F5F5F5;
        --metal-mid: #D3D3D3;
        --metal-darker: #808080;

        --cream: #FFF8DC;
        --parchment: #F5E6D3;
        --parchment-dark: #E8D2B8;
        --parchment-border: #D4B896;
      }

      .bg-rope { background-color: var(--rope); }
      .bg-rope-dark { background-color: var(--rope-dark); }
      .bg-rope-light { background-color: var(--rope-light); }
      .bg-rope-base { background-color: var(--rope-base); }
      .bg-rope-shadow { background-color: var(--rope-shadow); }
      .bg-rope-highlight { background-color: var(--rope-highlight); }

      .bg-thread { background-color: var(--thread); }
      .bg-thread-dark { background-color: var(--thread-dark); }
      .bg-thread-light { background-color: var(--thread-light); }

      .bg-leather { background-color: var(--leather); }
      .bg-leather-dark { background-color: var(--leather-dark); }
      .hover\\:bg-leather-dark:hover { background-color: var(--leather-dark); }

      .bg-metal { background-color: var(--metal); }
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
      .border-metal-dark { border-color: var(--metal-dark); }

      /* Usunięcie wszystkich obramowań focus */
      button:focus {
        outline: none !important;
        box-shadow: none !important;
      }

      /* Efekt zmięcia papieru */
      button:active .absolute[style*="clip-path"] {
        transform: scale(0.98) rotate(2deg);
        box-shadow:
          0 4px 8px rgba(0,0,0,0.3),
          inset 0 2px 4px rgba(0,0,0,0.1);
      }

      /* Linie pomocnicze dla czytania */
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    </style>
  `
})
export class HabitListComponent {
  showAddHabit = signal(false);
  newHabitName = '';

  constructor(public habitService: HabitService) {}

  addHabit(): void {
    if (this.newHabitName.trim()) {
      this.habitService.addHabit(this.newHabitName);
      this.newHabitName = '';
      this.showAddHabit.set(false);
    }
  }

  cancelAdd(): void {
    this.newHabitName = '';
    this.showAddHabit.set(false);
  }

  getTagBackground(color: string): string {
    // Tworzy gradient przypominający stary papier z podanym kolorem
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
    // Prosta funkcja do określenia czy tekst powinien być jasny czy ciemny
    // W prawdziwej aplikacji można użyć bardziej zaawansowanego algorytmu
    const darkColors = ['#000', '#333', '#555', '#800', '#008', '#080'];
    const isDark = darkColors.some(dark => backgroundColor.toLowerCase().includes(dark.slice(1)));
    return isDark ? '#f5f5f5' : '#2d1810';
  }

  // Funkcje do tworzenia nieregularnego wiszenia
  getRandomHang(index: number): number {
    // Używamy indeksu jako seed dla konsystentnych wyników
    const pseudo = Math.sin(index * 12.9898) * 43758.5453;
    const normalized = pseudo - Math.floor(pseudo);
    return Math.floor(normalized * 30) + 10; // Od 10 do 40px w dół
  }

  getRandomRotation(index: number): number {
    // Obrót całej metki z nitką
    const pseudo = Math.sin(index * 78.233) * 43758.5453;
    const normalized = pseudo - Math.floor(pseudo);
    return (normalized * 8) - 4; // Od -4 do 4 stopni
  }

  getHeavyTilt(index: number): number {
    // Mocny przechył metki przez grawitację - znacznie bardziej w dół
    const pseudo = Math.sin(index * 23.456) * 43758.5453;
    const normalized = pseudo - Math.floor(pseudo);
    return (normalized * 35) + 15; // Od 15 do 50 stopni w dół - bardzo przekręcone!
  }

  getRandomTilt(index: number): number {
    // Stara funkcja - zostawiam dla kompatybilności
    return this.getHeavyTilt(index);
  }

  getHorizontalOffset(index: number): number {
    // Losowe przesunięcie w poziomie
    const pseudo = Math.sin(index * 45.678) * 43758.5453;
    const normalized = pseudo - Math.floor(pseudo);
    return Math.floor(normalized * 50) - 25; // Od -25 do 25px - więcej rozrzutu
  }

  getStringLength(index: number): number {
    // Długość sznurka do metki - dokładnie dopasowana
    const baseLength = 50; // Podstawowa długość
    return baseLength; // Konsystentna długość, wysokość jest dodawana przez hang
  }

  getSubtleRotation(index: number): number {
    // Subtelny obrót metki - małe przekręcenie
    const pseudo = Math.sin(index * 34.567) * 43758.5453;
    const normalized = pseudo - Math.floor(pseudo);
    return (normalized * 12) - 6; // Od -6 do +6 stopni - subtelne przekręcenie
  }
}
