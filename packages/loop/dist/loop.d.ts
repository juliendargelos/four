import { Clock, ClockType } from '@four/clock';
export declare type LoopType = 'immediate' | 'interval';
export declare class Loop {
    private resolve?;
    private immediateID?;
    private intervalID?;
    private throttle;
    handlers: Set<(clock: Clock) => void>;
    interval: number;
    fixed: boolean;
    type: LoopType;
    running: boolean;
    promise: Promise<void>;
    readonly handler: () => this;
    clock: Clock;
    static delay(duration: number): Promise<void>;
    static repeat(interval: number, handler: (clock: Clock) => boolean | void): Promise<void>;
    constructor(parameters?: {
        interval?: number;
        fixed?: boolean;
        type?: LoopType;
        clockType?: ClockType;
    });
    constructor(parameters?: {
        interval?: number;
        fixed?: boolean;
        type?: LoopType;
        clock?: Clock;
    });
    private requestImmediate;
    private cancelImmediate;
    private requestInterval;
    private cancelInterval;
    protected request(): void;
    protected cancel(): void;
    delay(duration: number): Promise<void>;
    repeat(handler: (clock: Clock) => boolean | void): Promise<void>;
    add(handler: (clock: Clock) => void): this;
    remove(handler: (clock: Clock) => void): this;
    tick(): this;
    start(): this;
    stop(): this;
    reset(): this;
}
//# sourceMappingURL=loop.d.ts.map