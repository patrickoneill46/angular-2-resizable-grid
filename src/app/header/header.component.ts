import { Component, OnInit, HostListener, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

import { WorkspaceService } from '../workspace.service';


@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() componentSelectorActive: boolean;

  workspaces: any[];
  creatingWorkspace: boolean;
  newWorkspaceName: string;
  activeWorkspaceId: string;

  constructor(private workspaceService: WorkspaceService) { }

  @HostListener('window:keyup', ['$event'])
  onKeyup(event): void {

    if (this.creatingWorkspace) {

      switch (event.keyCode) {

        case 27:
          this.hideNewWorkspaceForm();
          break;
        case 13:
          this.createNewWorkspace();
          break;
        default:
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
    this.setActiveWorkspace(workspaceId);
  }

  showNewWorkspaceForm(): void {
    this.creatingWorkspace = true;
  }

  hideNewWorkspaceForm(): void {
    this.creatingWorkspace = false;
    this.newWorkspaceName = '';
  }

  openComponentPanel(): void {
    this.workspaceService.toggleComponentSelector(!this.componentSelectorActive);
  };

  private updateWorkspaceSelector(workspaces): void {

    this.workspaces = [];
    Object.keys(workspaces).forEach(workspaceKey => {
      this.workspaces.push({
        workspaceId: workspaceKey,
        workspaceName: workspaces[workspaceKey].displayName
      });
    });
  }

  private createNewWorkspace(): void {
    this.workspaceService.createNewWorkspace(this.newWorkspaceName);
    this.hideNewWorkspaceForm();
  }

  private setActiveWorkspace (workspaceId) {
    this.activeWorkspaceId = workspaceId;
  }
}
