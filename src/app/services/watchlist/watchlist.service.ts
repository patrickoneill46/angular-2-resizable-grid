import { Injectable } from '@angular/core';

import { StreamingService } from '../streaming/streaming.service';

@Injectable()
export class WatchlistService {

  constructor(private streamingService: StreamingService) {
    console.log('watchlist service constructor');
  }

}
