/** @license
 *  Copyright 2016 - present The Material Motion Authors. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *  use this file except in compliance with the License. You may obtain a copy
 *  of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  License for the specific language governing permissions and limitations
 *  under the License.
 */
"use strict";
const symbol_observable_1 = require("symbol-observable");
const wrapWithObserver_1 = require("./wrapWithObserver");
/**
 * An IndefiniteSubject is both an Observer and an Observable.  Whenever it
 * receives a value on `next`, it forwards that value to any subscribed
 * observers.
 *
 * IndefiniteSubject is a multicast Observable; it remembers the most recent
 * value dispatched and passes it to any new subscriber.
 */
class IndefiniteSubject {
    constructor() {
        // Keep track of all the observers who have subscribed, so we can notify them
        // when we get new values.  Note: JavaScript's Set collection is ordered.
        this._observers = new Set();
        this._hasStarted = false;
    }
    /**
     * Passes the supplied value to any currently-subscribed observers.  If an
     * observer `subscribe`s before `next` is called again, it will immediately
     * receive `value`.
     */
    next(value) {
        this._hasStarted = true;
        this._lastValue = value;
        // The parent stream has dispatched a value, so pass it along to all the
        // children, and cache it for any observers that subscribe before the next
        // dispatch.
        this._observers.forEach((observer) => observer.next(value));
    }
    /**
     * `subscribe` accepts either a function or an object with a next method.
     * `subject.next` will forward any value it receives to the function or method
     * provided here.
     *
     * Call the returned `unsubscribe` method to stop receiving values on this
     * particular observer.
     */
    subscribe(observerOrNext) {
        const observer = wrapWithObserver_1.default(observerOrNext);
        this._observers.add(observer);
        if (this._hasStarted) {
            observer.next(this._lastValue);
        }
        return {
            unsubscribe: () => {
                this._observers.delete(observer);
            }
        };
    }
    /**
     * Tells other libraries that know about observables that we are one.
     *
     * https://github.com/tc39/proposal-observable#observable
     */
    [symbol_observable_1.default]() {
        return this;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IndefiniteSubject;
//# sourceMappingURL=IndefiniteSubject.js.map