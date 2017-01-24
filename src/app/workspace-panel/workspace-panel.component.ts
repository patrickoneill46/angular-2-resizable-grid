import { Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import { ResizeEvent } from 'angular2-resizable';

@Component({
  selector: 'workspace-panel',
  templateUrl: './workspace-panel.component.html',
  styleUrls: ['./workspace-panel.component.scss']
})
export class WorkspacePanelComponent implements OnInit {

  @Input() workspaceDimensions: ClientRect;
  @Input() initalConfig: any;
  @Input() order;

  @Output() panelActive: EventEmitter<any> = new EventEmitter();
  @Output() panelChanged: EventEmitter<any> = new EventEmitter();
  private relativeStyle: any = {};
  private pixelStyle: any = {};
  private dragStart: any = {};
  private panelId: string;

  style: any = {};
  validate: boolean;
  active: number;
  components: any[] = [];

  constructor() {

    this.components = [
      {
        header: 'Watchlist Component',
        id: 'firstComponent',
        type: 'Watchlist'
      },
      {
        header: 'Chart Component',
        id: 'firstComponent',
        type: 'Chart'
      },
      {
        header: 'News Component',
        id: 'firstComponent',
        type: 'News'
      }
    ];
    this.validate = function(event: ResizeEvent){

      if (event.rectangle.top < this.workspaceDimensions.top || event.rectangle.left < 0 || event.rectangle.right > this.workspaceDimensions.width || event.rectangle.bottom > this.workspaceDimensions.height) {
        return false;
      }
      return true;
    }.bind(this);
  }

  ngOnInit() {
    this.setStyleByPercentage(this.initalConfig.dimensions);
    this.panelId = this.initalConfig.id;
    this.active = this.initalConfig.active;
  }

  onResizeEnd(event: ResizeEvent): void {

    this.setStyleByPixels({
      left: event.rectangle.left,
      top: event.rectangle.top - this.workspaceDimensions.top,
      width: event.rectangle.width,
      height: event.rectangle.height
    });
    this.handlePanelChanged();
  }

  onDrag(event) {

    let previousStyle: any = Object.assign({}, this.pixelStyle);
    let newStyle: any = {};

    if (event.x + previousStyle.width > this.workspaceDimensions.width) {
      newStyle.left = this.workspaceDimensions.width - previousStyle.width;
    } else if (event.x < 0) {
      newStyle.left = 0;
    } else {
      newStyle.left = event.x;
    }

    if (event.y + previousStyle.height > this.workspaceDimensions.bottom) {
      newStyle.top = this.workspaceDimensions.bottom - previousStyle.height - this.workspaceDimensions.top;
    } else if (event.y < this.workspaceDimensions.top) {
      newStyle.top = 0;
    } else {
      newStyle.top = event.y - this.workspaceDimensions.top;
    }

    newStyle.height = previousStyle.height;
    newStyle.width = previousStyle.width;

    this.setStyleByPixels({
      left: newStyle.left,
      top: newStyle.top,
      width: previousStyle.width,
      height: previousStyle.height
    });
  }

  onDragEnd(event) {
    this.setStyleByPercentage(this.calculateRelativeStyle(this.pixelStyle));
    this.dragStart = null;
    this.handlePanelChanged();
  }

  onDragStart(event) {

    this.setStyleByPixels(this.calculatePixelsStyle(this.relativeStyle));
    this.dragStart = {
      x: event.x,
      y: event.y
    };
  }

  setPanelActive() {
    this.panelActive.emit({ panelId: this.panelId, order: this.order});
  }

  showComponent(componentId) {
    console.log('showing componentId');
  }

  destroyComponent(componentId) {
    console.log('destroying componentId');
  }

  addComponent(component) {

  }

  destroyPanel() {
    console.log('destroy panel');
  }

  private calculateRelativeStyle(style) {

    return {
      top: Math.round(style.top / this.workspaceDimensions.height * 100),
      left: Math.round(style.left / this.workspaceDimensions.width * 100),
      height: Math.round(style.height / this.workspaceDimensions.height * 100),
      width: Math.round(style.width / this.workspaceDimensions.width * 100)
    };
  };

  private calculatePixelsStyle(style) {

    return {
      top: style.top * this.workspaceDimensions.height / 100,
      left: style.left * this.workspaceDimensions.width / 100,
      height: style.height * this.workspaceDimensions.height / 100,
      width: style.width * this.workspaceDimensions.width / 100
    };
  }

  private setStyleByPixels(style) {

    this.pixelStyle = style;
    this.relativeStyle = this.calculateRelativeStyle(style);

    this.style = {
      left: `${style.left}px`,
      top: `${style.top}px`,
      width: `${style.width}px`,
      height: `${style.height}px`
    };
  }

  private setStyleByPercentage(style) {

    this.relativeStyle = style;
    this.pixelStyle = this.calculatePixelsStyle(style);

    this.style = {
      left: `${style.left}%`,
      top: `${style.top}%`,
      width: `${style.width}%`,
      height: `${style.height}%`
    };
  }

  private handlePanelChanged() {

    this.panelChanged.emit({
      dimensions: {
        height: this.relativeStyle.height,
        width: this.relativeStyle.width,
        top: this.relativeStyle.top,
        left: this.relativeStyle.left
      },
      order: this.order,
      id: this.panelId,
      active: 1
    })
  }
}
