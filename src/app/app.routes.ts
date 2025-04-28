import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { logedGuard } from './core/guards/loged.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  // Authentication routes
  {
    path: '',
    component: AuthLayoutComponent,
    // canActivate: [logedGuard],
    children: [
      {
        path: 'login',
        title: 'Login',
        loadComponent: () =>
          import('./pages/login/login.component').then((m) => m.LoginComponent),
      },

      {
        path: 'register',
        title: 'Register',
        loadComponent: () =>
          import('./pages/register/register.component').then(
            (m) => m.RegisterComponent
          ),
      },

      {
        path: 'resetpassword',
        title: ' Reset password',
        loadComponent: () =>
          import('./pages/resetpassword/resetpassword.component').then(
            (m) => m.ResetpasswordComponent
          ),
      },
    ],
  },

  // Main routes
  {
    path: '',
    component: MainLayoutComponent,
    // canActivate: [authGuard],
    children: [
      {
        path: 'home',
        title: ' Home',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },

      {
        path: 'UserImg',
        title: 'User Image',
        loadComponent: () =>
          import('./pages/image-upload/image-upload.component').then(
            (m) => m.ImageUploadComponent
          ),
      },

      {
        path: 'Profile',
        title: 'Profile settings',
        loadComponent: () =>
          import('./pages/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },

      {
        path: 'history',
        title: 'History',
        loadComponent: () =>
          import('./pages/history/history.component').then(
            (m) => m.HistoryComponent
          ),
      },

      {
        path: 'emergency-response',
        title: 'Emergency Response',
        loadComponent: () =>
          import('./pages/theft-alert/theft-alert.component').then(
            (m) => m.TheftAlertComponent
          ),
      },

      {
        path: '**',
        title: 'NotFound',
        loadComponent: () =>
          import('./pages/not-found/not-found.component').then(
            (m) => m.NotFoundComponent
          ),
      },
    ],
  },
];
