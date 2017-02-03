/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MarketInfoService } from './market-info.service';

describe('MarketInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MarketInfoService]
    });
  });

  it('should ...', inject([MarketInfoService], (service: MarketInfoService) => {
    expect(service).toBeTruthy();
  }));
});
