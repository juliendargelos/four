import { Loop } from '@four/loop';

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

class Record extends Loop {
    constructor() {
        super({ interval: 1 });
        this.started = false;
        this.canceled = false;
        this.maximumDuration = Infinity;
    }
    request() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.canceled)
                return;
            this.tick();
            yield (this.callback && this.callback(this.clock));
            if ((this.empty && this.started) ||
                this.clock.elapsed >= this.maximumDuration) {
                this.stop();
            }
            else {
                yield this.request();
            }
        });
    }
    cancel() {
        this.canceled = true;
    }
    get empty() {
        return !this.handlers.size;
    }
    get fixed() {
        return true;
    }
    set fixed(fixed) {
    }
    start() {
        if (!this.running) {
            this.canceled = false;
            this.started = false;
        }
        return super.start();
    }
    stop() {
        super.stop().handlers.clear();
        return this;
    }
    reset({ interval = 1, maximumDuration = Infinity, callback = undefined } = {}) {
        super.reset();
        this.interval = interval;
        this.maximumDuration = maximumDuration;
        this.callback = callback;
        return this;
    }
    add(handler) {
        this.started = true;
        return super.add(handler);
    }
}
const record = new Record();

const delay = Loop.delay;
const { request, cancel } = Loop.prototype;
class Recordable extends Loop {
    static delay(duration) {
        return record.running
            ? record.delay(duration)
            : delay.call(this, duration);
    }
    get interval() {
        return record.running ? record.interval : this._interval;
    }
    set interval(interval) {
        this._interval = interval;
    }
    get fixed() {
        return record.running ? record.fixed : this._fixed;
    }
    set fixed(fixed) {
        this._fixed = fixed;
    }
    request() {
        record.running
            ? record.add(this.handler)
            : request.call(this);
    }
    cancel() {
        record.running
            ? record.remove(this.handler)
            : cancel.call(this);
    }
}
const staticProperties = Object.getOwnPropertyDescriptors(Recordable);
const properties = Object.getOwnPropertyDescriptors(Recordable.prototype);
delete staticProperties.prototype;
Object.defineProperties(Loop, staticProperties);
Object.defineProperties(Loop.prototype, properties);

export { record as Record };
//# sourceMappingURL=index.jsm.map
