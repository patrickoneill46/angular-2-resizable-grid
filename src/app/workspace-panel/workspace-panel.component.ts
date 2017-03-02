import {
  Component,
  EventEmitter,
  HostListener,
  HostBinding,
  Input,
  OnInit,
  Output,
  ViewContainerRef,
  ViewChild,
  ReflectiveInjector,
  ComponentFactoryResolver
} from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { DragDropService } from '../drag-drop.service';

import { WatchlistComponent } from '../watchlist/watchlist.component';
import { ChartComponent } from '../chart/chart.component';
import { NewsComponent } from '../news/news.component';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'workspace-panel',
  templateUrl: './workspace-panel.component.html',
  styleUrls: ['./workspace-panel.component.scss'],
  entryComponents: [ChartComponent, NewsComponent, WatchlistComponent],
  host: {
    '[style.height]': 'style.height',
    '[style.width]': 'style.width',
    '[style.left]': 'style.left',
    '[style.top]': 'style.top',
    '[style.minHeight]': 'minHeight',
    '[style.minWidth]': 'minWidth',
    '[style.transform]': 'transform',
    '[style.zIndex]': 'order'
  }
})
export class WorkspacePanelComponent implements OnInit {

  @Input() workspaceDimensions: ClientRect;
  @Input() initalConfig: any;
  @Input() order;
  @Input() mouseMoveObs: Subject<any>;
  @Input() mouseUpObs: Subject<any>;

  @Output() panelActive: EventEmitter<any> = new EventEmitter();
  @Output() panelChanged: EventEmitter<any> = new EventEmitter();
  @Output() panelDestroyed: EventEmitter<any> = new EventEmitter();
  private relativeStyle: any = {};
  private pixelStyle: any = {};
  private transformValues: any = {};
  private panelId: string;

  private draggingHeaderItem: boolean = false;
  private draggingPanel: boolean = false;
  private mouseMoveSub: Subscription;
  private mouseUpSub: Subscription;
  private dragOverSub: Subscription;

  style: any = {};
  transform: string;
  validate: boolean;
  active: number;
  components: any[] = [];
  activeComponentId: string;
  currentComponent = null;
  componentOptions: any = {
    'News': NewsComponent,
    'Chart': ChartComponent,
    'Watchlist': WatchlistComponent
  };
  minHeight: number = 150;
  minWidth: number = 300;
  dragHeaderIndex: number;
  dragHeaderTransform: string;

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer: ViewContainerRef;

  constructor(private dragDropService: DragDropService, private resolver: ComponentFactoryResolver) {
  }

  // component: Class for the component you want to create
  // inputs: An object with key/value pairs mapped to input name/input value
  @Input() set componentData(data: {component: any, inputs: any }) {
    if (!data) {
      return;
    }

    // Inputs need to be in the following format to be resolved properly
    let inputProviders = Object.keys(data.inputs).map((inputName) => {return {provide: inputName, useValue: data.inputs[inputName]};});
    let resolvedInputs = ReflectiveInjector.resolve(inputProviders);

    // We create an injector out of the data we want to pass down and this components injector
    let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.dynamicComponentContainer.parentInjector);

    // We create a factory out of the component we want to create
    let factory = this.resolver.resolveComponentFactory(data.component);

    // We create the component using the factory and the injector
    let component = factory.create(injector);

    // We insert the component into the dom container
    this.dynamicComponentContainer.insert(component.hostView);

    // Destroy the previously created component
    if (this.currentComponent) {
      this.currentComponent.destroy();
    }

    this.currentComponent = component;
  }

  ngOnInit() {
    this.setStyleByPercentage(this.initalConfig.dimensions);
    this.panelId = this.initalConfig.id;
    this.active = this.initalConfig.active;
    this.components = this.initalConfig.components;
    this.showComponent(this.initalConfig.activeComponentId || this.components[0].id);
    this.dragDropService.componentDroppedInsidePanel.subscribe(config => {

      if (this.panelId === config.panel) {
        console.log('component dropped inside panel', this.panelId);
        this.addComponent({
          id: config.component.id,
          header: config.component.header,
          type: config.component.type,
        });
      } else if (this.panelId === config.previousPanel) {
        this.destroyComponent(config.component.id);
      }

    });

    this.dragDropService.componentDroppedOutsidePanel.subscribe(config => {

      if (this.panelId === config.panelId) {
        this.destroyComponent(config.component.id);
      }
    });
  }

  handleHeaderMouseDown($event) {

    $event.stopPropagation();
    $event.preventDefault();
    this.dragDropService.setDragStart($event.clientX , $event.clientY - this.workspaceDimensions.top, $event.offsetX, $event.offsetY, $event.target);
    this.handleHeaderDragStart(event);
    let headerEl = $event.target;
    let firstTime = true;
    this.mouseMoveSub = this.mouseMoveObs.subscribe(event => {

      if (firstTime) {
        this.dragDropService.dropPanelId = this.panelId;
        firstTime = false;
      }
      this.dragDropService.isDragging = true;
      this.dragDropService.handleDrag(event.mouseX, event.mouseY  - this.workspaceDimensions.top);
      headerEl.classList.add('dragging');
    });
    this.mouseUpSub = this.mouseUpObs.subscribe(event => {

      headerEl.classList.remove('dragging');
      this.dragHeaderTransform = null;
      this.dragHeaderIndex = null;
      this.dragDropService.isDragging = false;
      this.mouseMoveSub.unsubscribe();
      this.mouseUpSub.unsubscribe();
      this.handleHeaderDragEnd(event);
    });
  }

  handleHeaderDragStart($event) {

    let component = this.components.find(component => component.id === $event.target.dataset.componentId);

    let data = {
      component: {
        id: component.id,
        type: component.type,
        header: component.header
      },
      panelId: this.panelId,
      panelDimensions: {
        height: this.relativeStyle.height,
        width: this.relativeStyle.width
      }
    };
    this.dragDropService.setDragData(data, $event.target);
  }

  handleHeaderMouseOver($event, headerIndex) {

    if (this.dragDropService.isDragging) {

      this.dragHeaderIndex = headerIndex;
      this.dragHeaderTransform = `translate(${this.dragDropService.getDraggingHeaderWidth()}px)`;
      console.log('dragheader transform', this.dragHeaderTransform);
      $event.target.classList.add('dragging-over');

      // if ($event.offsetX < $event.target.getBoundingClientRect().width / 2) {
      //   $event.target.classList.add('left');
      //   $event.target.classList.remove('right');
      // } else {
      //   $event.target.classList.add('right');
      //   $event.target.classList.remove('left');
      // }
    }
  }

  handleHeaderMouseLeave($event) {

    if (this.dragDropService.isDragging) {

      $event.target.classList.remove('dragging-over');
      $event.target.classList.remove('right');
      $event.target.classList.remove('left');
    }
  }

  handleHeaderDragEnd($event) {
    console.log('header drag end');
    this.dragDropService.handleDragEnd($event);
  }

  handleDragOver($event) {
    $event.preventDefault();
    this.setPanelActive();
    console.log('drag over', this.panelId);
    this.dragDropService.setDraggedOverPanel(this.panelId);
  }

  handleDragLeave($event) {

    if ($event.target.getAttribute('drop-container')) {
      this.dragDropService.setDraggedOverPanel(null);
    }
  }

  handleDragEnter($event) {
    this.dragDropService.setDraggedOverPanel(this.panelId);
    console.log('drag enter', this.panelId);
  }

  handleDrop($event) {
    console.log('drop', $event.dataTransfer.getData('text/plain'));
  }

  onDragPanelHeader(args) {
    this.draggingHeaderItem = true;
    this.draggingPanel = false;
  }

  onMouseEnter($event) {

    if (this.dragDropService.isDragging && $event.target.getAttribute('drop-container')) {
      this.setPanelActive();
      this.dragDropService.dropPanelId = this.panelId;
      this.dragDropService.setDraggedOverPanel(this.panelId);
    }
  }

  onMouseLeave($event) {
    console.log('mouse leave', $event.target);
    if (this.dragDropService.isDragging && $event.target.getAttribute('drop-container')) {
      this.dragDropService.dropPanelId = null;
      this.dragDropService.setDraggedOverPanel(null);
      this.dragHeaderIndex = null;
      this.dragHeaderTransform = null;
    }
  }

  onFinishDragPanelHeader() {
    this.draggingHeaderItem = false;
  }

  resizeStart($event, horizontalDirection, verticalDirection) {

    $event.preventDefault();
    this.setStyleByPixels(this.pixelStyle);
    this.setPanelActive();
    let resizeStartCoords = {
      x: $event.clientX,
      y: $event.clientY
    };
    let initialStyle = Object.assign({}, this.pixelStyle);

    this.mouseMoveSub = this.mouseMoveObs.subscribe(event => this.resize(horizontalDirection, verticalDirection, event, resizeStartCoords, initialStyle));
    this.mouseUpSub = this.mouseUpObs.subscribe(event => this.resizeEnd());
  }

  resize(horizontalDirection, verticalDirection, event, resizeStartCoords, initialStyle) {

    let resizeChange: any = {};
    let yChange = resizeStartCoords.y - event.mouseY;
    let xChange = resizeStartCoords.x - event.mouseX;

    switch (verticalDirection) {

        case 'n':

          resizeChange.height = Math.max(this.minHeight, Math.min(initialStyle.height + yChange, initialStyle.height + initialStyle.top)),
          resizeChange.top =  Math.max(0, initialStyle.top + (initialStyle.height + yChange <= this.minHeight ? (initialStyle.height - this.minHeight) : -yChange));
          break;

        case 's':

          resizeChange.height = Math.max(this.minHeight, Math.min(initialStyle.height - yChange, this.workspaceDimensions.height - initialStyle.top)),
          resizeChange.top = initialStyle.top;
          break;

        default:

          resizeChange.height = initialStyle.height;
          resizeChange.top = initialStyle.top;
          break;
    }

    switch (horizontalDirection){

        case 'e':

          resizeChange.width = Math.max(this.minWidth, Math.min(initialStyle.width - xChange, this.workspaceDimensions.width - initialStyle.left)),
          resizeChange.left = initialStyle.left;
          break;

        case 'w':

          resizeChange.width = Math.max(this.minWidth, Math.min(initialStyle.width + xChange, initialStyle.width + initialStyle.left));
          resizeChange.left = Math.max(0, initialStyle.left - (initialStyle.width + xChange <= this.minWidth ? (initialStyle.width - this.minWidth) * -1 : xChange));
          break;

        default:
          resizeChange.width = initialStyle.width;
          resizeChange.left = initialStyle.left;
    }

    this.setStyleByPixels(resizeChange);
  }

  resizeEnd() {

    this.mouseMoveSub.unsubscribe();
    this.mouseUpSub.unsubscribe();
    this.setStyleByPercentage(this.calculateRelativeStyle(this.pixelStyle));
    this.handlePanelChanged();
  }

  onDrag(event) {

    if (!this.draggingHeaderItem && this.draggingPanel) {

      let transform: any = {};
      transform.y = event.y - this.pixelStyle.top - this.workspaceDimensions.top;
      transform.x = event.x - this.pixelStyle.left;

      if (-transform.y >= this.pixelStyle.top) {
        transform.y = -this.pixelStyle.top;
      } else if (transform.y + this.pixelStyle.height + this.pixelStyle.top >= this.workspaceDimensions.height) {
        transform.y = this.workspaceDimensions.height - (this.pixelStyle.height + this.pixelStyle.top);
      }

      if (-transform.x >= this.pixelStyle.left) {
        transform.x = -this.pixelStyle.left;
      } else if (transform.x + this.pixelStyle.width + this.pixelStyle.left >= this.workspaceDimensions.width) {
        transform.x = this.workspaceDimensions.width - this.pixelStyle.left - this.pixelStyle.width;
      }

      this.transformValues = transform;
      this.transform = `translate3d(${transform.x}px, ${transform.y}px, 0px)`;
    }

  }

  onDragEnd(event) {

    if (this.draggingPanel && (this.transformValues.hasOwnProperty('x') && this.transformValues.hasOwnProperty('y'))) {

      this.pixelStyle.left += this.transformValues.x;
      this.pixelStyle.top += this.transformValues.y;
      this.setStyleByPercentage(this.calculateRelativeStyle(this.pixelStyle));
      this.transformValues = {};
      this.transform = null;
      this.draggingPanel = false;
      this.handlePanelChanged();
    }
  }

  onDragStart(event) {

    if (!this.draggingPanel && !this.draggingHeaderItem) {
      this.draggingPanel = true;
      this.setStyleByPixels(this.calculatePixelsStyle(this.relativeStyle));
    }
  }

  setPanelActive() {
    this.panelActive.emit({ panelId: this.panelId, order: this.order});
  }

  showComponent(componentId) {

    let componentType = this.components.find(component => component.id === componentId).type;

    this.activeComponentId = componentId;
    this.componentData = {
      component: this.componentOptions[componentType],
      inputs: {
        showNum: 2
      }
    };
    this.handlePanelChanged();
  }

  destroyComponent(componentId) {

    let component = this.components.find(component => component.id === componentId);
    this.components.splice(this.components.indexOf(component), 1);

    if (this.components.length) {
      this.handlePanelChanged();
    } else {
      this.destroyPanel();
    }
  }

  addComponent(component) {

    if (!this.components.find(cmpt => cmpt.id === component.id)) {
      this.components.push(component);
      this.showComponent(component.id);
    }
  }

  destroyPanel() {
    this.panelDestroyed.emit(this.panelId);
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
      activeComponentId: this.activeComponentId,
      components: this.components,
      order: this.order,
      id: this.panelId,
      active: 1
    })
  }
}
