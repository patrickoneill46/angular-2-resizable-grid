import { Directive, Input, OnInit, HostListener, EventEmitter, ElementRef, Renderer, Output } from '@angular/core';

@Directive({
  selector: '[draggable]'
})
export class DraggableDirective implements OnInit {
  private dragging = false;
  private relativeOffset = { x: 0, y: 0};
  @Input() containerElement: any;
  @Output() dragStartEvent = new EventEmitter();
  @Output() dragEvent = new EventEmitter();
  @Output() dragEndEvent = new EventEmitter();
  private Δx: number = 0;
  private Δy: number = 0;
  private mustBePosition: Array<string> = ['absolute', 'fixed', 'relative'];

  @HostListener('document:mouseup', ['$event'])
  onMouseup(event) {
    this.onDragEnd(event);
    this.dragging = false;
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event) {

      this.dragging = true;
      this.onDragStart(event);
      return false; // Call preventDefault() on the event
  }

  @HostListener('document:mousemove', ['$event'])
  onMousemove(event) {
      if (this.dragging) {
        this.onDrag(event);
      }
  }
  constructor(
    private el: ElementRef, private renderer: Renderer
  ) {
    try {
      if (this.mustBePosition.indexOf(this.el.nativeElement.style.position) === -1) {
        console.warn(this.el.nativeElement, 'Must be having position attribute set to ' + this.mustBePosition.join('|'));
      }
    } catch (ex) {
      console.error(ex);
    }
  }
  public ngOnInit(): void {
    console.log(this.containerElement);
  }
  onDragStart(event: MouseEvent) {

    let rect = this.el.nativeElement.getBoundingClientRect();
    this.relativeOffset = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    this.Δx = event.x;
    this.Δy = event.y;
    this.dragStartEvent.emit({x: this.Δx, y: this.Δy});
  }
  onDrag(event: MouseEvent) {
    this.dragEvent.emit({x: event.x - this.relativeOffset.x, y: event.y - this.relativeOffset.y});
  }
  onDragEnd(event: MouseEvent) {
    this.Δx = 0;
    this.Δy = 0;
    this.relativeOffset = { x:0, y: 0 };
    this.dragEndEvent.emit(false);
  }
  doTranslation(x: number, y: number) {
    if (!x || !y) return;
    this.renderer.setElementStyle(this.el.nativeElement, 'top', (y - this.Δy) + 'px');
    this.renderer.setElementStyle(this.el.nativeElement, 'left', (x - this.Δx) + 'px');
  }
  public ngOnDestroy(): void {
    this.renderer.setElementAttribute(this.el.nativeElement, 'draggable', 'false');
  }
}
