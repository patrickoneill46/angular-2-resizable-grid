import { Component } from '@angular/core';
import { ResizeEvent } from 'angular2-resizable';

import { AuthenticationService } from './services/authentication/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  componentSelectorActive: boolean;
  isAuthenticated: boolean;

  constructor(
    private authenticationService: AuthenticationService,
  ) {
    this.componentSelectorActive = false;
    this.authenticationService.isAuthenticated.subscribe(status => this.isAuthenticated = status);
  }

  componentSelectorToggled(event) {
    this.componentSelectorActive = !this.componentSelectorActive;
  }
}
