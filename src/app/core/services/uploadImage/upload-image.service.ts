import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { environments } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class UploadImageService {
  constructor(private httpClient: HttpClient, private router: Router) {}

  uploadImage(data: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    console.log(token);
    if (!token) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('No token'));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
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
