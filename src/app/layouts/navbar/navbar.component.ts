import { AuthServiceService } from './../../core/services/authService/auth-service.service';
import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  inject,
  input,
  InputSignal,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { initFlowbite } from 'flowbite';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  isLogedin: InputSignal<boolean> = input.required();
  private readonly ID = inject(PLATFORM_ID);
  name = signal<string>('User');
  email = signal<string>('user@example.com');
  isMobileMenuOpen = signal<boolean>(false);
  readonly authServiceService = inject(AuthServiceService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    if (isPlatformBrowser(this.ID)) {
      initFlowbite();
    }
    this.setFormValuesFromToken();
    this.closeMenuOnNavigation();
  }

  logOut() {
    this.authServiceService.logOut();
  }

  private setFormValuesFromToken(): void {
    this.authServiceService.tokenDecode();
    if (this.authServiceService.decodedToken) {
      this.name.set(this.authServiceService.decodedToken.unique_name);
      this.email.set(this.authServiceService.decodedToken.email);
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
  }
  private closeMenuOnNavigation(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => {
          this.isMobileMenuOpen.set(false);
        }, 100);
      });
  }
}
