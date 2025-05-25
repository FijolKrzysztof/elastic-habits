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
        <!-- Sznurek główny - skośny i realistyczny -->
        <div class="absolute top-8 left-4 right-4 h-3 transform -rotate-1">
          <!-- Główny sznurek -->
          <div class="relative w-full h-full bg-gradient-to-r from-rope-dark via-rope to-rope-dark rounded-full shadow-xl">
            <!-- Spleciona tekstura -->
            <div class="absolute inset-0 bg-repeat-x h-full rounded-full opacity-70"
                 style="background-image: repeating-linear-gradient(90deg,
                   transparent 0px,
                   rgba(139,69,19,0.4) 2px,
                   rgba(101,67,33,0.3) 4px,
                   transparent 6px,
                   rgba(160,82,45,0.2) 8px,
                   transparent 10px);
                   background-size: 10px 100%;">
            </div>
            <!-- Górny highlight -->
            <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rope-light to-transparent rounded-full opacity-80"></div>
            <!-- Dolny cień -->
            <div class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rope-dark/60 to-transparent rounded-full"></div>
            <!-- Włókna wystające -->
            <div class="absolute inset-0 bg-repeat-x h-full rounded-full opacity-30"
                 style="background-image: repeating-linear-gradient(85deg,
                   transparent 0px,
                   rgba(139,69,19,0.6) 1px,
                   transparent 2px);
                   background-size: 15px 100%;">
            </div>
          </div>

          <!-- Węzły i sploty -->
          <div class="absolute top-0 left-1/4 w-2 h-4 bg-rope-dark rounded-full transform rotate-12 shadow-md"></div>
          <div class="absolute top-0 right-1/3 w-1.5 h-3 bg-rope rounded-full transform -rotate-8 shadow-md"></div>
        </div>

        <!-- Punkty zaczepienia -->
        <div class="absolute top-6 left-2 w-5 h-5 bg-gradient-to-br from-metal-light to-metal-dark rounded-full shadow-lg border-2 border-metal-dark">
          <div class="absolute inset-1 bg-gradient-to-br from-metal-light via-metal to-metal-dark rounded-full"></div>
          <div class="absolute top-0.5 left-0.5 w-1 h-1 bg-white/40 rounded-full"></div>
        </div>
        <div class="absolute top-6 right-2 w-5 h-5 bg-gradient-to-br from-metal-light to-metal-dark rounded-full shadow-lg border-2 border-metal-dark">
          <div class="absolute inset-1 bg-gradient-to-br from-metal-light via-metal to-metal-dark rounded-full"></div>
          <div class="absolute top-0.5 left-0.5 w-1 h-1 bg-white/40 rounded-full"></div>
        </div>

        <!-- Metki -->
        <div class="flex flex-wrap gap-8 pt-20 justify-start">
          @for (habit of habitService.habits(); track habit.id; let i = $index) {
            <div class="relative group"
                 [style.margin-left]="getHorizontalOffset(i) + 'px'">

              <!-- Sznurek od głównego sznura do metki -->
              <div class="absolute origin-top z-10"
                   [style.top]="'-50px'"
                   [style.left]="'50%'"
                   [style.transform]="'translateX(-50%)'"
                   [style.height]="(50 + getRandomHang(i) + 8) + 'px'"
                   style="width: 2px; transform-origin: top center;">

                <div class="w-full h-full bg-gradient-to-b from-thread via-thread-dark to-thread-dark rounded-full shadow-sm">
                  <!-- Tekstura nitki -->
                  <div class="absolute inset-0 bg-repeat-y w-full opacity-50 rounded-full"
                       style="background-image: repeating-linear-gradient(180deg,
                         transparent 0px,
                         rgba(101,67,33,0.6) 1px,
                         rgba(74,44,23,0.4) 2px,
                         transparent 3px);
                         background-size: 100% 3px;">
                  </div>
                  <!-- Błysk nitki -->
                  <div class="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-thread-light/30 to-transparent rounded-full"></div>
                </div>

                <!-- Koniec sznurka przechodzi przez dziurkę -->
                <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-thread-dark rounded-full"></div>
              </div>

              <!-- Metka papierowa - subtelnie przekręcona -->
              <div class="relative transition-all duration-300 ease-out"
                   [style.transform]="'translateY(' + getRandomHang(i) + 'px) rotate(' + getSubtleRotation(i) + 'deg)'"
                   style="transform-origin: 50% 8px;">
                <button
                  (click)="habitService.setCurrentHabit(habit.id)"
                  class="relative w-24 h-16 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 group"
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

                <!-- Przycisk usuwania - wygląda jak mały gwóźdź -->
                @if (habitService.habits().length > 1) {
                  <button
                    (click)="habitService.deleteHabit(habit.id)"
                    class="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full hover:from-red-500 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 flex items-center justify-center group z-20 border-2 border-red-300"
                    title="Usuń nawyk"
                  >
                    <div class="w-3 h-3 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
                      <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                  </button>
                }

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
        --thread: #654321;
        --thread-light: #8B6914;
        --leather: #8B4513;
        --leather-dark: #654321;
        --metal: #C0C0C0;
        --metal-dark: #A0A0A0;
        --metal-light: #E8E8E8;
        --cream: #FFF8DC;
        --parchment: #F5E6D3;
        --parchment-dark: #E8D2B8;
        --parchment-border: #D4B896;
      }

      .bg-rope { background-color: var(--rope); }
      .bg-rope-dark { background-color: var(--rope-dark); }
      .bg-rope-light { background-color: var(--rope-light); }
      .bg-thread { background-color: var(--thread); }
      .bg-thread-dark { background-color: var(--thread-dark); }
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
