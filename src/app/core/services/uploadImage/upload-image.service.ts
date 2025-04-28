import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environments } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class UploadImageService {
  token = localStorage.getItem('token');

  constructor(private httpClient: HttpClient, private router: Router) {}

  uploadImage(data: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    return this.httpClient.post(
      `${environments.baseUrl}/api/Images/upload-image-user`,
      data,
      {
        headers,
        withCredentials: true,
      }
    );
  }
}
