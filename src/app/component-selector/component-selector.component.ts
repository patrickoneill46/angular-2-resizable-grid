import { Component, OnInit} from '@angular/core';

import { WorkspaceService } from '../workspace.service';

@Component({
  selector: 'component-selector',
  templateUrl: './component-selector.component.html',
  styleUrls: ['./component-selector.component.scss']
})
export class ComponentSelectorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
