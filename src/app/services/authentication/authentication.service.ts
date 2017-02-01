import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AuthenticationService {

  isAuthenticated: Subject<boolean>;

  private session;

  constructor(private http: Http) {

    this.isAuthenticated = new Subject();

    this.http.post('https://ciapi.cityindex.com/TradingAPI/session', {
      username: 'DM241228',
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

  private handleLoginResponse(response): void {

    if (response.Session) {
      this.session = response;
      this.isAuthenticated.next(true);
    }
  }
}
