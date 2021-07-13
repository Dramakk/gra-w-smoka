export class Multiset<T> {
  _backing = new Map();

  setInfinity (value: T): void {
    this._backing.set(value, Infinity)
  }

  setZero (value: T): void {
    this._backing.set(value, 0)
  }

  toArray (): [T, number][] {
    return [...this._backing.entries()]
  }

  add (value: T): void {
    if (this._backing.has(value)) {
      this._backing.set(value, 1 + this._backing.get(value))
    } else {
      this._backing.set(value, 1)
    }
  }

  delete (value: T): void {
    if (this._backing.get(value) > 0) {
      this._backing.set(value, this._backing.get(value) - 1)
    }
  }

  get (value: T): number {
    if (this._backing.get(value) > 0) {
      return this._backing.get(value)
    } else {
      return -1
    }
  }
}
