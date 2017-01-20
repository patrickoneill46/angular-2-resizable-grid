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
  private relativeStyle: any = {};
  private pixelStyle: any = {};
  private dragStart: any = {};

  style = {};
  validate: boolean;

  constructor() {

    this.validate = function(event: ResizeEvent){

      if (event.rectangle.top < this.workspaceDimensions.top || event.rectangle.left < 0 || event.rectangle.right > this.workspaceDimensions.width || event.rectangle.bottom > this.workspaceDimensions.height) {
        return false;
      }
      return true;
    }.bind(this);
  }

  ngOnInit() {
    this.calculateRelativeStyle(initialStyle);
    this.setStyleByPixels(initialStyle);
  }

  onResizeEnd(event: ResizeEvent): void {

    this.setStyleByPixels({
      left: event.rectangle.left,
      top: event.rectangle.top - this.workspaceDimensions.top,
      width: event.rectangle.width,
      height: event.rectangle.height
    });
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
  }

  onDragStart(event) {

    this.setStyleByPixels(this.calculatePixelsStyle(this.relativeStyle));
    this.dragStart = {
      x: event.x,
      y: event.y
    };
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
    this.calculateRelativeStyle(this.style);
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
}
