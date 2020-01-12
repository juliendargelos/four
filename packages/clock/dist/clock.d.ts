declare type BaseClockType = 'getTime' | 'date' | 'performance';
export declare type ClockType = BaseClockType | (() => number);
export declare class Clock {
    private _interval?;
    private getInterval;
    time: number;
    delta: number;
    elapsed: number;
    now: () => number;
    static readonly getTime: () => number;
    static readonly date: () => number;
    static readonly performance: () => number;
    static readonly now: () => number;
    static throttle(interval: (() => number) | number): (delta: number) => number;
    constructor({ type, interval, }?: {
        type?: ClockType;
        interval?: ((delta: number) => number) | number;
    });
    private getTimeInterval;
    interval: ((delta: number) => number) | number | undefined;
    type: ClockType;
    reset(elapsed?: boolean): this;
    tick(delta?: number): this;
}
export {};
//# sourceMappingURL=clock.d.ts.map