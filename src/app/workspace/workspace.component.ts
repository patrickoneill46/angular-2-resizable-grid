import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { DragulaService } from 'ng2-dragula';

import { WorkspaceService } from '../workspace.service';

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
  dragulaBag = 'bag-one';
  constructor(
    private ref: ElementRef,
    private workspaceService: WorkspaceService,
    private dragulaService: DragulaService
  ) {

    this.workspacePanels = [];

    this.workspaceService.getWorkspace('default').then(workspaceConfig => {
      this.workspacePanels = workspaceConfig;
      this.initalizeWorkspacePanels();
    });
  }

  ngOnInit() {
    this.workspaceZIndexMap = {};
    this.setWorkspaceDimensions();
    this.initalizeWorkspacePanels();
    this.dragulaService.setOptions(this.dragulaBag, {
      removeOnSpill: true
    });

    this.dragulaService.remove.subscribe(event => {

      let el = event[1];
      let panel = this.workspacePanels.find(panel => panel.id === el.dataset.panelId);
      let component = panel.components.find(component => component.id === el.dataset.componentId);

      this.createNewPanelWithCompoonent(Object.assign({}, component));
    });

    this.dragulaService.removeModel.subscribe(event => {

      let panel = this.workspacePanels.find(panel => panel.id === event[1].dataset.panelId);

      if (!panel.components.length) {
        this.workspacePanels.splice(this.workspacePanels.indexOf(panel), 1);
        this.workspaceService.saveWorkspace('default', this.workspacePanels);
      }
    });

    this.dragulaService.dropModel.subscribe(event => {
      let panel = this.workspacePanels.find(panel => panel.id === event[1].dataset.panelId);
      if (!panel.components.length) {
        this.workspacePanels.splice(this.workspacePanels.indexOf(panel), 1);
        this.workspaceService.saveWorkspace('default', this.workspacePanels);
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.setWorkspaceDimensions();
  }

  updateActivePanel(activePanel) {

    if (this.activePanel !== activePanel.panelId) {

      this.activePanel = activePanel.panelId;
      Object.keys(this.workspaceZIndexMap).forEach(panelKey => {

        if (panelKey === activePanel.panelId) {
          this.workspaceZIndexMap[panelKey] = this.workspacePanels.length;
        } else if (this.workspaceZIndexMap[panelKey] >= activePanel.order) {
          --this.workspaceZIndexMap[panelKey]
        }
      });
    }
  }

  removeWorkspacePanel(panelId) {

    let panel = this.workspacePanels.find(panel => panel.id === panelId);
    this.workspacePanels.splice(this.workspacePanels.indexOf(panel), 1);
    this.workspaceService.saveWorkspace('default', this.workspacePanels);
  }

  private setWorkspaceDimensions(): void {
    this.dimensions =  this.ref.nativeElement.getBoundingClientRect();
  }

  private initalizeWorkspacePanels(): void {

    this.workspacePanels.forEach(panel => {
      this.workspaceZIndexMap[panel.id] = panel.order;

      if (panel.active){
        this.activePanel = panel.id;
      }
    });
  }

  private onWorkspacePanelChanged(panelChanged): void {

    this.workspacePanels.forEach(panel => {

      if (panel.id == panelChanged.id) {
        Object.assign(panel, panelChanged);
      }
    });

    this.workspaceService.saveWorkspace('default', this.workspacePanels);
  }

  private onPanelDraggedOntoWorkspace(panelConfig) {

    if (panelConfig.component) {
      //ToDo when event isn't being fired on each component
      this.createNewPanelWithCompoonent(panelConfig.component);
    }
  }

  private createNewPanelWithCompoonent(component) {

    let panelId = 'panel-' + Math.random();
    let zIndexOrder = this.workspacePanels.length + 1;

    this.workspacePanels.push({
      dimensions: {
        height: 40,
        width: 40,
        top: 20,
        left: 20
      },
      order: zIndexOrder,
      id: panelId,
      active: 0,
      components: [
        component
      ]
    });

    this.workspaceZIndexMap[panelId] = zIndexOrder;

    this.workspaceService.saveWorkspace('default', this.workspacePanels);
  }
}
