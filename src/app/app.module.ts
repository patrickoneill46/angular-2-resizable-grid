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
import { ComponentSelectorComponent } from './component-selector/component-selector.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { ChartComponent } from './chart/chart.component';
import { NewsComponent } from './news/news.component';

import { MarketInfoService } from './services/market-info/market-info.service';
import { MarketPricesService } from './services/market-prices/market-prices.service';
import { WatchlistService } from './services/watchlist/watchlist.service';
import { StreamingService } from './services/streaming/streaming.service';
import { AuthenticationService } from './services/authentication/authentication.service';

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
    MarketInfoService,
    MarketPricesService,
    StreamingService,
    WorkspaceService,
    WatchlistService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
