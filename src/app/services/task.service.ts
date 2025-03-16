import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Task } from '../models/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly apiUrl = 'http://localhost:8081/tasks'; // Backend endpoint

  constructor(private readonly http: HttpClient) {}

  getTasks(filters: any): Observable<Task[]> {
    if (filters) {
      return this.http.get<Task[]>(this.apiUrl, { params: filters }).pipe(
        catchError((error) => {
          console.error('Error fetching tasks', error);
          return throwError(() => new Error('Failed to fetch tasks'));
        })
      );
    }
    return this.http.get<Task[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching tasks', error);
        return throwError(() => new Error('Failed to fetch tasks'));
      })
    );
  }

  updateTask(task: Task): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/${task.id}`, task, {
      responseType: 'text' as 'json',
    });
  }

  updateTaskStatus(taskId: number, newStatus: string): Observable<string> {
    return this.http.patch<string>(
      `${this.apiUrl}/${taskId}/status?newStatus=${newStatus}`,
      {},
      { responseType: 'text' as 'json' }
    );
  }

  createTask(task: Task): Observable<string> {
    return this.http.post<string>(this.apiUrl, task, {
      responseType: 'text' as 'json',
    });
  }

  deleteTask(taskId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${taskId}`, {
      responseType: 'text' as 'json',
    });
  }
}
