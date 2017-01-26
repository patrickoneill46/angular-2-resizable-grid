import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

let panelConfig = [
  {
    dimensions: {
      height: 20,
      width: 30,
      top: 10,
      left: 10
    },
    order: 3,
    id: 'panel1',
    active: 1,
    components: [
      {
        header: 'Watchlist Component',
        id: 'firstComponent',
        type: 'Watchlist'
      },
      {
        header: 'Chart Component',
        id: 'secondComponent',
        type: 'Chart'
      },
      {
        header: 'News Component',
        id: 'thirdComponent',
        type: 'News'
      }
    ]
  },
  {
    dimensions: {
      height: 20,
      width: 30,
      top: 80,
      left: 70
    },
    order: 2,
    id: 'panel2',
    active: 0,
    components: [
      {
        header: 'Watchlist Component',
        id: 'fourthComponent',
        type: 'Watchlist'
      },
      {
        header: 'Chart Component',
        id: 'fifthComponent',
        type: 'Chart'
      },
      {
        header: 'News Component',
        id: 'sixComponent',
        type: 'News'
      }
    ]
  },
  {
    dimensions: {
      height: 32,
      width: 61,
      top: 21,
      left: 11
    },
    order: 1,
    id: 'panel3',
    active: 0,
    components: [
      {
        header: 'Watchlist Component',
        id: 'seventhComponent',
        type: 'Watchlist'
      }
    ]
  }
];

@Injectable()
export class WorkspaceService {

  private workspaces: any;
  private localStorageKey: string = 'workspaces';

  constructor() {

    this.workspaces = {};

    let cachedSettings = JSON.parse(localStorage.getItem(this.localStorageKey));

    if (!cachedSettings) {
      this.saveWorkspace('default', panelConfig);
      cachedSettings = panelConfig;
    } else {
      this.workspaces = cachedSettings;
    }
  }

  getWorkspace(id: string): Promise<any> {
    return new Promise((resolve, reject) => resolve(this.workspaces[id]));
  }

  saveWorkspace(id: string, config: Array<any>): void {
    this.workspaces[id] = config;
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.workspaces));
  }


  resetWorkspace() {
    this.saveWorkspace('default', panelConfig);
  }

  getWorkspaces() {

  }
}
