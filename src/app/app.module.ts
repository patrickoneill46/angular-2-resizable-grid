import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ResizableModule } from 'angular2-resizable';
import { DndModule } from 'ng2-dnd';

import { AppComponent } from './app.component';
import { DraggableDirective } from './draggable.directive';
import { WorkspacePanelComponent } from './workspace-panel/workspace-panel.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { WorkspaceService } from './workspace.service';
import { HeaderComponent } from './header/header.component';
import { ComponentSelectorComponent } from './component-selector/component-selector.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { ChartComponent } from './chart/chart.component';
import { NewsComponent } from './news/news.component';

@NgModule({
  declarations: [
    AppComponent,
    DraggableDirective,
    WorkspacePanelComponent,
    WorkspaceComponent,
    HeaderComponent,
    ComponentSelectorComponent,
    WatchlistComponent,
    ChartComponent,
    NewsComponent
  ],
  imports: [
    BrowserModule,
    DndModule.forRoot(),
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
