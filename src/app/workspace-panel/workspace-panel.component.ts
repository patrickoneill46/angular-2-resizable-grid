import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewContainerRef, ViewChild, ReflectiveInjector, ComponentFactoryResolver} from '@angular/core';
import { ResizeEvent } from 'angular2-resizable';
import { DragulaService } from 'ng2-dragula';

import { WatchlistComponent } from '../watchlist/watchlist.component';
import { ChartComponent } from '../chart/chart.component';
import { NewsComponent } from '../news/news.component';

@Component({
  selector: 'workspace-panel',
  templateUrl: './workspace-panel.component.html',
  styleUrls: ['./workspace-panel.component.scss'],
  entryComponents: [ChartComponent, NewsComponent, WatchlistComponent]
})
export class WorkspacePanelComponent implements OnInit {

  @Input() workspaceDimensions: ClientRect;
  @Input() initalConfig: any;
  @Input() order;

  @Output() panelActive: EventEmitter<any> = new EventEmitter();
  @Output() panelChanged: EventEmitter<any> = new EventEmitter();
  @Output() panelDestroyed: EventEmitter<any> = new EventEmitter();
  private relativeStyle: any = {};
  private pixelStyle: any = {};
  private dragStart: any = {};
  private panelId: string;

  private draggingHeaderItem: boolean = false;
  private draggingPanel: boolean = false;

  style: any = {};
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

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer: ViewContainerRef;

  constructor(private dragulaService: DragulaService, private resolver: ComponentFactoryResolver) {

    dragulaService.drag.subscribe(event => {
      this.onDragPanelHeader(event.slice(1));
    });

    dragulaService.dragend.subscribe(event => {
      this.onFinishDragPanelHeader();
    });

    this.validate = function(event: ResizeEvent){

      if (event.rectangle.top < this.workspaceDimensions.top || event.rectangle.left < 0 || event.rectangle.right > this.workspaceDimensions.width || event.rectangle.bottom > this.workspaceDimensions.height) {
        return false;
      }
      return true;
    }.bind(this);
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
  }

  onDragPanelHeader(args) {
    this.draggingHeaderItem = true;
  }

  onFinishDragPanelHeader() {
    this.draggingHeaderItem = false;
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

    if (this.draggingPanel && !this.draggingHeaderItem) {

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

  }

  onDragEnd(event) {

    if (this.draggingPanel) {
      this.setStyleByPercentage(this.calculateRelativeStyle(this.pixelStyle));
      this.dragStart = null;
      this.draggingPanel = false;
      this.handlePanelChanged();
    }
  }

  onDragStart(event) {

    if (!this.draggingPanel && !this.draggingHeaderItem) {
      this.draggingPanel = true;
      this.setStyleByPixels(this.calculatePixelsStyle(this.relativeStyle));
      this.dragStart = {
        x: event.x,
        y: event.y
      };
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

    let component = this.components.find(component => component.id = componentId);
    this.components.splice(this.components.indexOf(component), 1);

    if (this.components.length) {
      this.handlePanelChanged();
    } else {
      this.destroyPanel();
    }
  }

  addComponent(component) {

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
