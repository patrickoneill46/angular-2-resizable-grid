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
  dragulaBag = 'bag-one';
  mouseMoveObs: Subject<any>;
  mouseUpObs: Subject<any>;

  @Input() componentSelectorActive: boolean;
  @Output() componentAdded: EventEmitter<null> = new EventEmitter();

  constructor(
    private ref: ElementRef,
    private workspaceService: WorkspaceService,
    private dragulaService: DragulaService
  ) {
    this.workspacePanels = [];
    this.mouseMoveObs = new Subject();
    this.mouseUpObs = new Subject();
  }

  ngOnInit() {

    this.workspaceService.updatedWorkspace.subscribe(updatedWorkspace => this.changeWorkspace(updatedWorkspace));
    this.workspaceService.componentSelectorActive.subscribe(state => this.componentSelectorActive = state);
    this.setWorkspaceDimensions();

    this.dragulaService.setOptions(this.dragulaBag, {
      removeOnSpill: true
    });

    this.dragulaService.remove.subscribe(event => {

      let el = event[1];
      let panel = this.workspacePanels.find(panel => panel.id === el.dataset.panelId);
      let component = panel.components.find(component => component.id === el.dataset.componentId);

      let componentIndex = panel.components.indexOf(component);
      if (componentIndex !== -1) {
        panel.components.splice(componentIndex, 1);
      }

      if (!panel.components.length) {
        this.workspacePanels.splice(this.workspacePanels.indexOf(panel), 1);
      }

      this.createNewPanelWithCompoonent(Object.assign({}, component));
    });

    this.dragulaService.dropModel.subscribe(event => {
      let panel = this.workspacePanels.find(panel => panel.id === event[1].dataset.panelId);
      if (!panel.components.length) {
        this.workspacePanels.splice(this.workspacePanels.indexOf(panel), 1);
        this.saveActiveWorkspace();
      }
    });
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

    this.workspacePanels.sort((a,b) => {

      if (a.id === activePanel.panelId) {
        return 1;
      } else {
        return 0;
      }
    });
    this.saveActiveWorkspace();
  }

  removeWorkspacePanel(panelId) {

    let panel = this.workspacePanels.find(panel => panel.id === panelId);
    this.workspacePanels.splice(this.workspacePanels.indexOf(panel), 1);
    this.saveActiveWorkspace();
  }

  changeWorkspace(workspaceConfig) {

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

  private setWorkspaceDimensions(): void {
    this.dimensions =  this.ref.nativeElement.getBoundingClientRect();
  }

  private initalizeWorkspacePanels(workspaceConfig): void {

    this.activeWorkspace = workspaceConfig;
    this.workspacePanels = workspaceConfig.panels;
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

  private createNewPanelWithCompoonent(component) {

    let panelId = 'panel-' + Math.random();

    this.workspacePanels.push({
      dimensions: {
        height: 40,
        width: 40,
        top: 20,
        left: 20
      },
      id: panelId,
      components: [
        component
      ]
    });

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
