import { delay, measure } from 'utils'
import { Record } from '../src'
import { Loop } from '@four/loop'

it('controls all loops', async () => {
  let delta!: number
  let elapsed!: number
  const interval = 60/1000
  const callback = jest.fn(async () => { elapsed = await delay() })
  const handler = jest.fn((clock) => {
    delta = clock.delta
    clock.elapsed >= interval * 2 && Record.stop()
  })

  const duration = await measure(async () => {
    Record.reset({ interval, callback }).start()
    await Loop.delay(interval)
    new Loop().add(handler).start()
    await Record.promise
  })

  expect(handler).toBeCalledTimes(2)
  expect(callback).toBeCalled()
  expect(callback).not.toBeCalledTimes(1)
  expect(delta).toBe(interval)
  expect(duration).toBeGreaterThanOrEqual(elapsed + interval)
})

it('stops as soon as there is no more running loop', async () => {
  const loop = new Loop()
  const handler = jest.fn((clock) => {
    clock.elapsed >= 2 && loop.stop()
  })

  Record.reset({ callback: async () => { await delay() } }).start()
  loop.add(handler).start()
  await Record.promise

  expect(handler).toBeCalledTimes(2)
})

it('does not modify loops behaviour when not running', async () => {
  const loop = new Loop()
  const handler = jest.fn((clock) => clock.elapsed <= 10)

  await loop.start().repeat(handler)
  loop.stop()

  expect(await measure(() => Loop.delay(10))).toBeGreaterThanOrEqual(10)

  expect(handler).toBeCalled()
  expect(handler).not.toBeCalledTimes(1)
})

it('starts and stops in the right order', () => {
  expect(() => Record.reset().start().start().stop().stop()).not.toThrow()
})
