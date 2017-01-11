import { Component } from '@angular/core';
import { ResizeEvent } from 'angular2-resizable';

let initialStyle = {
  height: 300,
  width: 200,
  top: 100,
  left: 100
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app works!';
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

    if (event.x + previousStyle.width > window.innerWidth) {
      newStyle.left = window.innerWidth - previousStyle.width;
    } else if (event.x < 0) {
      newStyle.left = 0;
    } else {
      newStyle.left = event.x;
    }

    if (event.y + previousStyle.height > window.innerHeight) {
      newStyle.top = window.innerHeight - previousStyle.height;
    } else if (event.y < 60) {
      newStyle.top = 60;
    } else {
      newStyle.top = event.y;
    }

    Object.assign(this.styleIntegers, newStyle);
    this.style = {
      left: `${newStyle.left}px`,
      top: `${newStyle.top - 60}px`,
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
}
