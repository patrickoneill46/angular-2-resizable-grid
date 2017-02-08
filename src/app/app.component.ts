import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ResizeEvent } from 'angular2-resizable';

import { WorkspaceService } from './workspace.service';
import { AuthenticationService } from './services/authentication/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isAuthenticated;
  componentSelectorActive: boolean;

  constructor(private authenticationService: AuthenticationService) {
    this.componentSelectorActive = false;
    this.isAuthenticated = this.authenticationService.isAuthenticated;
  }

  componentSelectorToggled(event) {
    this.componentSelectorActive = !this.componentSelectorActive;
  }
}
