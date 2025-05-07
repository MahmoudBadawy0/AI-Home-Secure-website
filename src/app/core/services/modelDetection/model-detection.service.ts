import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ModelDetectionService {
  constructor(private httpClient: HttpClient) {}

  startModel(): Observable<any> {
    return this.httpClient.post(`${environments.aiUrl}/start-camera`, {});
  }

  stopModel(): Observable<any> {
    return this.httpClient.post(`${environments.aiUrl}/stop-camera`, {
    });
  }
}
