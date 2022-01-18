
// ssr support
export const inBrowser = typeof window !== 'undefined'
export const ua = inBrowser && navigator.userAgent.toLowerCase()
export const isAndroid = ua && ua.indexOf('android') > 0
export const isIOS = ua && /iphone|ipad|ipod|ios/.test(ua)

export function getIOSVersion (ua) {
  const regex = /os (\d\d?_\d(_\d)?)/
  const matches = regex.exec(ua)
  if (!matches) return null
  const parts = matches[1].split('_').map(function (item) {
    return parseInt(item, 10)
  })
  return {
    major: parts[0],
    minor: parts[1],
    patch: parts[2] || 0
  }
}

export function getUseTransition () {
  let useTransition = true
  if (isIOS) {
    const version = getIOSVersion(ua)
    if (!version) return useTransition

    if (version.major >= 13 && version.minor >= 3) {
      useTransition = false
    }
  }
  return useTransition
}

const camelizeRE = /-(\w)/g
export function camelize (str) {
  str = String(str)
  return str.replace(camelizeRE, function (m, c) {
    return c ? c.toUpperCase() : ''
  })
}

export function noop () {}

export function isDef (val) {
  return val !== undefined && val !== null
}

export function isFunction (val) {
  return typeof val === 'function'
}

export function isObject (val) {
  return val !== null && typeof val === 'object'
}

export function isPromise (val) {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}
