import { Component, OnInit } from '@angular/core';

import { WorkspaceService } from '../workspace.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private workspaceService: WorkspaceService) { }

  ngOnInit() {
  }

  resetWorkspace() {

    this.workspaceService.resetWorkspace();
    location.reload();
  }
}
