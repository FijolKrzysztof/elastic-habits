import { Component, OnInit } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface Level {
  name: string;
  desc: string;
  color: string;
}

interface Habit {
  id: number;
  name: string;
  levels: Level[];
  tracking: { [key: string]: number };
  activeDays: boolean[];
  isWeekly: boolean;
}

@Component({
  selector: 'app-elastic-habits',
  standalone: true,
  imports: [NgForOf, NgClass, NgIf, FormsModule],
  templateUrl: './elastic-habits.component.html',
  styleUrls: ['./elastic-habits.component.scss'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0',
        overflow: 'hidden',
        opacity: '0',
        padding: '0'
      })),
      state('expanded', style({
        height: '*',
        opacity: '1'
      })),
      transition('expanded <=> collapsed', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class ElasticHabitsComponent implements OnInit {
  habits: Habit[] = [];
  newHabitName: string = '';
  newMiniDesc: string = '';
  newPlusDesc: string = '';
  newEliteDesc: string = '';
  currentDate: Date = new Date();
  showAddHabitForm: boolean = false;
  importError: string = '';
  weekDays: Date[] = [];
  selectedDays: boolean[] = [true, true, true, true, true, true, true];
  showSeoSection: boolean = true;
  editHabitId: number | null = null;
  showEditForm: boolean = false;
  isWeeklyHabit: boolean = false;

  ngOnInit(): void {
    const savedHabits = localStorage.getItem('elasticHabits');
    this.habits = savedHabits ? JSON.parse(savedHabits) : [];

    this.habits.forEach(habit => {
      if (!habit.activeDays) {
        habit.activeDays = [true, true, true, true, true, true, true];
      }
      if (habit.isWeekly === undefined) {
        habit.isWeekly = false;
      }
    });

    this.updateWeekDays();
    this.showAddHabitForm = false;
  }

  toggleSeoSection(): void {
    if (this.habits.length > 0) {
      this.showSeoSection = !this.showSeoSection;
    }
  }

  saveHabits(): void {
    localStorage.setItem('elasticHabits', JSON.stringify(this.habits));
  }

  formatDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  displayDate(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return date.getDate() + ' ' + months[date.getMonth()];
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  updateWeekDays(): void {
    const days: Date[] = [];
    const day = new Date(this.currentDate);
    const currentDay = day.getDay();
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;
    day.setDate(day.getDate() - daysFromMonday);

    for (let i = 0; i < 7; i++) {
      days.push(new Date(day));
      day.setDate(day.getDate() + 1);
    }
    this.weekDays = days;
  }

  getDayName(dayIndex: number): string {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][dayIndex % 7];
  }

  addHabit(): void {
    if (this.newHabitName.trim() === '') return;

    const jsDaysArray = this.isWeeklyHabit ?
      [true, true, true, true, true, true, true] :
      [
        this.selectedDays[6],
        this.selectedDays[0],
        this.selectedDays[1],
        this.selectedDays[2],
        this.selectedDays[3],
        this.selectedDays[4],
        this.selectedDays[5],
      ];

    const newHabit: Habit = {
      id: Date.now(),
      name: this.newHabitName,
      levels: [
        { name: "Mini", desc: this.newMiniDesc || "Basic level", color: "bg-green-600 text-white" },
        { name: "Plus", desc: this.newPlusDesc || "Medium level", color: "bg-blue-600 text-white" },
        { name: "Elite", desc: this.newEliteDesc || "Advanced level", color: "bg-red-600 text-white" }
      ],
      tracking: {},
      activeDays: jsDaysArray,
      isWeekly: this.isWeeklyHabit
    };

    this.habits.push(newHabit);
    this.clearForm();
    this.saveHabits();
  }

  toggleHabitType(): void {
    this.isWeeklyHabit = !this.isWeeklyHabit;
    if (this.isWeeklyHabit) {
      this.selectedDays = [true, true, true, true, true, true, true];
    }
  }

  toggleDaySelection(dayIndex: number): void {
    if (!this.isWeeklyHabit) {
      this.selectedDays[dayIndex] = !this.selectedDays[dayIndex];
    }
  }

  deleteHabit(habitId: number): void {
    const habit = this.habits.find(h => h.id === habitId);
    if (!habit) return;

    const confirmDelete = confirm(`Are you sure you want to delete the habit "${habit.name}"?`);
    if (!confirmDelete) return;

    this.habits = this.habits.filter(habit => habit.id !== habitId);
    this.saveHabits();
  }

  toggleHabitLevel(habitId: number, date: Date, levelIndex: number): void {
    const habit = this.habits.find(h => h.id === habitId);
    if (!habit) return;

    const jsDay = date.getDay();
    if (!habit.activeDays[jsDay]) return;

    const dateStr = this.formatDate(date);

    if (!habit.tracking[dateStr] && habit.tracking[dateStr] !== 0) {
      habit.tracking[dateStr] = levelIndex;
    } else if (habit.tracking[dateStr] === levelIndex) {
      delete habit.tracking[dateStr];
    } else {
      habit.tracking[dateStr] = levelIndex;
    }

    this.saveHabits();
  }

  changeWeek(direction: number): void {
    const newDate = new Date(this.currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    this.currentDate = newDate;
    this.updateWeekDays();
  }

  clearForm(): void {
    this.newHabitName = '';
    this.newMiniDesc = '';
    this.newPlusDesc = '';
    this.newEliteDesc = '';
    this.selectedDays = [true, true, true, true, true, true, true];
    this.isWeeklyHabit = false;
    this.showAddHabitForm = false;
  }

  exportData(): void {
    const dataStr = JSON.stringify(this.habits, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `elastic-habits-${new Date().toISOString().slice(0, 10)}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  importData(event: any): void {
    this.importError = '';
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const importedData = JSON.parse(e.target.result);

        if (!Array.isArray(importedData)) {
          this.importError = 'Invalid file format. The file must contain an array of habits.';
          return;
        }

        const isValidData = importedData.every((habit: any) =>
          habit.id &&
          habit.name &&
          Array.isArray(habit.levels) &&
          typeof habit.tracking === 'object'
        );

        if (!isValidData) {
          this.importError = 'Invalid data format. The habit structure is incorrect.';
          return;
        }

        importedData.forEach((habit: any) => {
          if (!habit.activeDays || !Array.isArray(habit.activeDays) || habit.activeDays.length !== 7) {
            habit.activeDays = [true, true, true, true, true, true, true];
          }
          if (habit.isWeekly === undefined) {
            habit.isWeekly = false;
          }
        });

        this.habits = importedData;
        this.saveHabits();
        event.target.value = null;
      } catch (error) {
        this.importError = 'An error occurred while importing data. Make sure the selected file is a valid JSON file.';
        console.error('Import error:', error);
      }
    };

    reader.readAsText(file);
  }

  getCompletedLevelIndex(habit: Habit, date: Date): number {
    const dateStr = this.formatDate(date);
    return habit.tracking[dateStr];
  }

  isLevelCompleted(habit: Habit, date: Date, levelIndex: number): boolean {
    const dateStr = this.formatDate(date);
    return habit.tracking[dateStr] === levelIndex;
  }

  isDayActive(habit: Habit, dayIndex: number): boolean {
    return habit.activeDays[dayIndex];
  }

  editHabit(habitId: number): void {
    const habit = this.habits.find(h => h.id === habitId);
    if (!habit) return;

    this.editHabitId = habitId;
    this.newHabitName = habit.name;
    this.newMiniDesc = habit.levels[0].desc;
    this.newPlusDesc = habit.levels[1].desc;
    this.newEliteDesc = habit.levels[2].desc;
    this.isWeeklyHabit = habit.isWeekly;

    if (!habit.isWeekly) {
      this.selectedDays = [
        habit.activeDays[1],
        habit.activeDays[2],
        habit.activeDays[3],
        habit.activeDays[4],
        habit.activeDays[5],
        habit.activeDays[6],
        habit.activeDays[0]
      ];
    } else {
      this.selectedDays = [true, true, true, true, true, true, true];
    }

    this.showEditForm = true;
    this.showAddHabitForm = false;
  }

  saveEditedHabit(): void {
    if (!this.editHabitId) return;

    const habitIndex = this.habits.findIndex(h => h.id === this.editHabitId);
    if (habitIndex === -1) return;

    const jsDaysArray = this.isWeeklyHabit ?
      [true, true, true, true, true, true, true] :
      [
        this.selectedDays[6],
        this.selectedDays[0],
        this.selectedDays[1],
        this.selectedDays[2],
        this.selectedDays[3],
        this.selectedDays[4],
        this.selectedDays[5]
      ];

    this.habits[habitIndex].name = this.newHabitName;
    this.habits[habitIndex].levels[0].desc = this.newMiniDesc;
    this.habits[habitIndex].levels[1].desc = this.newPlusDesc;
    this.habits[habitIndex].levels[2].desc = this.newEliteDesc;
    this.habits[habitIndex].activeDays = jsDaysArray;
    this.habits[habitIndex].isWeekly = this.isWeeklyHabit;

    this.saveHabits();
    this.cancelEdit();
  }

  cancelEdit(): void {
    this.editHabitId = null;
    this.showEditForm = false;
    this.clearForm();
  }
}
