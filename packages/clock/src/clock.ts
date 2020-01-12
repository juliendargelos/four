type BaseClockType = 'getTime' | 'date' | 'performance'

const types: BaseClockType[] = ['getTime', 'date', 'performance']

export type ClockType = BaseClockType | (() => number)

export class Clock {
  private _interval?: ((delta: number) => number) | number
  private getInterval!: () => number
  public time!: number
  public delta!: number
  public elapsed!: number
  public now!: () => number

  public static readonly getTime = () => new Date().getTime()
  public static readonly date = Date.now || Clock.getTime
  public static readonly performance = typeof performance === 'undefined'
    ? Clock.date
    : performance.now.bind(performance)

  public static readonly now = Clock.date

  public static throttle(
    interval: (() => number) | number
  ): (delta: number) => number {
    return typeof interval === 'number'
      ? (delta: number) => delta >= interval ? delta : 0
      : (delta: number) => delta >= interval() ? delta : 0
  }

  public constructor({
    type = 'date',
    interval = undefined,
  }: {
    type?: ClockType
    interval?: ((delta: number) => number) | number
  } = {}) {
    this.type = type
    this.interval = interval
    this.reset(true)
  }

  private getTimeInterval(): number {
    return this.now() - this.time
  }

  public get interval(): ((delta: number) => number) | number | undefined {
    return this._interval
  }

  public set interval(v: ((delta: number) => number) | number | undefined) {
    this._interval = v

    switch (typeof v) {
      case 'number':
        this.getInterval = () => v
        break

      case 'function':
        this.getInterval = () => v(this.getTimeInterval())
        break

      default:
        this.getInterval = this.getTimeInterval
    }
  }

  public get type(): ClockType {
    return types.find(type => Clock[type] === this.now) || this.now
  }

  public set type(type: ClockType) {
    this.now = typeof type === 'function' ? type : Clock[type]
  }

  public reset(elapsed: boolean = false): this {
    this.delta = 0
    this.time = this.now()
    if (elapsed) this.elapsed = 0
    return this
  }

  public tick(delta: number = this.getInterval()): this {
    this.delta = delta
    this.time += delta
    this.elapsed += delta
    return this
  }
}
