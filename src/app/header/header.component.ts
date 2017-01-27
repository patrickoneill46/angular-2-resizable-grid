import { Component, OnInit, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';

import { WorkspaceService } from '../workspace.service';


@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  workspaces: any[];
  creatingWorkspace: boolean;
  newWorkspaceName: string;

  constructor(private workspaceService: WorkspaceService) { }

  @HostListener('window:keyup', ['$event'])
  onKeyup(event): void {

    if (this.creatingWorkspace) {

      switch (event.keyCode) {

        case 27:
          this.hideNewWorkspaceForm();

        case 13:
          this.createNewWorkspace();
      }
    }
  }

  ngOnInit() {
    this.workspaces = [];
    this.newWorkspaceName = '';
    this.workspaceService.getWorkspaces().subscribe(workspaces => this.updateWorkspaceSelector(workspaces))
  }

  resetWorkspace(): void {

    this.workspaceService.resetWorkspace();
    location.reload();
  }

  showWorkspace(workspaceId): void {
    this.workspaceService.showWorkspace(workspaceId);
  }

  showNewWorkspaceForm(): void {
    this.creatingWorkspace = true;
  }

  hideNewWorkspaceForm(): void {
    this.creatingWorkspace = false;
    this.newWorkspaceName = '';
  }

  private updateWorkspaceSelector(workspaces): void {

    Object.keys(workspaces).forEach(workspaceKey => {
      this.workspaces.push({
        workspaceId: workspaceKey,
        workspaceName: workspaces[workspaceKey].displayName
      });
    });
  }

  private createNewWorkspace(): void {
    console.log('creating new workspace');
  }
}
