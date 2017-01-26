import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ResizableModule } from 'angular2-resizable';
import { DragulaModule } from 'ng2-dragula';

import { AppComponent } from './app.component';
import { DraggableDirective } from './draggable.directive';
import { WorkspacePanelComponent } from './workspace-panel/workspace-panel.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { WorkspaceService } from './workspace.service';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    DraggableDirective,
    WorkspacePanelComponent,
    WorkspaceComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    DragulaModule,
    FormsModule,
    HttpModule,
    ResizableModule
  ],
  providers: [
    WorkspaceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
