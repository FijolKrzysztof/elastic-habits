import { Component, OnInit } from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

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
}

@Component({
  selector: 'app-elastic-habits',
  templateUrl: './elastic-habits.component.html',
  imports: [
    NgForOf,
    NgClass,
    NgIf,
    FormsModule
  ],
  standalone: true,
  styleUrls: ['./elastic-habits.component.scss']
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

  constructor() {}

  ngOnInit(): void {
    const savedHabits = localStorage.getItem('elasticHabits');
    this.habits = savedHabits ? JSON.parse(savedHabits) : [];

    this.habits.forEach(habit => {
      if (!habit.activeDays) {
        habit.activeDays = [true, true, true, true, true, true, true];
      }
    });

    this.updateWeekDays();
    this.showAddHabitForm = false;
  }

  saveHabits(): void {
    localStorage.setItem('elasticHabits', JSON.stringify(this.habits));
  }

  formatDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  displayDate(date: Date): string {
    return date.getDate() + '/' + (date.getMonth() + 1);
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

    // Adjust to start from Monday (1) instead of Sunday (0)
    const currentDay = day.getDay();
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;
    day.setDate(day.getDate() - daysFromMonday);

    for (let i = 0; i < 7; i++) {
      const date = new Date(day);
      days.push(date);
      day.setDate(day.getDate() + 1);
    }
    this.weekDays = days;
  }

  getDayName(dayIndex: number): string {
    // Rearrange days to start from Monday
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][dayIndex % 7];
  }

  addHabit(): void {
    if (this.newHabitName.trim() === '') return;

    // Convert days selection to match JavaScript day indices (where Sunday is 0)
    // Our app uses Monday as 0, Sunday as 6, but JavaScript uses Sunday as 0, Saturday as 6
    // So we need to rotate the array
    const jsDaysArray = [
      this.selectedDays[6],  // Sunday (JS: 0) from our Sunday (our: 6)
      this.selectedDays[0],  // Monday (JS: 1) from our Monday (our: 0)
      this.selectedDays[1],  // Tuesday (JS: 2) from our Tuesday (our: 1)
      this.selectedDays[2],  // Wednesday (JS: 3) from our Wednesday (our: 2)
      this.selectedDays[3],  // Thursday (JS: 4) from our Thursday (our: 3)
      this.selectedDays[4],  // Friday (JS: 5) from our Friday (our: 4)
      this.selectedDays[5],  // Saturday (JS: 6) from our Saturday (our: 5)
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
      activeDays: jsDaysArray
    };

    this.habits.push(newHabit);
    this.clearForm();
    this.saveHabits();
  }

  // Add confirmation before delete
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

    // Convert JavaScript day (0=Sunday) to our app's day index (0=Monday)
    const jsDay = date.getDay(); // 0=Sunday, 1=Monday, etc.
    const dayIndex = jsDay === 0 ? 6 : jsDay - 1; // Transform to 0=Monday, 6=Sunday

    if (!habit.activeDays[dayIndex]) return;

    const dateStr = this.formatDate(date);

    if (!habit.tracking[dateStr]) {
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

    if (!file) {
      return;
    }

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
    // Convert JavaScript day index to our app's day index (0=Monday, 6=Sunday)
    const appDayIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    return habit.activeDays[appDayIndex];
  }

  toggleDaySelection(dayIndex: number): void {
    this.selectedDays[dayIndex] = !this.selectedDays[dayIndex];
  }
}
