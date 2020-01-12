import { Clock } from '@four/clock';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const finished = Promise.resolve();
let requestImmediate;
let cancelImmediate;
if (typeof requestAnimationFrame === 'function' &&
    typeof cancelAnimationFrame === 'function') {
    requestImmediate = requestAnimationFrame;
    cancelImmediate = cancelAnimationFrame;
}
else if (typeof setImmediate === 'function' &&
    typeof clearImmediate === 'function') {
    requestImmediate = setImmediate;
    cancelImmediate = clearImmediate;
}
class Loop {
    constructor({ interval = 0, fixed = false, type = 'immediate', clockType = undefined, clock = new Clock({ type: clockType }) } = {}) {
        this.throttle = Clock.throttle(() => this.interval);
        this.handlers = new Set();
        this.running = false;
        this.promise = finished;
        this.handler = () => this.tick();
        this.requestImmediate = () => {
            this.tick();
            this.immediateID = requestImmediate(this.requestImmediate);
        };
        this.requestInterval = () => {
            this.tick();
            this.intervalID = setInterval(this.handler, this.interval || 1);
        };
        this.cancelInterval = () => {
            clearInterval(this.intervalID);
            this.intervalID = undefined;
        };
        this.type = type;
        this.interval = interval;
        this.fixed = fixed;
        this.clock = clock;
        this.clock.interval = (delta) => this.fixed
            ? this.interval
            : this.throttle(delta);
    }
    static delay(duration) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(resolve => setTimeout(resolve, duration));
        });
    }
    static repeat(interval, handler) {
        return __awaiter(this, void 0, void 0, function* () {
            const loop = new this({ interval, type: 'interval' });
            const repeat = loop.repeat(handler);
            loop.start();
            yield repeat;
            loop.stop();
        });
    }
    cancelImmediate() {
        cancelImmediate(this.immediateID);
        this.immediateID = undefined;
    }
    request() {
        this.type === 'immediate' && requestImmediate
            ? this.requestImmediate()
            : this.requestInterval();
    }
    cancel() {
        this.type === 'immediate' && cancelImmediate
            ? this.cancelImmediate()
            : this.cancelInterval();
    }
    delay(duration) {
        return __awaiter(this, void 0, void 0, function* () {
            duration += this.clock.elapsed;
            return this.repeat(clock => clock.elapsed <= duration);
        });
    }
    repeat(handler) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                const repeat = (clock) => {
                    if (handler(clock) !== false)
                        return;
                    this.remove(repeat);
                    resolve();
                };
                this.add(repeat);
            });
        });
    }
    add(handler) {
        this.handlers.add(handler);
        return this;
    }
    remove(handler) {
        this.handlers.delete(handler);
        return this;
    }
    tick() {
        const clock = this.clock.tick();
        clock.delta && this.handlers.forEach(handler => handler(clock));
        return this;
    }
    start() {
        if (!this.running) {
            this.running = true;
            this.promise = new Promise((resolve) => { this.resolve = resolve; });
            this.clock.reset();
            this.request();
        }
        return this;
    }
    stop() {
        if (this.running) {
            this.cancel();
            this.resolve();
            this.running = false;
            this.promise = finished;
        }
        return this;
    }
    reset() {
        this.clock.reset(true);
        return this;
    }
}

function delay(duration) {
    return Loop.delay(duration);
}
function repeat(interval, handler) {
    return Loop.repeat(interval, handler);
}

export { Loop, delay, repeat };
//# sourceMappingURL=index.jsm.map
