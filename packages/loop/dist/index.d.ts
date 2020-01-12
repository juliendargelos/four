import { Clock } from '@four/clock';
import { Loop, LoopType } from './loop';
export { Loop, LoopType };
export declare function delay(duration: number): Promise<void>;
export declare function repeat(interval: number, handler: (clock: Clock) => boolean | void): Promise<void>;
//# sourceMappingURL=index.d.ts.map