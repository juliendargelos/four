# Clock

Track elapsed and delta time. Supports both `Date.now` and `performance.now` and fallbacks on `getTime`. It can also be used with a fixed or computed tick interval.

### Install

```bash
yarn add @four/clock
```

### Usage

Instancing a new clock with no parameter will automatically choose between `Date.now`, and `getTime` methods depending on availability.

```typescript
import { Clock } from '@juliendargelos/clock'

const clock = new Clock()

setTimeout(() => {
  clock.tick()
  console.log(clock.delta, clock.elapsed) // 100, 100
}, 100)

setTimeout(() => {
  clock.tick()
  console.log(clock.delta, clock.elapsed) // 200, 300

  clock.reset()
  console.log(clock.delta, clock.elapsed) // 0, 300

  clock.reset(true) // Resets elasped time too
  console.log(clock.delta, clock.elapsed) // 0, 0
}, 200)

Clock.now() // Returns the current time with either Date.now or getTime
```

Explicitly set the method to use to get time:

```typescript
new Clock({ type: 'performance' })
new Clock({ type: 'date' })
new Clock({ type: 'getTime' })
new Clock({ type: () => Clock.now() * 2 }) // custom method
```

Use a fixed tick interval:

```typescript
const clock = new Clock({ interval: 2 })

clock.tick()
console.log(clock.delta, clock.elapsed) // 2, 2

clock.tick(4) // Overrides delta for this tick
console.log(clock.delta, clock.elapsed) // 4, 6

clock.tick()
console.log(clock.delta, clock.elapsed) // 2, 8
```

Use a computed tick interval:

```typescript
const clock = new Clock({ interval: () => Math.random() })

// A 'delta' parameter is passed containing the delta depending on clock type.
// The following clock is throttled by 10ms so its delta cannot increase by less than 10ms at each tick
const clock = new Clock({ interval: delta => delta >= 10 ? delta : 0 })

// There is a shortcut for throttling clocks
const clock = new Clock({ interval: Clock.throttle(10) })
```
