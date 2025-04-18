import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { environments } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  decodedToken: any;

  constructor(private httpClient: HttpClient, private router: Router) {}

  sendRegisterForm(data: object): Observable<any> {
    return this.httpClient.post(
      `${environments.baseUrl}/api/v1/auth/signup`,
      data
    );
  }

  sendLoginForm(data: object): Observable<any> {
    return this.httpClient.post(
      `${environments.baseUrl}/api/v1/auth/signin`,
      data
    );
  }

  tokenDecode() {
    if (localStorage.getItem('token') !== null) {
      this.decodedToken = jwtDecode(localStorage.getItem('token')!);
    }
  }

  logOut(): void {
    localStorage.removeItem('token');
    this.decodedToken = null;
    this.router.navigate(['/login']);
  }

  setVerifyEmail(data: object): Observable<any> {
    return this.httpClient.post(
      `${environments.baseUrl}/api/v1/auth/forgotPasswords`,
      data
    );
  }

  setVerifyCode(data: object): Observable<any> {
    return this.httpClient.post(
      `${environments.baseUrl}/api/v1/auth/verifyResetCode`,
      data
    );
  }

  resetPassword(data: object): Observable<any> {
    return this.httpClient.put(
      `${environments.baseUrl}/api/v1/auth/resetPassword`,
      data
    );
  }
}
