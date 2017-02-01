import { Component, OnInit } from '@angular/core';

import { WatchlistService } from '../services/watchlist/watchlist.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss']
})
export class WatchlistComponent implements OnInit {

  constructor(private watchlistService: WatchlistService) { }

  ngOnInit() {
  }

}
