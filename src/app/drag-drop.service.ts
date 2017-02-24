import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class DragDropService {

  private dragData: any;
  private dropContainer: any;
  private dropPanel: any;

  componentDroppedOutsidePanel: EventEmitter<any>;
  componentDroppedInsidePanel: EventEmitter<any>;

  constructor() {
    this.componentDroppedOutsidePanel = new EventEmitter();
    this.componentDroppedInsidePanel = new EventEmitter();
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
      this.componentDroppedOutsidePanel.emit({component: this.dragData, event: event})
    } else {
      console.log('dropped inside panel');
      this.componentDroppedInsidePanel.emit({component: this.dragData, panel: this.dropPanel})
    }
  }

}
