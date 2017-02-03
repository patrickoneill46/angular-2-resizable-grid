/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MarketPricesService } from './market-prices.service';

describe('MarketPricesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MarketPricesService]
    });
  });

  it('should ...', inject([MarketPricesService], (service: MarketPricesService) => {
    expect(service).toBeTruthy();
  }));
});
