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

  relativeStyle: any = {};

  style = {
    left: `${initialStyle.left}px`,
    top: `${initialStyle.top}px`,
    width: `${initialStyle.width}px`,
    height: `${initialStyle.height}px`
  };
  styleIntegers = {
    left: initialStyle.left,
    top: initialStyle.top,
    width: initialStyle.width,
    height: initialStyle.height
  };
  dragStart = {};
  workspaceRect;

  validate(event: ResizeEvent): boolean {
    const MIN_DIMENSIONS_PX: number = 50;
    if (event.rectangle.top < 60 || event.rectangle.left < 0 || event.rectangle.right > window.innerWidth || event.rectangle.bottom > window.innerHeight) {
      return false;
    }
    return true;
  }

  onResizeEnd(event: ResizeEvent): void {
    console.log(event, 'resizeEnd');

    Object.assign(this.styleIntegers, event.rectangle);

    this.style = {
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top - 60}px`,
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`
    };
  }

  onDrag(event) {

    let previousStyle: any = Object.assign({}, this.styleIntegers);
    let newStyle: any = {};

    if (event.x + previousStyle.width > this.workspaceDimensions.width) {
      newStyle.left = this.workspaceDimensions.width - previousStyle.width;
    } else if (event.x < 0) {
      newStyle.left = 0;
    } else {
      newStyle.left = event.x;
    }

    if (event.y + previousStyle.height > this.workspaceDimensions.bottom) {
      newStyle.top = this.workspaceDimensions.bottom - previousStyle.height;
    } else if (event.y < 60) {
      newStyle.top = 60;
    } else {
      newStyle.top = event.y;
    }

    this.calculateRelativeStyle();

    Object.assign(this.styleIntegers, newStyle);
    this.style = {
      left: `${newStyle.left}px`,
      top: `${newStyle.top - this.workspaceDimensions.top}px`,
      width: `${previousStyle.width}px`,
      height: `${previousStyle.height}px`
    }
  }

  onDragEnd(event) {

  }

  onDragStart(event) {

    this.dragStart = {
      x: event.x,
      y: event.y
    };
  }

  calculateRelativeStyle() {

    this.relativeStyle = {
      top: 0,
      left: 0,
      height: 0,
      width: 0
    };

    console.log('relative style', this.relativeStyle);
  };

  ngOnInit() {

    this.calculateRelativeStyle();
  };

}
