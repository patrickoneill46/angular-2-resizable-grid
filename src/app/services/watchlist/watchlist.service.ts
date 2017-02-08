import { Injectable } from '@angular/core';

import { MarketInfoService } from '../market-info/market-info.service';
import { MarketPricesService } from '../market-prices/market-prices.service';

@Injectable()
export class WatchlistService {

  constructor(
    private marketInfoService: MarketInfoService,
    private marketPricesService: MarketPricesService
  ) {
    console.log('watchlist service constructor');
  }

}
