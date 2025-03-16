import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-filter',
  imports: [FormsModule],
  templateUrl: './task-filter.component.html',
  styleUrl: './task-filter.component.css',
})
export class TaskFilterComponent {
  statusFilter: string = '';
  priorityFilter: string = '';

  @Output() filter = new EventEmitter<any>();

  applyFilters(): void {
    const params: any = {};

    if (this.statusFilter) {
      params.status = this.statusFilter;
    }

    if (this.priorityFilter) {
      params.priority = this.priorityFilter;
    }
    this.filter.emit(params);
  }

  resetFilters(): void {
    this.statusFilter = '';
    this.priorityFilter = '';
    this.filter.emit();
  }
}
