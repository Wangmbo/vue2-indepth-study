export function isFuntion(data) {
  return typeof data === 'function'
}

export function isObject(val) {
  return typeof val === 'object' && val != null
}