import { Directions, GemColors } from '../levels/level'

export interface Dragon {
  fieldId: number;
  direction: Directions;
  gemsInPocket: Record<GemColors, number>
  canMove: boolean;
}

export const DragonManipulation = {
  changeDragonDirection: function (dragon: Dragon, direction: Directions): Dragon {
    return { ...dragon, direction: direction }
  },

  moveDragon: function (dragon: Dragon, fieldId: number): Dragon {
    return { ...dragon, fieldId }
  },

  changePocketGemsQty: function (dragon: Dragon, color: GemColors, changeInQty: number): Dragon {
    const finalValue = dragon.gemsInPocket[color] + changeInQty < 0 ? 0 : dragon.gemsInPocket[color] + changeInQty
    return { ...dragon, gemsInPocket: { ...dragon.gemsInPocket, [color]: finalValue } }
  },

  // Removes all gems of given color
  removeAllGems: function (dragon: Dragon, color: GemColors): Dragon {
    return { ...dragon, gemsInPocket: { ...dragon.gemsInPocket, [color]: 0 } }
  }
}
