import { Injectable } from '@angular/core';

import { StreamingService } from '../streaming/streaming.service';

@Injectable()
export class MarketPricesService {

  constructor(private streamingService: StreamingService) {
    console.log('market prices service constructor');
  }

}
