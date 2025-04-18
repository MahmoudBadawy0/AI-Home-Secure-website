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
import { RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  isLogedin: InputSignal<boolean> = input.required();
  private readonly ID = inject(PLATFORM_ID);
  ngOnInit(): void {
    if (isPlatformBrowser(this.ID)) {
      initFlowbite();
    }
  }
}
