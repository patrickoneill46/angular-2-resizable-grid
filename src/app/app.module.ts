import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ResizableModule } from 'angular2-resizable';

import { AppComponent } from './app.component';
import { DraggableDirective } from './draggable.directive';
import { WorkspacePanelComponent } from './workspace-panel/workspace-panel.component';
import { WorkspaceComponent } from './workspace/workspace.component';

@NgModule({
  declarations: [
    AppComponent,
    DraggableDirective,
    WorkspacePanelComponent,
    WorkspaceComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ResizableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
