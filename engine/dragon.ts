import type { Directions } from '../levels/levelParser'
export class Dragon {
  fieldId: number;
  direction: Directions;
  canMove: boolean;

  constructor (startId: number, direction : Directions) {
    this.fieldId = startId
    this.direction = direction
  }
}
