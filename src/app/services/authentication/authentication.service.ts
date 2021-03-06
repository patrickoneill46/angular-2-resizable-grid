import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {

  isAuthenticated: Subject<any>;

  private session;
  private username: string = 'DM241228';

  constructor(private http: Http) {

    this.isAuthenticated = new Subject();

    this.http.post('https://ciapi.cityindex.com/TradingAPI/session', {
      username: this.username,
      password: 'password2'
    })
    .map(response => response.json())
    .subscribe(response => this.handleLoginResponse(response));
  }

  getUsername(): string {
    return 'DM241228';
  }

  getSessionKey(): string {
    return this.session.Session;
  }

  getRequestHeaders() {

    return new RequestOptions({
      headers: new Headers({
        UserName: this.username,
        Session: this.session.Session
      })
    });
  }

  private handleLoginResponse(response): void {

    if (response.Session) {
      this.session = response;
      this.isAuthenticated.next(true);
    }
  }
}
