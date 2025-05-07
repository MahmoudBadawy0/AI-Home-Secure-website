import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { environments } from '../../environments/environments';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  decodedToken: any;
  private isBrowser: boolean;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.tokenDecode();
    }
  }

  sendRegisterForm(data: object): Observable<any> {
    return this.httpClient.post(
      `${environments.baseUrl}/api/Account/register`,
      data,
      {
        withCredentials: true,
      }
    );
  }

  sendLoginForm(data: object): Observable<any> {
    return this.httpClient.post(
      `${environments.baseUrl}/api/Account/login`,
      data,
      {
        withCredentials: true,
      }
    );
  }

  tokenDecode() {
    if (this.isBrowser) {
      if (localStorage.getItem('token') !== null) {
        this.decodedToken = jwtDecode(localStorage.getItem('token')!);
      }
    }
  }

  logOut(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
    }
    this.decodedToken = null;
    this.router.navigate(['/login']);
  }

  changePassword(data: object): Observable<any> {
    let token: string | null = null;
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.httpClient.post(
      `${environments.baseUrl}/api/Account/Change-Password`,
      data,
      {
        headers,
        responseType: 'text',
        withCredentials: true,
      }
    );
  }

  // forgot password
  // verify email and send code to email
  // setVerifyEmail(data: object): Observable<any> {
  //   return this.httpClient.post(
  //     `${environments.baseUrl}/api/v1/auth/forgotPasswords`,
  //     data
  //   );
  // }

  // setVerifyCode(data: object): Observable<any> {
  //   return this.httpClient.post(
  //     `${environments.baseUrl}/api/v1/auth/verifyResetCode`,
  //     data
  //   );
  // }

  // resetPassword(data: object): Observable<any> {
  //   return this.httpClient.put(
  //     `${environments.baseUrl}/api/v1/auth/resetPassword`,
  //     data
  //   );
  // }
  
}
