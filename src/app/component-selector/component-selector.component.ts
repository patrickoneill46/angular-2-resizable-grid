import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { WorkspaceService } from '../workspace.service';

@Component({
  selector: 'component-selector',
  templateUrl: './component-selector.component.html',
  styleUrls: ['./component-selector.component.scss']
})
export class ComponentSelectorComponent implements OnInit {

  @Output() componentAdded: EventEmitter<any> = new EventEmitter();

  components: any[] = [
    {
      header: 'Watchlist Component',
      type: 'Watchlist'
    },
    {
      header: 'Chart Component',
      type: 'Chart'
    },
    {
      header: 'News Component',
      type: 'News'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  addComponentToWorkspace(component) {
    this.componentAdded.emit(component);
  }

}
