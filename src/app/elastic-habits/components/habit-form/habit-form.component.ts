import {Component, Input, Output, EventEmitter, OnInit, inject} from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Habit } from '../../models/habit.model';
import {AnalyticsService} from '../../../services/analytics.service';

@Component({
  selector: 'app-habit-form',
  standalone: true,
  imports: [NgForOf, NgClass, NgIf, FormsModule],
  templateUrl: './habit-form.component.html',
})
export class HabitFormComponent implements OnInit {
  @Input() editMode = false;
  @Input() habitToEdit: Habit | null = null;
  @Output() submitHabit = new EventEmitter<Habit>();
  @Output() cancel = new EventEmitter<void>();

  private readonly analytics = inject(AnalyticsService);

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
          this.habitToEdit.activeDays[0],
          this.habitToEdit.activeDays[1],
          this.habitToEdit.activeDays[2],
          this.habitToEdit.activeDays[3],
          this.habitToEdit.activeDays[4],
          this.habitToEdit.activeDays[5],
          this.habitToEdit.activeDays[6],
        ];
      }
    }
  }

  onSubmit(): void {
    if (this.newHabitName.trim() === '') return;

    const jsDaysArray = this.isWeeklyHabit ?
      [true, true, true, true, true, true, true] :
      [
        this.selectedDays[0],
        this.selectedDays[1],
        this.selectedDays[2],
        this.selectedDays[3],
        this.selectedDays[4],
        this.selectedDays[5],
        this.selectedDays[6],
      ];

    const habit: Habit = {
      id: this.editMode && this.habitToEdit ? this.habitToEdit.id : Date.now(),
      name: this.newHabitName,
      levels: [
        { name: "Mini", desc: this.newMiniDesc || "Basic level", color: "bg-green-600 text-white" },
        { name: "Plus", desc: this.newPlusDesc || "Medium level", color: "bg-blue-600 text-white" },
        { name: "Elite", desc: this.newEliteDesc || "Advanced level", color: "bg-red-600 text-white" }
      ],
      tracking: this.editMode && this.habitToEdit ? this.habitToEdit.tracking : {},
      activeDays: jsDaysArray,
      isWeekly: this.isWeeklyHabit
    };

    this.submitHabit.emit(habit);
    this.clearForm();

    this.analytics.event('form_submitted', {
      category: 'Form',
      is_edit_mode: this.editMode,
      habit_name: this.newHabitName,
      is_weekly: this.isWeeklyHabit,
      selected_days_count: this.selectedDays.filter(day => day).length
    });
  }

  toggleHabitType(): void {
    this.isWeeklyHabit = !this.isWeeklyHabit;
    if (this.isWeeklyHabit) {
      this.selectedDays = [true, true, true, true, true, true, true];
    }

    this.analytics.event('habit_type_changed', {
      category: 'Form',
      new_type: this.isWeeklyHabit ? 'weekly' : 'daily'
    });
  }

  toggleDaySelection(dayIndex: number): void {
    if (!this.isWeeklyHabit) {
      this.selectedDays[dayIndex] = !this.selectedDays[dayIndex];

      this.analytics.event('day_selection_changed', {
        category: 'Form',
        day_index: dayIndex,
        is_selected: this.selectedDays[dayIndex]
      });
    }
  }

  private clearForm(): void {
    this.newHabitName = '';
    this.newMiniDesc = '';
    this.newPlusDesc = '';
    this.newEliteDesc = '';
    this.selectedDays = [true, true, true, true, true, true, true];
    this.isWeeklyHabit = false;
  }

  onCancel(): void {
    this.analytics.event('habit_form_cancelled', {
      category: 'Form',
      is_edit_mode: this.editMode,
      had_name: this.newHabitName.trim() !== '',
      had_descriptions: {
        mini: this.newMiniDesc.trim() !== '',
        plus: this.newPlusDesc.trim() !== '',
        elite: this.newEliteDesc.trim() !== ''
      },
      selected_days_count: this.selectedDays.filter(day => day).length,
      is_weekly_selected: this.isWeeklyHabit
    });

    this.cancel.emit();
    this.clearForm();
  }
}
