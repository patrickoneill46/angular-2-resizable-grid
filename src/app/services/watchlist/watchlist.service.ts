import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { AuthenticationService } from '../authentication/authentication.service';
import { MarketInfoService } from '../market-info/market-info.service';
import { MarketPricesService } from '../market-prices/market-prices.service';

@Injectable()
export class WatchlistService {

  private watchlists: any;
  watchlistSubject: BehaviorSubject<any>

  constructor(
    private http: Http,
    private authenticationService: AuthenticationService,
    private marketPricesService: MarketPricesService,
    private marketInfoService: MarketInfoService
  ) {
    this.watchlists = [];
    this.watchlistSubject = new BehaviorSubject(this.watchlists);
    this.http.get('https://ciapi.cityindex.com/TradingAPI/watchlists', this.authenticationService.getRequestHeaders())
      .map(response => response.json())
      .subscribe(response => this.saveWatchlists(response));
  }

  getWatchlists() {


  }

  private saveWatchlists(response: any) {
    response.ClientAccountWatchlists.forEach(config => this.createWatchlist(config));
    this.watchlistSubject.next(this.watchlists);
  }

  private createWatchlist(watchlistConfig: any) {

    let watchlist = {
      watchlistName: watchlistConfig.WatchlistDescription,
      watchlistId: watchlistConfig.WatchlistId,
      markets: []
    };

    watchlistConfig.Items.forEach(marketConfig => {

      let market: any = {
        marketName: null,
        bid: new BehaviorSubject(null),
        offer: new BehaviorSubject(null)
      };

      this.marketInfoService.getMarketInfo(marketConfig.MarketId).subscribe(marketInfo => {
        if (marketInfo) {
          market.marketName = marketInfo.marketName;
        }
      });

      this.marketPricesService.subscribeToMarket(marketConfig.MarketId).subscribe(priceUpdate => {
        market.bid.next(priceUpdate.bid);
        market.offer.next(priceUpdate.offer);
      });

      watchlist.markets.push(market);
    });

    this.watchlists.push(watchlist);
  }

}
