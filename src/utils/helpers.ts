/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const handleResponse = async (response: Response) => {
  if (response.ok) return await response.json()
  else return await Promise.reject(response.status)
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function cloneDeep<T extends object = object> (obj: T) {
  return (function _cloneDeep (item: T): T | Date | Set<unknown> | Map<unknown, unknown> | object | T[] {
    // Handle:
    // * null
    // * undefined
    // * boolean
    // * number
    // * string
    // * symbol
    // * function
    if (item === null || typeof item !== 'object') {
      return item
    }

    // Handle:
    // * Date
    if (item instanceof Date) {
      return new Date(item.valueOf())
    }

    // Handle:
    // * Array
    if (item instanceof Array) {
      const copy: any[] = []

      item.forEach((_, i) => (copy[i] = _cloneDeep(item[i])))

      return copy
    }

    // Handle:
    // * Set
    if (item instanceof Set) {
      const copy = new Set()

      item.forEach(v => copy.add(_cloneDeep(v)))

      return copy
    }

    // Handle:
    // * Map
    if (item instanceof Map) {
      const copy = new Map()

      item.forEach((v, k) => copy.set(k, _cloneDeep(v)))

      return copy
    }

    // Handle:
    // * Object
    if (item instanceof Object) {
      const copy: object = {}

      // Handle:
      // * Object.symbol
      // @ts-expect-error
      Object.getOwnPropertySymbols(item).forEach(s => (copy[s] = _cloneDeep(item[s])))

      // Handle:
      // * Object.name (other)
      // @ts-expect-error
      Object.keys(item).forEach(k => (copy[k] = _cloneDeep(item[k])))

      return copy
    }

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`Unable to copy object: ${item}`)
  })(obj)
}

export function hex2rgb (c: any): { r: number, g: number, b: number } {
  const bigint = parseInt(c.split('#')[1], 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return { r, g, b }
}

export function rgb2hsv ({ r, g, b }: { r: number, g: number, b: number }): { h: number, s: number, v: number } {
  let rr, gg, bb, h, s
  const rabs = r / 255
  const gabs = g / 255
  const babs = b / 255
  const v = Math.max(rabs, gabs, babs)
  const diff = v - Math.min(rabs, gabs, babs)
  // @ts-expect-error
  const diffc = c => (v - c) / 6 / diff + 1 / 2
  // @ts-expect-error
  const percentRoundFn = num => Math.round(num * 100) / 100
  if (diff == 0) {
    h = s = 0
  } else {
    s = diff / v
    rr = diffc(rabs)
    gg = diffc(gabs)
    bb = diffc(babs)

    if (rabs === v) {
      h = bb - gg
    } else if (gabs === v) {
      h = (1 / 3) + rr - bb
    } else if (babs === v) {
      h = (2 / 3) + gg - rr
    }
    // @ts-expect-error
    if (h < 0) {
      // @ts-expect-error
      h += 1
      // @ts-expect-error
    } else if (h > 1) {
      // @ts-expect-error
      h -= 1
    }
  }
  return {
    // @ts-expect-error
    h: Math.round(h * 360),
    s: percentRoundFn(s * 100),
    v: percentRoundFn(v * 100)
  }
}
