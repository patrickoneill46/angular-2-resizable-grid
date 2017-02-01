import { Component } from '@angular/core';
import { ResizeEvent } from 'angular2-resizable';

import { WorkspaceService } from './workspace.service';
import { AuthenticationService } from './services/authentication/authentication.service';
import { StreamingService } from './services/streaming/streaming.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  componentSelectorActive: boolean;
  isAuthenticated: boolean;

  constructor(
    private workspaceService: WorkspaceService,
    private authenticationService: AuthenticationService,
    private streamingService: StreamingService
  ) {
    this.componentSelectorActive = false;
    this.authenticationService.isAuthenticated.subscribe(status => this.isAuthenticated = status);
  }

  componentSelectorToggled(event) {
    this.componentSelectorActive = !this.componentSelectorActive;
  }
}
