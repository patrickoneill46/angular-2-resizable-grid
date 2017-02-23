import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DndModule } from 'ng2-dnd';

import { AuthenticationService } from './services/authentication/authentication.service';
import { MarketInfoService } from './services/market-info/market-info.service';
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
import { PricePipe } from './price.pipe';

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
    NewsComponent,
    PricePipe
  ],
  imports: [
    BrowserModule,
    DndModule.forRoot(),
    FormsModule,
    HttpModule,
  ],
  providers: [
    AuthenticationService,
    MarketInfoService,
    MarketPricesService,
    StreamingService,
    WatchlistService,
    WorkspaceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
