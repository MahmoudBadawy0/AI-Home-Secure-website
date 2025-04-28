import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface Log {
  id: number;
  timestamp: string;
  theftDetected: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private apiUrl = '/api/theft-alert'; // Replace with your actual API URL
  private logsUrl = '/api/theft-logs'; // Replace with your actual logs API URL

  constructor(private http: HttpClient) {}

  sendTheftSignal(theftDetected: boolean): Observable<void> {
    // Mock response; replace with actual HTTP call
    return of(undefined).pipe(delay(1000));
    // return this.http.post<void>(this.apiUrl, { theftDetected });
  }

  getTheftLogs(): Observable<Log[]> {
    // Mock response; replace with actual HTTP call
    const mockLogs: Log[] = [
      { id: 1, timestamp: '2025-04-27T14:30:00Z', theftDetected: true },
      { id: 2, timestamp: '2025-04-27T15:00:00Z', theftDetected: false },
      { id: 3, timestamp: '2025-04-27T16:00:00Z', theftDetected: true }
    ];
    return of(mockLogs).pipe(delay(1000));
    // return this.http.get<Log[]>(this.logsUrl);
  }
}
