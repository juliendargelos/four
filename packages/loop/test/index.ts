import { delay, measure } from 'utils'
import { Clock } from '@four/clock'
import {
  Loop,
  LoopType,
  delay as loopDelay,
  repeat as loopRepeat
} from '../src'

it('runs by tick', async () => {
  let elapsed: number
  let loopElapsed: number = 0
  const loop: Loop = new Loop({ clockType: 'performance' })
    .add((clock) => { loopElapsed += clock.delta })

  elapsed = await delay()

  loop.tick()
  expect(loopElapsed).toBeGreaterThanOrEqual(elapsed)
  elapsed += await delay()

  expect(loopElapsed).toBeLessThan(elapsed)
  loop.tick()
  expect(loopElapsed).toBeGreaterThanOrEqual(elapsed)
})

it('runs by fixed interval', async () => {
  const loop: Loop = new Loop({
    fixed: true,
    interval: 2
  })

  expect(loop.tick().clock.elapsed).toBe(2)
  expect(loop.tick().clock.elapsed).toBe(4)
})

it('runs after started and until stopped', async () => {
  let elapsed: number
  let immediateElapsed: number = 0
  let intervalElapsed: number = 0
  const immediateHandler = jest.fn()
  const intervalHandler = jest.fn()

  const immediateLoop = new Loop({
    type: 'immediate',
    clockType: 'performance'
  })
    .add((clock) => { immediateElapsed += clock.delta })

  const intervalLoop: Loop = new Loop({
    type: 'interval',
    clockType: 'performance'
  })
    .add((clock) => { intervalElapsed += clock.delta })

  immediateLoop.start()
  intervalLoop.start()
  elapsed = await delay()
  await delay(1)

  expect(immediateElapsed).toBeGreaterThanOrEqual(elapsed)
  expect(intervalElapsed).toBeGreaterThanOrEqual(elapsed)
  immediateLoop.stop().add(immediateHandler)
  intervalLoop.stop().add(intervalHandler)
  elapsed += await delay()

  expect(immediateElapsed).toBeLessThan(elapsed)
  expect(immediateHandler).not.toBeCalled()
  expect(intervalElapsed).toBeLessThan(elapsed)
  expect(intervalHandler).not.toBeCalled()
})

it('starts and stops in the right order', () => {
  expect(() => new Loop().start().start().stop().stop()).not.toThrow()
})

it('delays and repeats', async () => {
  const loop = new Loop({ type: 'immediate', clockType: 'performance' }).start()
  const handler = jest.fn((clock) => clock.elapsed < 10)
  const staticHandler = jest.fn((clock) => clock.elapsed < 10)

  const [elapsed, staticElapsed] = await Promise.all([
    measure(() => loop.delay(10)),
    measure(() => loopDelay(10)),
    loop.repeat(handler),
    loopRepeat(0, staticHandler)
  ])

  expect(elapsed).toBeGreaterThanOrEqual(10)
  expect(staticElapsed).toBeGreaterThanOrEqual(10)
  expect(handler).toBeCalled()
  expect(handler).not.toBeCalledTimes(1)
  expect(staticHandler).toBeCalled()
  expect(staticHandler).not.toBeCalledTimes(1)
})

it('throttles', async () => {
  const interval = 60/1000

  const [elapsed, staticElapsed] = await Promise.all([
    measure(() => new Loop({ interval }).start().repeat(() => false)),
    measure(() => loopRepeat(interval, () => false))
  ])

  expect(elapsed).toBeGreaterThanOrEqual(interval)
  expect(staticElapsed).toBeGreaterThanOrEqual(interval)
})

it('resets', () => {
  expect(new Loop({ fixed: true, interval: 1 })
    .start()
    .tick()
    .reset()
    .clock
    .elapsed
  ).toBe(0)
})
