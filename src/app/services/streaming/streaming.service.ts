import { Injectable } from '@angular/core';

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

  constructor() {

    console.log(connect);
  }

}
