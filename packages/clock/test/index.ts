import { delay } from 'utils'
import { Clock } from '../src'

it('returns the current time', () => {
  expect(typeof Clock.now()).toBe('number')
})

it('runs by date', async () => {
  const clock = new Clock()
  const customClock = new Clock({ type: () => -Clock.now() })
  const getTimeClock = new Clock({ type: 'getTime' })
  const dateClock = new Clock({ type: 'date' })
  const performanceClock = new Clock({ type: 'performance' })

  const elapsed = await delay()

  expect(clock.tick().elapsed).toBeGreaterThanOrEqual(elapsed)
  expect(customClock.tick().elapsed).toBeLessThanOrEqual(-elapsed)
  expect(getTimeClock.tick().elapsed).toBeGreaterThanOrEqual(elapsed)
  expect(dateClock.tick().elapsed).toBeGreaterThanOrEqual(elapsed)
  expect(performanceClock.tick().elapsed).toBeGreaterThanOrEqual(elapsed)
})

it('runs by fixed interval', () => {
  const clock = new Clock({ interval: 1 })
  expect(clock.tick().tick().elapsed).toBe(2)
  expect(clock.tick(20).elapsed).toBe(22)
})

it('runs by computed interval', async () => {
  let interval = 1
  const triangularSequence = () => interval++
  const throttle = 20

  const triangularSequenceClock = new Clock({ interval: triangularSequence })
  const throttlingClock = new Clock({ interval: Clock.throttle(throttle) })
  const computedThrottlingClock = new Clock({
    interval: Clock.throttle(() => throttle)
  })

  expect(triangularSequenceClock.interval).toBe(triangularSequence)

  expect(triangularSequenceClock.tick().tick().tick().elapsed)
    .toBe(/* 1 + 2 + 3 = */6)

  await delay(throttle / 2)

  expect(throttlingClock.tick().elapsed).toBe(0)
  expect(computedThrottlingClock.tick().elapsed).toBe(0)

  await delay(throttle / 2)

  expect(throttlingClock.tick().elapsed)
    .toBeGreaterThanOrEqual(throttle)

  expect(computedThrottlingClock.tick().elapsed)
    .toBeGreaterThanOrEqual(throttle)
})

it('resets', async () => {
  const clock =  new Clock()
  const time = clock.time

  expect(clock.tick(2).reset(true).elapsed).toBe(0)

  const elapsed = await delay()

  expect(clock.reset().time).toBeGreaterThanOrEqual(time + elapsed)
})

it('has a type', () => {
  const clock = new Clock({ type: 'getTime' })
  expect(clock.now).toBe(Clock.getTime)
  expect(clock.type).toBe('getTime')

  clock.now = () => -Clock.now()
  expect(clock.type).toBe(clock.now)
})
