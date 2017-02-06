import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { StreamingService } from '../streaming/streaming.service';

@Injectable()
export class MarketPricesService {

  private priceSubscriptionMap: any;

  constructor(private streamingService: StreamingService) {

    console.log('market prices constructor');
    this.priceSubscriptionMap = {};
  }


  subscribeToMarket(marketId: number) {

    let subscription;

    if (this.priceSubscriptionMap[marketId]) {

      this.priceSubscriptionMap[marketId].numSubscriptions++;
      subscription = this.priceSubscriptionMap[marketId].priceSubject;
    } else {

      subscription = new BehaviorSubject({
        bid: null,
        offer: null
      });

      this.priceSubscriptionMap[marketId] = {
        numSubscriptions: 1,
        priceSubject: subscription
      };

      this.subscribeToPriceStream(marketId);
    }

    return subscription.asObservable();
  }

  unsubscribeFromMarket(marketId: number) {
    //ToDo: decrement subscriptions and unsubscribe if no more subscriptions;
  }

  private subscribeToPriceStream(marketId: number) {

    this.streamingService.subscribeToMarketPriceStream(marketId, response => {
      this.priceSubscriptionMap[marketId].priceSubject.next({
        bid: parseFloat(response.BidPrice),
        offer: parseFloat(response.OfferPrice)
      });
    });
  }

  private unsubscribeFromPriceStream(marketId: number) {

  }


}
