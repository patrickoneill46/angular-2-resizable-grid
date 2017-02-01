import { Injectable } from '@angular/core';

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


  constructor(private authenticationService: AuthenticationService) {

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

  private connectionCallback(response) {
    console.log('connection', response);
  }
}
