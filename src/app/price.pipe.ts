/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform, WrappedValue, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';


let isPromise = (value) => {
    return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
};

let isObservable = (value) => {
  return value && typeof value.subscribe === 'function';
}

// import { invalidPipeArgumentError } from '@angular/common';

interface SubscriptionStrategy {
  createSubscription(async: any, updateLatestValue: any): any;
  dispose(subscription: any): void;
  onDestroy(subscription: any): void;
}

class ObservableStrategy implements SubscriptionStrategy {
  createSubscription(async: any, updateLatestValue: any): any {
    return async.subscribe({next: updateLatestValue, error: (e: any) => { throw e; }});
  }

  dispose(subscription: any): void { subscription.unsubscribe(); }

  onDestroy(subscription: any): void { subscription.unsubscribe(); }
}

class PromiseStrategy implements SubscriptionStrategy {
  createSubscription(async: Promise<any>, updateLatestValue: (v: any) => any): any {
    return async.then(updateLatestValue, e => { throw e; });
  }

  dispose(subscription: any): void {}

  onDestroy(subscription: any): void {}
}

const _promiseStrategy = new PromiseStrategy();
const _observableStrategy = new ObservableStrategy();

/**
 * @ngModule CommonModule
 * @whatItDoes Unwraps a value from an asynchronous primitive.
 * @howToUse `observable_or_promise_expression | async`
 * @description
 * The `async` pipe subscribes to an `Observable` or `Promise` and returns the latest value it has
 * emitted. When a new value is emitted, the `async` pipe marks the component to be checked for
 * changes. When the component gets destroyed, the `async` pipe unsubscribes automatically to avoid
 * potential memory leaks.
 *
 *
 * ## Examples
 *
 * This example binds a `Promise` to the view. Clicking the `Resolve` button resolves the
 * promise.
 *
 * {@example common/pipes/ts/async_pipe.ts region='AsyncPipePromise'}
 *
 * It's also possible to use `async` with Observables. The example below binds the `time` Observable
 * to the view. The Observable continuously updates the view with the current time.
 *
 * {@example common/pipes/ts/async_pipe.ts region='AsyncPipeObservable'}
 *
 * @stable
 */
@Pipe({name: 'price', pure: false})
export class PricePipe implements OnDestroy, PipeTransform {
  private _latestValue: Object = null;
  private _latestReturnedValue: Object = null;

  private _subscription: Object = null;
  private _obj: Observable<any>|Promise<any>|EventEmitter<any> = null;
  private _strategy: SubscriptionStrategy = null;

  constructor(private _ref: ChangeDetectorRef) {
    this._ref.detach();
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._dispose();
    }
  }

  transform(obj: Observable<any>|Promise<any>|EventEmitter<any>): any {
    if (!this._obj) {
      if (obj) {
        this._subscribe(obj);
      }
      this._latestReturnedValue = this._latestValue;
      return this._latestValue;
    }

    if (obj !== this._obj) {
      this._dispose();
      return this.transform(obj);
    }

    if (this._latestValue === this._latestReturnedValue) {
      return this._latestReturnedValue;
    }

    this._latestReturnedValue = this._latestValue;
    return WrappedValue.wrap(this._latestValue);
  }

  private _subscribe(obj: Observable<any>|Promise<any>|EventEmitter<any>): void {
    this._obj = obj;
    this._strategy = this._selectStrategy(obj);
    this._subscription = this._strategy.createSubscription(
        obj, (value: Object) => this._updateLatestValue(obj, value));
  }

  private _selectStrategy(obj: Observable<any>|Promise<any>|EventEmitter<any>): any {
    if (isPromise(obj)) {
      return _promiseStrategy;
    }

    if (isObservable(obj)) {
      return _observableStrategy;
    }

    // throw invalidPipeArgumentError(AsyncPipe, obj);
  }

  private _dispose(): void {
    this._strategy.dispose(this._subscription);
    this._latestValue = null;
    this._latestReturnedValue = null;
    this._subscription = null;
    this._obj = null;
  }

  private _updateLatestValue(async: any, value: Object): void {
    if (async === this._obj) {
      console.log('latest value', value);
      this._latestValue = value;
      // this._ref.markForCheck();
      this._ref.detectChanges();
    }
  }
}
