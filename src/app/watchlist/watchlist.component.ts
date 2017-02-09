import { Component, OnInit } from '@angular/core';

import { WatchlistService } from '../services/watchlist/watchlist.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit {

  watchlists: any;

  constructor(private watchlistService: WatchlistService) {

    this.watchlists = [];
  }

  ngOnInit() {
    this.watchlistService.watchlistSubject.subscribe(watchlists => this.watchlists = watchlists);
  }

}
