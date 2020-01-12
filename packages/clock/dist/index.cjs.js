'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const types = ['getTime', 'date', 'performance'];
class Clock {
    constructor({ type = 'date', interval = undefined, } = {}) {
        this.type = type;
        this.interval = interval;
        this.reset(true);
    }
    static throttle(interval) {
        return typeof interval === 'number'
            ? (delta) => delta >= interval ? delta : 0
            : (delta) => delta >= interval() ? delta : 0;
    }
    getTimeInterval() {
        return this.now() - this.time;
    }
    get interval() {
        return this._interval;
    }
    set interval(v) {
        this._interval = v;
        switch (typeof v) {
            case 'number':
                this.getInterval = () => v;
                break;
            case 'function':
                this.getInterval = () => v(this.getTimeInterval());
                break;
            default:
                this.getInterval = this.getTimeInterval;
        }
    }
    get type() {
        return types.find(type => Clock[type] === this.now) || this.now;
    }
    set type(type) {
        this.now = typeof type === 'function' ? type : Clock[type];
    }
    reset(elapsed = false) {
        this.delta = 0;
        this.time = this.now();
        if (elapsed)
            this.elapsed = 0;
        return this;
    }
    tick(delta = this.getInterval()) {
        this.delta = delta;
        this.time += delta;
        this.elapsed += delta;
        return this;
    }
}
Clock.getTime = () => new Date().getTime();
Clock.date = Date.now || Clock.getTime;
Clock.performance = typeof performance === 'undefined'
    ? Clock.date
    : performance.now.bind(performance);
Clock.now = Clock.date;

exports.Clock = Clock;
//# sourceMappingURL=index.cjs.js.map
