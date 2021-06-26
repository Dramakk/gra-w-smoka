import type { Directions } from '../levels/fields'
export class Dragon {
  fieldId: number;
  direction: Directions;
  canMove: boolean;

  constructor (startId: number) {
    this.fieldId = startId
    this.direction = 'R'
  }
}
