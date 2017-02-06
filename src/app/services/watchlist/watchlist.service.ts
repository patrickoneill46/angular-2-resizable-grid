import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';

import { AuthenticationService } from '../authentication/authentication.service';
import { MarketInfoService } from '../market-info/market-info.service';
import { MarketPricesService } from '../market-prices/market-prices.service';

@Injectable()
export class WatchlistService {

  private watchlists: any;

  constructor(
    private http: Http,
    private authenticationService: AuthenticationService,
    private marketPricesService: MarketPricesService,
    private marketInfoService: MarketInfoService
  ) {
    this.watchlists = [];
    this.http.get('https://ciapi.cityindex.com/TradingAPI/watchlists', this.authenticationService.getRequestHeaders())
      .map(response => response.json())
      .subscribe(response => this.saveWatchlists(response));
  }

  getWatchlists() {


  }

  private saveWatchlists(response: any) {
    response.ClientAccountWatchlists.forEach(config => this.createWatchlist(config));
  }

  private createWatchlist(watchlistConfig: any) {

    let watchlist = {
      watchlistName: watchlistConfig.WatchlistDescription,
      watchlistId: watchlistConfig.WatchlistId,
      markets: []
    };

    watchlistConfig.Items.forEach(marketConfig => {

      let market: any = {};

      this.marketInfoService.getMarketInfo(marketConfig.MarketId).then(marketInfo => {
        market.marketName = marketInfo.marketName;
      });

      this.marketPricesService.subscribeToMarket(marketConfig.MarketId).subscribe(priceUpdate => {
        market.bid = priceUpdate.bid;
        market.offer = priceUpdate.offer;
      });

      watchlist.markets.push(market);
    });

    this.watchlists.push(watchlist);
  }

}
