import {Component, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HabitService} from './services/habit.service';
import {Habit} from './models/habit.model';
import {HabitFormComponent} from './components/habit-form/habit-form.component';
import {HabitListComponent} from './components/habit-list/habit-list.component';
import {InfoSectionComponent} from './components/info-section/info-section.component';

@Component({
  selector: 'app-elastic-habits',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    HabitFormComponent,
    HabitListComponent,
    InfoSectionComponent
  ],
  templateUrl: './elastic-habits.component.html',
  styleUrls: ['./elastic-habits.component.scss']
})
export class ElasticHabitsComponent implements OnInit {
  habits: Habit[] = [];
  currentDate: Date = new Date();
  showAddHabitForm = false;
  importError = '';
  weekDays: Date[] = [];
  showSeoSection = true;
  editHabitId: number | null = null;
  showEditForm = false;

  constructor(private habitService: HabitService) {}

  ngOnInit(): void {
    this.habitService.getHabits().subscribe(habits => {
      this.habits = habits;
    });
    this.updateWeekDays();
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

  onHabitSubmit(habit: Habit): void {
    if (this.editHabitId) {
      this.habitService.updateHabit(habit);
      this.editHabitId = null;
      this.showEditForm = false;
    } else {
      this.habitService.addHabit(habit);
      this.showAddHabitForm = false;
    }
  }

  onDeleteHabit(habitId: number): void {
    this.habitService.deleteHabit(habitId);
  }

  onToggleLevel(event: {habitId: number, date: Date, levelIndex: number}): void {
    const habit = this.habits.find(h => h.id === event.habitId);
    if (!habit) return;

    const jsDay = event.date.getDay();
    if (!habit.activeDays[jsDay]) return;

    const dateStr = this.formatDate(event.date);

    if (!habit.tracking[dateStr] && habit.tracking[dateStr] !== 0) {
      habit.tracking[dateStr] = event.levelIndex;
    } else if (habit.tracking[dateStr] === event.levelIndex) {
      delete habit.tracking[dateStr];
    } else {
      habit.tracking[dateStr] = event.levelIndex;
    }

    this.habitService.updateHabit(habit);
  }

  exportData(): void {
    const dataStr = this.habitService.exportHabits();
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

        this.habitService.importHabits(importedData);
        event.target.value = null;
      } catch (error) {
        this.importError = 'An error occurred while importing data. Make sure the selected file is a valid JSON file.';
        console.error('Import error:', error);
      }
    };

    reader.readAsText(file);
  }

  changeWeek(direction: number): void {
    const newDate = new Date(this.currentDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    this.currentDate = newDate;
    this.updateWeekDays();
  }

  formatDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  displayDate(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return date.getDate() + ' ' + months[date.getMonth()];
  }

  onEditHabit(habitId: number): void {
    this.editHabitId = habitId;
    this.showEditForm = true;
    this.showAddHabitForm = false;
  }

  onFormCancel(): void {
    if (this.showEditForm) {
      this.showEditForm = false;
    } else {
      this.showAddHabitForm = false;
    }
    this.editHabitId = null;
  }

  getHabitToEdit(): Habit | null {
    if (!this.showEditForm) return null;
    return this.habits.find(h => h.id === this.editHabitId) || null;
  }

  showForm(): boolean {
    return this.showAddHabitForm || this.showEditForm;
  }

  toggleAddHabitForm(): void {
    this.showAddHabitForm = !this.showAddHabitForm;
    if (this.showAddHabitForm) {
      this.showEditForm = false;
      this.editHabitId = null;
    }
  }

  toggleSeoSection(): void {
    if (this.habits.length > 0) {
      this.showSeoSection = !this.showSeoSection;
    }
  }
}
