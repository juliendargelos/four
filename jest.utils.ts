const marginOfError = 1 // +/-

export const now = typeof performance !== 'undefined'
  ? performance.now.bind(performance)
  : Date.now || (() => new Date().getTime())

export async function delay(duration: number = 10): Promise<number> {
  return (await measure(() => (
    new Promise(resolve => setTimeout(resolve, duration))
  ))) - marginOfError * 2
}

export async function measure(callback: () => Promise<void>): Promise<number> {
  const beggining = now()
  await callback()
  return now() - beggining + marginOfError
}
