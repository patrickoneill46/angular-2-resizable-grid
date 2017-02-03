import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ResizableModule } from 'angular2-resizable';
import { DragulaModule } from 'ng2-dragula';

import { AuthenticationService } from './services/authentication/authentication.service';
import { MarketPricesService } from './services/market-prices/market-prices.service';
import { StreamingService } from './services/streaming/streaming.service';
import { WatchlistService } from './services/watchlist/watchlist.service';

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
    DragulaModule,
    FormsModule,
    HttpModule,
    ResizableModule
  ],
  providers: [
    AuthenticationService,
    MarketPricesService,
    StreamingService,
    WatchlistService,
    WorkspaceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
