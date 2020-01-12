import { Clock } from '@four/clock'
import { Loop } from '@four/loop'

class Record extends Loop {
  private callback?: (clock: Clock) => Promise<void> | void
  private started: boolean = false
  private canceled: boolean = false
  public maximumDuration: number = Infinity

  public constructor() {
    super({ interval: 1 })
  }

  protected async request(): Promise<void> {
    if (this.canceled) return

    this.tick()
    await (this.callback && this.callback(this.clock))

    if (
      (this.empty && this.started) ||
      this.clock.elapsed >= this.maximumDuration
    ) {
      this.stop()
    } else {
      await this.request()
    }
  }

  protected cancel(): void {
    this.canceled = true
  }

  public get empty(): boolean {
    return !this.handlers.size
  }

  public get fixed(): boolean {
    return true
  }

  public set fixed(fixed: boolean) {

  }

  public start(): this {
    if (!this.running) {
      this.canceled = false
      this.started = false
    }

    return super.start()
  }

  public stop(): this {
    super.stop().handlers.clear()
    return this
  }

  public reset({
    interval = 1,
    maximumDuration = Infinity,
    callback = undefined
  }: {
    interval?: number
    maximumDuration?: number
    callback?: (clock: Clock) => Promise<void> | void
  } = {}): this {
    super.reset()
    this.interval = interval
    this.maximumDuration = maximumDuration
    this.callback = callback
    return this
  }

  public add(handler: (clock: Clock) => void): this {
    this.started = true
    return super.add(handler)
  }
}

const record = new Record()

export { record as Record }
