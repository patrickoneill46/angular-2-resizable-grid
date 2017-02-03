import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';

import { AuthenticationService } from '../authentication/authentication.service';
import { MarketPricesService } from '../market-prices/market-prices.service';

@Injectable()
export class WatchlistService {

  private watchlists: any;

  constructor(
    private http: Http,
    private authenticationService: AuthenticationService,
    private marketPricesService: MarketPricesService
  ) {
    this.watchlists = {};
    this.http.get('https://ciapi.cityindex.com/TradingAPI/watchlists', this.authenticationService.getRequestHeaders())
      .map(response => response.json())
      .subscribe(response => this.saveWatchlists(response));
  }

  getWatchlists() {


  }

  saveWatchlists(response: any) {
    this.watchlists = response.ClientAccountWatchlists;
  }


}
