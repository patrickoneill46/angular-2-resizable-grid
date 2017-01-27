import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

let defaultWorkspaceConfig = {
  id: 'default',
  displayName: 'Default workspace',
  active: 1,
  default: true,
  panels: [
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
  ]
};

@Injectable()
export class WorkspaceService {

  private workspaces: any;
  private localStorageKey: string = 'workspaces';
  private availableWorkspaces: BehaviorSubject<any>;

  componentSelectorActive: Subject<any>
  updatedWorkspace: BehaviorSubject<any>;

  constructor() {

    this.workspaces = {};
    this.componentSelectorActive = new Subject();

    let cachedSettings = JSON.parse(localStorage.getItem(this.localStorageKey));

    if (!cachedSettings) {
      this.saveWorkspace(defaultWorkspaceConfig.id, defaultWorkspaceConfig);
    } else {
      this.workspaces = cachedSettings;
    }
    this.updatedWorkspace = new BehaviorSubject(this.getActiveWorkspace());
    this.availableWorkspaces = new BehaviorSubject(this.workspaces);
  }

  saveWorkspace(id: string, config: any): void {
    this.workspaces[id] = config;
    Object.keys(this.workspaces).forEach(key => {
      if (key !== id) {
        this.workspaces[key].active = 0;
      }
    });
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.workspaces));
  }

  deleteWorkspace(id) {

    delete this.workspaces[id];
    let nextWorkspaceId = Object.keys(this.workspaces)[0];
    this.showWorkspace(nextWorkspaceId);
    this.availableWorkspaces.next(this.workspaces);
  }

  resetWorkspace() {
    this.workspaces = {};
    localStorage.setItem(this.localStorageKey, null);
  }

  getWorkspaces() {
    return this.availableWorkspaces.asObservable();
  }

  showWorkspace(workspaceId) {

    Object.keys(this.workspaces).forEach(key => {

      if (key === workspaceId) {
        this.workspaces[key].active = 1;
      } else {
        this.workspaces[key].active = 0;
      }
    });
    this.updatedWorkspace.next(this.workspaces[workspaceId]);
    this.saveWorkspace(workspaceId, this.workspaces[workspaceId]);
  }

  createNewWorkspace(workspaceName) {

    let newWorkspaceId = Math.random().toString();
    this.workspaces[newWorkspaceId] = {
      id: newWorkspaceId,
      displayName: workspaceName,
      panels: []
    };

    this.showWorkspace(newWorkspaceId);
    this.availableWorkspaces.next(this.workspaces);
  }

  private getActiveWorkspace() {

    return this.workspaces[Object.keys(this.workspaces).find(workspaceId => {
      return this.workspaces[workspaceId].active === 1;
    })];
  }
}
