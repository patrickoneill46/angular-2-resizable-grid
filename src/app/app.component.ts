import { Component } from '@angular/core';
import { ResizeEvent } from 'angular2-resizable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app works!';

  style = {};
  dragStart = {};

  validate(event: ResizeEvent): boolean {
    const MIN_DIMENSIONS_PX: number = 50;
    if (event.rectangle.top < 60 || event.rectangle.left < 0 || event.rectangle.right > window.innerWidth || event.rectangle.bottom > window.innerHeight) {
      return false;
    }
    return true;
  }

  onResizeEnd(event: ResizeEvent): void {
    console.log(event, 'resizeEnd');

    this.style = {
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top - 60}px`,
      width: `${event.rectangle.width}px`,
      height: `${event.rectangle.height}px`
    };
  }

  onDrag(event) {

    this.style = {
      left: `${event.x}px`,
      top: `${event.y - 60}px`,
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
