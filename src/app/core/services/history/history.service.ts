import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environments } from '../../environments/environments';

interface Log {
  id: number;
  timestamp: string;
  theftDetected: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  constructor(private http: HttpClient) {}

  getLog(): Observable<any> {
    return this.http.get(environments.baseUrl + '/api/history');
  }

  getTheftLogs(): Observable<Log[]> {
    // Mock response; replace with actual HTTP call
    const mockLogs: Log[] = [
      { id: 1, timestamp: '2025-04-27T14:30:00Z', theftDetected: true },
      { id: 2, timestamp: '2025-04-27T15:00:00Z', theftDetected: false },
      { id: 3, timestamp: '2025-04-27T16:00:00Z', theftDetected: true },
    ];
    return of(mockLogs).pipe(delay(1000));
    // return this.http.get<Log[]>(this.logsUrl);
  }
}
