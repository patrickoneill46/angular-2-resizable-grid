import { Component, OnInit } from '@angular/core';

import { WorkspaceService } from '../workspace.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  workspaces: any[];

  constructor(private workspaceService: WorkspaceService) { }

  ngOnInit() {
    this.workspaces = [];
    this.workspaceService.getWorkspaces().subscribe(workspaces => this.updateWorkspaceSelector(workspaces))
  }

  resetWorkspace() {

    this.workspaceService.resetWorkspace();
    location.reload();
  }

  showWorkspace(workspaceId) {
    this.workspaceService.showWorkspace(workspaceId);
  }

  private updateWorkspaceSelector(workspaces) {

    Object.keys(workspaces).forEach(workspaceKey => {
      this.workspaces.push({
        workspaceId: workspaceKey,
        workspaceName: workspaces[workspaceKey].displayName
      });
    });
  }


}
