import { Clock, ClockType } from '@four/clock'

const finished = Promise.resolve()

type RequestImmediate = (handler: () => void) => NodeJS.Immediate | number
type CancelImmediate = (immediate: NodeJS.Immediate | number) => void

let requestImmediate: RequestImmediate | undefined
let cancelImmediate: CancelImmediate | undefined

if (
  typeof requestAnimationFrame === 'function' &&
  typeof cancelAnimationFrame === 'function'
) {
  requestImmediate = requestAnimationFrame
  cancelImmediate = cancelAnimationFrame as CancelImmediate
} else if (
  typeof setImmediate === 'function' &&
  typeof clearImmediate === 'function'
) {
  requestImmediate = setImmediate
  cancelImmediate = clearImmediate as CancelImmediate
}

export type LoopType = 'immediate' | 'interval'

export class Loop {
  private resolve?: () => void
  private immediateID?: NodeJS.Immediate | number
  private intervalID?: NodeJS.Timeout
  private throttle = Clock.throttle(() => this.interval)
  public handlers: Set<(clock: Clock) => void> = new Set()
  public interval: number
  public fixed: boolean
  public type: LoopType
  public running: boolean = false
  public promise: Promise<void> = finished
  public readonly handler = () => this.tick()
  public clock: Clock

  public static async delay(duration: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, duration))
  }

  public static async repeat(
    interval: number,
    handler: (clock: Clock) => boolean | void
  ): Promise<void> {
    const loop = new this({ interval, type: 'interval' })
    const repeat = loop.repeat(handler)

    loop.start()
    await repeat
    loop.stop()
  }

  public constructor(parameters?: {
    interval?: number
    fixed?: boolean
    type?: LoopType
    clockType?: ClockType
  })
  public constructor(parameters?: {
    interval?: number
    fixed?: boolean
    type?: LoopType
    clock?: Clock
  })
  public constructor({
    interval = 0,
    fixed = false,
    type = 'immediate',
    clockType = undefined,
    clock = new Clock({ type: clockType })
  }: {
    interval?: number
    fixed?: boolean
    type?: 'immediate' | 'interval'
    clockType?: ClockType
    clock?: Clock
  } = {}) {
    this.type = type
    this.interval = interval
    this.fixed = fixed
    this.clock = clock
    this.clock.interval = (delta: number) => this.fixed
      ? this.interval
      : this.throttle(delta)
  }

  private requestImmediate = (): void => {
    this.tick()
    this.immediateID = requestImmediate!(this.requestImmediate)
  }

  private cancelImmediate(): void {
    cancelImmediate!(this.immediateID!)
    this.immediateID = undefined
  }

  private requestInterval = (): void => {
    this.tick()
    this.intervalID = setInterval(this.handler, this.interval || 1)
  }

  private cancelInterval = (): void => {
    clearInterval(this.intervalID!)
    this.intervalID = undefined
  }

  protected request(): void {
    this.type === 'immediate' && requestImmediate
      ? this.requestImmediate()
      : this.requestInterval()
  }

  protected cancel(): void {
    this.type === 'immediate' && cancelImmediate
      ? this.cancelImmediate()
      : this.cancelInterval()
  }

  public async delay(duration: number): Promise<void> {
    duration += this.clock.elapsed
    return this.repeat(clock => clock.elapsed <= duration)
  }

  public async repeat(
    handler: (clock: Clock) => boolean | void
  ): Promise<void> {
    return new Promise((resolve) => {
      const repeat = (clock: Clock): void => {
        if (handler(clock) !== false) return
        this.remove(repeat)
        resolve()
      }

      this.add(repeat)
    })
  }

  public add(handler: (clock: Clock) => void): this {
    this.handlers.add(handler)
    return this
  }

  public remove(handler: (clock: Clock) => void): this {
    this.handlers.delete(handler)
    return this
  }

  public tick(): this {
    const clock = this.clock.tick()
    clock.delta && this.handlers.forEach(handler => handler(clock))
    return this
  }

  public start(): this {
    if (!this.running) {
      this.running = true
      this.promise = new Promise((resolve) => { this.resolve = resolve })
      this.clock.reset()
      this.request()
    }

    return this
  }

  public stop(): this {
    if (this.running) {
      this.cancel()
      this.resolve!()
      this.running = false
      this.promise = finished
    }

    return this
  }

  public reset(): this {
    this.clock.reset(true)
    return this
  }
}
