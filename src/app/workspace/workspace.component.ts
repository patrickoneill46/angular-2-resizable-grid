import { Component, OnInit, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { DragulaService } from 'ng2-dragula';

import { Subject } from 'rxjs/Subject';

import { WorkspaceService } from '../workspace.service';

@Component({
  selector: 'workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {

  private dimensions: ClientRect;
  private activePanel: any;
  private activeWorkspace: any;

  workspacePanels: Array<any>;
  workspaceZIndexMap: any;
  dragulaBag = 'bag-one';
  mouseMoveObs: Subject<any>;
  mouseUpObs: Subject<any>;

  @Input() componentSelectorActive: boolean;
  @Output() componentAdded: EventEmitter<null> = new EventEmitter();

  constructor(
    private ref: ElementRef,
    private workspaceService: WorkspaceService,
  ) {
    this.workspacePanels = [];
    this.workspaceZIndexMap = {};
    this.mouseMoveObs = new Subject();
    this.mouseUpObs = new Subject();
  }

  ngOnInit() {

    this.workspaceService.updatedWorkspace.subscribe(updatedWorkspace => this.changeWorkspace(updatedWorkspace));
    this.workspaceService.componentSelectorActive.subscribe(state => this.componentSelectorActive = state);
    this.setWorkspaceDimensions();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.setWorkspaceDimensions();
  }

  @HostListener('window:mousemove', ['$event.clientX', '$event.clientY'])
  onMouseMove(mouseX: number, mouseY: number): void {
    this.mouseMoveObs.next({ mouseX, mouseY });
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event): void {
    this.mouseUpObs.next(event);
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
    this.saveActiveWorkspace();
  }

  changeWorkspace(workspaceConfig) {

    this.activePanel = null;
    this.workspacePanels = [];
    this.activeWorkspace = null;
    this.initalizeWorkspacePanels(workspaceConfig);
  }

  addComponentToWorkspace(newComponent) {

    this.createNewPanelWithCompoonent({
      header: newComponent.header,
      type: newComponent.type,
      id: Math.random().toString()
    });

    this.componentAdded.emit();
  }

  handleComponentDropped($event) {

    let height = $event.dragData.panelStyle.height;
    let width = $event.dragData.panelStyle.width;

    this.createNewPanelWithCompoonent($event.dragData.component, {
      height: height,
      width: width,
      left: Math.min(100 - width, Math.round($event.mouseEvent.clientX * 100 / this.dimensions.width)),
      top: Math.min(100 - height, Math.round(($event.mouseEvent.clientY - this.dimensions.top) * 100 / (this.dimensions.height)))
    });

    let previousContainingPanel = this.workspacePanels.find(panel => panel.id === $event.dragData.panelId);
    previousContainingPanel.components.splice(previousContainingPanel.components.indexOf($event.dragData.component), 1);
    if (!previousContainingPanel.components.length) {
      this.removeWorkspacePanel(previousContainingPanel.id)
    }
  }

  handleComponentDroppedOntoAnotherPanel($event) {
    let previousContainingPanel = this.workspacePanels.find(panel => panel.id === $event.panelId);
    if (!previousContainingPanel.components.length) {
      this.removeWorkspacePanel(previousContainingPanel.id)
    }
  }

  private setWorkspaceDimensions(): void {
    this.dimensions =  this.ref.nativeElement.getBoundingClientRect();
  }

  private initalizeWorkspacePanels(workspaceConfig): void {

    this.activeWorkspace = workspaceConfig;
    this.workspacePanels = workspaceConfig.panels;
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
    this.saveActiveWorkspace();
  }

  private onPanelDraggedOntoWorkspace(panelConfig) {

    if (panelConfig.component) {
      //ToDo when event isn't being fired on each component
      this.createNewPanelWithCompoonent(panelConfig.component);
    }
  }

  private createNewPanelWithCompoonent(component, style = {
    height: 40,
    width: 40,
    top: 20,
    left: 20
  }) {

    let panelId = 'panel-' + Math.random();
    let zIndexOrder = this.workspacePanels.length + 1;

    this.workspacePanels.push({
      dimensions: style,
      order: zIndexOrder,
      id: panelId,
      active: 0,
      components: [
        component
      ]
    });

    this.workspaceZIndexMap[panelId] = zIndexOrder;
    this.saveActiveWorkspace();
  }

  private saveActiveWorkspace(): void {

    this.workspaceService.saveWorkspace(this.activeWorkspace.id, {
      id: this.activeWorkspace.id,
      displayName: this.activeWorkspace.displayName,
      panels: this.workspacePanels,
      active: 1,
      default: this.activeWorkspace.default
    });
  }
}
