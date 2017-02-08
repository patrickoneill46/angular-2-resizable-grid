import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Subject } from 'rxjs/Subject';

@Injectable()
export class AuthenticationService {

  isAuthenticated: Subject<any>;

  private session;
  private username;

  constructor(private http: Http) {

    console.log('authentication service constructor');
    let username = 'DM241228';

    this.isAuthenticated = new Subject();
    this.http.post('https://ciapi.cityindex.com/TradingAPI/session', {
      username: username,
      password: 'password2'
    })
    .map(response => response.json())
    .subscribe(response => this.handleLoginResponse(username, response));
  }

  private handleLoginResponse(username, response) {

    if(response.Session) {
      this.username = username;
      this.session = response.Session;
      this.isAuthenticated.next(true);
    }

  }


}
