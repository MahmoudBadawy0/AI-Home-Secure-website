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

  getHistory(): Observable<any> {
    return this.http.get(environments.baseUrl + '/api/history');
  }









}
