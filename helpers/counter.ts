export interface Counter<T> {
  _backing: Map<T, number>
}

export function createCounter<T> (): Counter<T> {
  return { _backing: new Map() }
}

export function items<T> (counter: Counter<T>): Map<T, number> {
  return counter._backing
}

export function setInfinity<T> (counter: Counter<T>, value: T): Counter<T> {
  const _backing = new Map(counter._backing.entries())

  _backing.set(value, Infinity)
  return { _backing }
}

export function setZero<T> (counter: Counter<T>, value: T): Counter<T> {
  counter._backing.set(value, 0)
  return { ...counter }
}

export function add<T> (counter: Counter<T>, value: T): Counter<T> {
  const _backing = new Map(counter._backing.entries())

  if (_backing.has(value)) {
    _backing.set(value, 1 + _backing.get(value))
  } else {
    _backing.set(value, 1)
  }

  return { _backing }
}

export function counterDelete<T> (counter: Counter<T>, value: T): Counter<T> {
  const _backing = new Map(counter._backing.entries())

  if (_backing.get(value) > 0) {
    _backing.set(value, _backing.get(value) - 1)
  }

  return { _backing }
}

export function get<T> (counter: Counter<T>, value: T): number {
  if (!counter._backing.has(value)) {
    return -1
  }

  return counter._backing.get(value)
}
