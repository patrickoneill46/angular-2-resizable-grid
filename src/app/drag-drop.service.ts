import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class DragDropService {

  private dragData: any;
  private dropContainer: any;
  isDragging: boolean;
  dropPanelId: any;
  dropPanelComponentIndex: any;
  dragStart: any;
  dragStyle: any;
  dragPlaceHolderHTML: any;

  componentDroppedOutsidePanel: EventEmitter<any>;
  componentDroppedInsidePanel: EventEmitter<any>;

  constructor() {
    this.componentDroppedOutsidePanel = new EventEmitter();
    this.componentDroppedInsidePanel = new EventEmitter();
    this.isDragging = false;
  }

  setDragStart(componentData, x, y, offsetX, offsetY, target) {

    let rect = target.getBoundingClientRect();
    let height = rect.height;
    let width = rect.width;

    this.dragData = componentData;
    this.dragStart = {x, y, height, width, offsetX, offsetY};
    this.dragPlaceHolderHTML = target.innerHTML;
  }

  getDraggingHeaderWidth() {
    return this.dragStart.width;
  }

  handleDrag(x, y) {

    this.isDragging = true;
    this.dragStyle = {
      top: `${this.dragStart.y - this.dragStart.offsetY}px`,
      left: `${this.dragStart.x - this.dragStart.offsetX}px`,
      height: `${this.dragStart.height}px`,
      width: `${this.dragStart.width}px`,
      transform: `translate(${x - this.dragStart.x}px, ${y - this.dragStart.y}px)`
    };
  }

  setDraggedOverPanel(panelId, componentIndex) {
    this.dropPanelId = panelId;
    this.dropPanelComponentIndex = componentIndex;
  }

  setDropHeaderIndex(componentIndex) {
    this.dropPanelComponentIndex = componentIndex;
  }

  handleDragEnd(event, dragHeaderIndex) {

    if (!this.dropPanelId) {
      console.log('dropped outside panel')
      this.componentDroppedOutsidePanel.emit({
        component: this.dragData.component,
        panelDimensions: this.dragData.panelDimensions,
        top: event.clientY - this.dragStart.offsetY,
        left: event.clientX - this.dragStart.offsetX,
        panelId: this.dragData.panelId
      });
    } else if (this.dropPanelId === this.dragData.panelId) {
      console.log('same panel');
    } else {
      console.log('dropped inside panel');
      this.componentDroppedInsidePanel.emit({component: this.dragData.component, panel: this.dropPanelId, previousPanel: this.dragData.panelId, index: this.dropPanelComponentIndex})
    }

    this.dragStyle = null;
    this.dragStart = null;
    this.isDragging = false;
    this.dropPanelId = null;
  }

}
