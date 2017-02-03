import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AuthenticationService } from '../authentication/authentication.service';

@Injectable()
export class MarketInfoService {

  private marketInfoMap: any;
  private marketSearchUrl: string;

  constructor(private http: Http, private authenticationService: AuthenticationService) {

    this.marketInfoMap = {};
    this.marketSearchUrl = 'https://ciapi.cityindex.com/TradingAPI/market/{marketId}/information';
    this.getMarketInfo(99500);
  }

  getMarketInfo(marketId: number) {

    let marketInfo;

    if (this.marketInfoMap[marketId]) {
      marketInfo = this.marketInfoMap[marketId];
    } else {
      marketInfo = new BehaviorSubject(null);
      this.marketInfoMap[marketId] = marketInfo;
      this.requestMarketInfo(marketId);
    }

    return marketInfo.toPromise();
  }


  private requestMarketInfo(marketId) {

    return this.http.get(this.marketSearchUrl.replace('{marketId}', marketId), this.authenticationService.getRequestHeaders())
      .map(response => response.json().MarketInformation)
      .subscribe(response => {
        debugger;
        this.marketInfoMap[marketId].next({
          marketName: response.Name
        });
      });
  }

}
