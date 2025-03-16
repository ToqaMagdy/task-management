import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Status } from '../../models/enums/status.enum';
import { Priority } from '../../models/enums/priority.enum';
import { Task } from '../../models/task.interface';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent {
  @Input() task: Task | null = null;
  @Output() formSubmit = new EventEmitter<Task>();

  isEditMode = false;
  taskId: number | null = null;
  taskForm: FormGroup;
  submitted = false;
  statusOptions = Object.values(Status);
  priorityOptions = Object.values(Priority);

  constructor(
    private readonly fb: FormBuilder,
    private readonly taskService: TaskService
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      status: [Status.TODO],
      dueDate: [this.formatDate(new Date())],
      priority: [Priority.LOW],
    });
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.task) {
      this.isEditMode = true;
      this.taskId = this.task.id;
      this.taskForm.patchValue(this.task);
      this.f['dueDate'].setValue(this.formatDate(this.task.dueDate));
    } else {
      this.isEditMode = false;
      this.taskForm.reset({
        status: Status.TODO,
        priority: Priority.LOW,
        dueDate: this.formatDate(new Date()),
      });
    }
  }

  get f() {
    return this.taskForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.taskForm.invalid) {
      return;
    }

    this.task = this.taskForm.value;

    if (this.isEditMode) {
      this.task!.id = this.taskId!;
      this.editTask();
    } else {
      this.createTask();
    }
  }

  resetForm(): void {
    this.submitted = false;
    this.taskForm.reset({
      status: Status.TODO,
      priority: Priority.LOW,
      dueDate: this.formatDate(new Date()),
    });
  }

  createTask(): void {
    this.taskService.createTask(this.task!).subscribe({
      next: () => {
        this.formSubmit.emit(this.task!);
      },
      error: () => {
        console.error('Failed to create task');
      },
    });
  }

  editTask(): void {
    this.taskService.updateTask(this.task!).subscribe({
      next: () => {
        this.formSubmit.emit(this.task!);
      },
      error: () => {
        console.error('Failed to update task');
      },
    });
  }
}
