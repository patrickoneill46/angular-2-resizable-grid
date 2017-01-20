import { Component, OnInit, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {

  private dimensions: ClientRect;
  private activePanel: string;

  workspacePanels: Array<any>;
  workspaceZIndexMap: any;
  constructor(private ref: ElementRef) {

    this.workspacePanels = [];
  }

  ngOnInit() {
    this.workspaceZIndexMap = {};
    this.setWorkspaceDimensions();
    this.initalizeWorkspacePanels();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.setWorkspaceDimensions();
  }

  updateActivePanel(activePanelId) {

    if (this.activePanel !== activePanelId) {

      this.activePanel = activePanelId;
      Object.keys(this.workspaceZIndexMap).forEach(panelKey => {

        if (panelKey == activePanelId) {
          this.workspaceZIndexMap[panelKey] = this.workspacePanels.length;
        } else {
          --this.workspaceZIndexMap[panelKey];
        }
      });
    }
  }

  private setWorkspaceDimensions(): void {
    this.dimensions =  this.ref.nativeElement.getBoundingClientRect();
  }

  private initalizeWorkspacePanels(): void {

    this.workspacePanels = [
      {
        dimensions: {
          height: 20,
          width: 30,
          top: 10,
          left: 10
        },
        order: 3,
        id: 'panel1',
        active: 1
      },
      {
        dimensions: {
          height: 20,
          width: 30,
          top: 80,
          left: 70
        },
        order: 2,
        id: 'panel2',
        active: 0
      },
      {
        dimensions: {
          height: 32,
          width: 61,
          top: 21,
          left: 11
        },
        order: 1,
        id: 'panel3',
        active: 0
      }
    ]

    this.workspacePanels.forEach(panel => {
      this.workspaceZIndexMap[panel.id] = panel.order;

      if (panel.active){
        this.activePanel = panel.id;
      }
    });
  }
}
