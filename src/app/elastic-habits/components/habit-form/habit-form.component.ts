import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Habit } from '../../models/habit.model';

@Component({
  selector: 'app-habit-form',
  standalone: true,
  imports: [NgForOf, NgClass, NgIf, FormsModule],
  templateUrl: './habit-form.component.html',
})
export class HabitFormComponent {
  @Input() editMode = false;
  @Input() habitToEdit: Habit | null = null;
  @Output() submitHabit = new EventEmitter<Habit>();
  @Output() cancel = new EventEmitter<void>();

  newHabitName = '';
  newMiniDesc = '';
  newPlusDesc = '';
  newEliteDesc = '';
  selectedDays: boolean[] = [true, true, true, true, true, true, true];
  isWeeklyHabit = false;

  ngOnInit(): void {
    if (this.editMode && this.habitToEdit) {
      this.newHabitName = this.habitToEdit.name;
      this.newMiniDesc = this.habitToEdit.levels[0].desc;
      this.newPlusDesc = this.habitToEdit.levels[1].desc;
      this.newEliteDesc = this.habitToEdit.levels[2].desc;
      this.isWeeklyHabit = this.habitToEdit.isWeekly;

      if (!this.habitToEdit.isWeekly) {
        this.selectedDays = [
          this.habitToEdit.activeDays[1],
          this.habitToEdit.activeDays[2],
          this.habitToEdit.activeDays[3],
          this.habitToEdit.activeDays[4],
          this.habitToEdit.activeDays[5],
          this.habitToEdit.activeDays[6],
          this.habitToEdit.activeDays[0]
        ];
      }
    }
  }

  onSubmit(): void {
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

    const habit: Habit = {
      id: this.editMode && this.habitToEdit ? this.habitToEdit.id : Date.now(),
      name: this.newHabitName,
      levels: [
        { name: "Mini", desc: this.newMiniDesc || "Basic level", color: "text-green-500" },
        { name: "Plus", desc: this.newPlusDesc || "Medium level", color: "text-blue-500" },
        { name: "Elite", desc: this.newEliteDesc || "Advanced level", color: "text-red-500" }
      ],
      tracking: this.editMode && this.habitToEdit ? this.habitToEdit.tracking : {},
      activeDays: jsDaysArray,
      isWeekly: this.isWeeklyHabit
    };

    this.submitHabit.emit(habit);
    this.clearForm();
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

  clearForm(): void {
    this.newHabitName = '';
    this.newMiniDesc = '';
    this.newPlusDesc = '';
    this.newEliteDesc = '';
    this.selectedDays = [true, true, true, true, true, true, true];
    this.isWeeklyHabit = false;
  }

  onCancel(): void {
    this.cancel.emit();
    this.clearForm();
  }
}
