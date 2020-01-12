import { Loop } from '@four/loop'
import { Record } from './record'

const delay = Loop.delay

const { request, cancel } = Loop.prototype as unknown as Loop & {
  request(): void
  cancel(): void
}

class Recordable extends Loop {
  private _interval!: number
  private _fixed!: boolean

  public static delay(duration: number): Promise<void> {
    return Record.running
      ? Record.delay(duration)
      : delay.call(this, duration)
  }

  public get interval(): number {
    return Record.running ? Record.interval : this._interval
  }

  public set interval(interval: number) {
    this._interval = interval
  }

  public get fixed(): boolean {
    return Record.running ? Record.fixed : this._fixed
  }

  public set fixed(fixed: boolean) {
    this._fixed = fixed
  }

  protected request(): void {
    Record.running
      ? Record.add(this.handler)
      : request.call(this)
  }

  protected cancel(): void {
    Record.running
      ? Record.remove(this.handler)
      : cancel.call(this)
  }
}

const staticProperties = Object.getOwnPropertyDescriptors(Recordable)
const properties = Object.getOwnPropertyDescriptors(Recordable.prototype)

delete staticProperties.prototype

Object.defineProperties(Loop, staticProperties)
Object.defineProperties(Loop.prototype, properties)
