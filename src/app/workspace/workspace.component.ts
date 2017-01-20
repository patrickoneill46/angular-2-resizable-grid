import { Component, OnInit, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {

  private dimensions: ClientRect;

  workspacePanels: Array<any>;

  constructor(private ref: ElementRef) {

    this.workspacePanels = [];
  }

  ngOnInit() {
    this.setWorkspaceDimensions();
    this.initalizeWorkspacePanels();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.setWorkspaceDimensions();
  }

  private setWorkspaceDimensions(): void {
    this.dimensions =  this.ref.nativeElement.getBoundingClientRect();
  }

  private initalizeWorkspacePanels(): void {
    this.workspacePanels = [
      {
        dimensions: {
          height: 20,
          width: 30,
          top: 10,
          left: 10
        }
      }
    ]
  }
}
