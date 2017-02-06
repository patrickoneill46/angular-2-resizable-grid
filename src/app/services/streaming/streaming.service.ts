import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AuthenticationService } from '../authentication/authentication.service';

import {
  connect,
  subscribeToPrice,
  subscribeToOrder,
  subscribeToClientAccountMargins,
  subscribeToTradeMargin,
  unsubscribeFromPrices,
  unsubscribeFromOrders,
  unsubscribeFromClientAccountMargins,
  unsubscribeFromTradeMargins,
  disconnect
} from './streaming';

@Injectable()
export class StreamingService {

  private lsUrl: string;
  private lsAdapter: string;
  private streamingStatus: BehaviorSubject<any>;

  constructor(private authenticationService: AuthenticationService) {

    this.streamingStatus = new BehaviorSubject(false);
    this.lsUrl = 'https://push.cityindex.com/';
    this.lsAdapter = 'STREAMINGALL';
    this.authenticationService.isAuthenticated.subscribe((value) => {
      this.connect();
    });
  }

  connect() {

    connect(
      this.authenticationService.getUsername(),
      this.authenticationService.getSessionKey(),
      this.lsUrl,
      this.lsAdapter,
      (response) => {
        this.connectionCallback(response);
      }
    );
  }

  subscribeToMarketPriceStream(marketId, onPricesItemUpdate) {

    if (this.streamingStatus.getValue()) {
      subscribeToPrice(
        marketId,
        update => {
          onPricesItemUpdate(JSON.parse(update));
        },
        (action, status, message) => this.streamingStatusCallback(action, status, message)
      );
    } else {
      let subscription = this.streamingStatus.subscribe(status => {

        if (status) {
          subscribeToPrice(
            marketId,
            update => {
              onPricesItemUpdate(JSON.parse(update));
            },
            (action, status, message) => this.streamingStatusCallback(action, status, message)
          );
          subscription.unsubscribe();
        }
      })
    }
  }

  private connectionCallback(response) {
    console.log('connection', response);
    this.streamingStatus.next(true);
  }

  private streamingStatusCallback(action, status, message, callback?) {
    console.log('streaming status callback', action, status, message);

    if (callback) {
      callback(action, status, message);
    }
  }
}
