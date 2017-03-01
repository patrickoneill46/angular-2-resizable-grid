import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class DragDropService {

  private dragData: any;
  private dropContainer: any;
  private dropPanel: any;
  isDragging: boolean;
  dropPanelId: any;
  dragStart: any;
  dragStyle: any;

  componentDroppedOutsidePanel: EventEmitter<any>;
  componentDroppedInsidePanel: EventEmitter<any>;

  constructor() {
    this.componentDroppedOutsidePanel = new EventEmitter();
    this.componentDroppedInsidePanel = new EventEmitter();
    this.isDragging = false;
  }

  setDragStart(x, y) {
    this.dragStart = {x, y};
  }

  handleDrag(x, y) {

    this.dragStyle = {
      top: `${this.dragStart.y}px`,
      left: `${this.dragStart.x}px`,
      transform: `translate(${x - this.dragStart.x}px, ${y - this.dragStart.y}px)`
    };
  }

  setDragData(componentData) {
    this.dragData = componentData;
  }

  setDraggedOverPanel(panelId) {
    this.dropPanel = panelId;
  }

  handleDragEnd(event) {

    if (!this.dropPanel) {
      console.log('dropped outside panel')
      this.componentDroppedOutsidePanel.emit({
        component: this.dragData.component,
        panelDimensions: this.dragData.panelDimensions,
        top: event.clientY,
        left: event.clientX,
        panelId: this.dragData.panelId
      });
    } else {
      console.log('dropped inside panel');
      this.componentDroppedInsidePanel.emit({component: this.dragData.component, panel: this.dropPanel, previousPanel: this.dragData.panelId})
    }

    this.dragStyle = null;
    this.dragStart = null;
    this.isDragging = false;
    this.dropPanelId = false;
  }

}
