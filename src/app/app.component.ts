import { Component } from '@angular/core';
import { ResizeEvent } from 'angular2-resizable';

import { WorkspaceService } from './workspace.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  componentSelectorActive: boolean;

  constructor(private workspaceService: WorkspaceService) {
    this.componentSelectorActive = false;
  }

  componentSelectorToggled(event) {
    this.componentSelectorActive = !this.componentSelectorActive;
  }
}
