import { Directions, GemColors } from '../levels/level'

export interface Dragon {
  fieldId: number;
  direction: Directions;
  gemsInPocket: Record<GemColors, number>
  canMove: boolean;
}

export function changeDragonDirection (dragon: Dragon, direction: Directions): Dragon {
  return { ...dragon, direction: direction }
}

export function moveDragon (dragon: Dragon, fieldId: number): Dragon {
  return { ...dragon, fieldId }
}
