import {
  Component,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Task } from '../../models/task.interface';
import { CommonModule } from '@angular/common';
import {
  NgbdSortableHeader,
  SortEvent,
} from '../../directives/ngbd-sortable-header.directive';
import { FormsModule } from '@angular/forms';

const compare = (v1: string | number | Date, v2: string | number | Date) =>
  v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, NgbdSortableHeader, FormsModule],
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<Task>();
  @Output() complete = new EventEmitter<Task>();

  
  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  onSort({ column, direction }: SortEvent) {
    for (const header of this.headers) {
      if (header.sortable !== column) {
        header.direction = '';
      }
    }

    if (!(direction === '' || column === '')) {
      this.tasks = [...this.tasks].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  
}
