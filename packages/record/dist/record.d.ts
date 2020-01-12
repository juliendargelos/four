import { Clock } from '@four/clock';
import { Loop } from '@four/loop';
declare class Record extends Loop {
    private callback?;
    private started;
    private canceled;
    maximumDuration: number;
    constructor();
    protected request(): Promise<void>;
    protected cancel(): void;
    readonly empty: boolean;
    fixed: boolean;
    start(): this;
    stop(): this;
    reset({ interval, maximumDuration, callback }?: {
        interval?: number;
        maximumDuration?: number;
        callback?: (clock: Clock) => Promise<void> | void;
    }): this;
    add(handler: (clock: Clock) => void): this;
}
declare const record: Record;
export { record as Record };
//# sourceMappingURL=record.d.ts.map