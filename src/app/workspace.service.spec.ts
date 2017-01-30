/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WorkspaceService } from './workspace.service';

describe('WorkspaceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkspaceService]
    });
  });

  it('should ...', inject([WorkspaceService], (service: WorkspaceService) => {
    expect(service).toBeTruthy();
  }));
});
