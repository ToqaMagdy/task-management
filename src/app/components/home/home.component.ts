import { Component, inject, QueryList, ViewChildren } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Task } from '../../models/task.interface';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskListComponent } from '../task-list/task-list.component';
import { NgbdSortableHeader } from '../../directives/ngbd-sortable-header.directive';
import { TaskFilterComponent } from '../task-filter/task-filter.component';

@Component({
  selector: 'app-home',
  imports: [TaskListComponent, TaskFormComponent, TaskFilterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  tasks: Task[] = [];
  action = 'Create';
  selectedTask: Task | null = null;
  private readonly modalService = inject(NgbModal);

  constructor(private readonly taskService: TaskService) {
    this.getTasks();
  }

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  getTasks() {
    this.taskService.getTasks(null).subscribe((tasks) => (this.tasks = tasks));
  }

  openModal(content: any, task: Task | null = null) {
    this.selectedTask = task;
    this.modalService.open(content, { centered: true }).result.finally(() => {
      this.getTasks();
      this.closeModal();
    });
  }

  editTask(task: Task, content: any) {
    this.action = 'Edit';
    this.openModal(content, task);
  }

  deleteTask(task: Task) {
    this.taskService.deleteTask(task.id).subscribe(() => this.getTasks());
  }

  markAsCompleted(task: Task) {
    this.taskService
      .updateTaskStatus(task.id, 'COMPLETED')
      .subscribe(() => this.getTasks());
  }

  applyFilters($event: any) {
    console.log($event);
    this.taskService
      .getTasks($event)
      .subscribe((tasks) => (this.tasks = tasks));
  }

  closeModal() {
    this.modalService.dismissAll();
  }
}
