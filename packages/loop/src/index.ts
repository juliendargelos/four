import { Clock } from '@four/clock'
import { Loop, LoopType } from './loop'

export { Loop, LoopType }

export function delay(duration: number): Promise<void> {
  return Loop.delay(duration)
}

export function repeat(
  interval: number,
  handler: (clock: Clock) => boolean | void
): Promise<void> {
  return Loop.repeat(interval, handler)
}
