switch (environment) {
  case 'node':

    break

  case 'browser':
    window.requestAnimationFrame = window.setImmediate
    window.cancelAnimationFrame = window.clearImmediate
    delete window.setImmediate
    delete window.clearImmediate
    break

  case 'old browser':
    delete window.requestAnimationFrame
    delete window.cancelAnimationFrame
    delete window.setImmediate
    delete window.clearImmediate
    delete window.performance
    delete Date.now
    break
}
