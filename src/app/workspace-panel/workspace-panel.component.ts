import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ResizeEvent } from 'angular2-resizable';


let initialStyle = {
  height: 300,
  width: 200,
  top: 100,
  left: 100
}

@Component({
  selector: 'workspace-panel',
  templateUrl: './workspace-panel.component.html',
  styleUrls: ['./workspace-panel.component.scss']
})
export class WorkspacePanelComponent implements OnInit {

  @Input() workspaceDimensions: ClientRect;
  validate: boolean;

  relativeStyle: any = {};

  style = {};
  dragStart = {};
  workspaceRect;

  constructor() {

    this.validate = function(event: ResizeEvent){

      if (event.rectangle.top < this.workspaceDimensions.top || event.rectangle.left < 0 || event.rectangle.right > this.workspaceDimensions.width || event.rectangle.bottom > this.workspaceDimensions.height) {
        return false;
      }
      return true;
    }.bind(this);
  }

  @HostListener('window:resize', ['$event'])
  onWorkspaceChanged(event): void {

    this.setStyle({
      top: this.relativeStyle.top * this.workspaceDimensions.height,
      left: this.relativeStyle.left * this.workspaceDimensions.width,
      height: this.relativeStyle.height * this.workspaceDimensions.height,
      width: this.relativeStyle.width * this.workspaceDimensions.width
    });
  };

  onResizeEnd(event: ResizeEvent): void {

    Object.assign(this.style, event.rectangle);
    this.setStyle({
      left: event.rectangle.left,
      top: event.rectangle.top - this.workspaceDimensions.top,
      width: event.rectangle.width,
      height: event.rectangle.height
    });
  }

  onDrag(event) {

    let previousStyle: any = Object.assign({}, this.style);
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

    this.setStyle({
      left: newStyle.left,
      top: newStyle.top,
      width: previousStyle.width,
      height: previousStyle.height
    });
  }

  onDragEnd(event) {

  }

  onDragStart(event) {

    this.dragStart = {
      x: event.x,
      y: event.y
    };
  }

  calculateRelativeStyle(style) {

    this.relativeStyle = {
      top: style.top / this.workspaceDimensions.height,
      left: style.left / this.workspaceDimensions.width,
      height: style.height / this.workspaceDimensions.height,
      width: style.width / this.workspaceDimensions.width
    };
  };

  setStyle(style) {

    this.style = {
      left: style.left,
      top: style.top,
      width: style.width,
      height: style.height
    };
    this.calculateRelativeStyle(this.style);
  }

  ngOnInit() {
    this.calculateRelativeStyle(initialStyle);
    this.setStyle(initialStyle);
  }
}
