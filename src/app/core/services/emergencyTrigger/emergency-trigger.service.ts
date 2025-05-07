import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmergencyTriggerService {
  constructor(private httpClient: HttpClient) {}

  startCall(): Observable<any> {
    return this.httpClient.post(`${environments.aiUrl}/start-call`, {});
  }

  stopCall(): Observable<any> {
    return this.httpClient.post(`${environments.aiUrl}/stop-call`, {
      message: 'Call stopped.',
    });
  }
}
