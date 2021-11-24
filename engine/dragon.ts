import update from 'immutability-helper'
import { Directions, GemColors } from '../levels/level'

export interface Dragon {
  fieldId: number;
  direction: Directions;
  gemsInPocket: Record<GemColors, number>
  canMove: boolean;
}

export const DragonManipulation = {
  changeDragonDirection: function (dragon: Dragon, direction: Directions): Dragon {
    return update(dragon, {
      $merge: { direction: direction }
    })
  },

  moveDragon: function (dragon: Dragon, fieldId: number): Dragon {
    return update(dragon, {
      $merge: { fieldId: fieldId }
    })
  },

  changePocketGemsQty: function (dragon: Dragon, color: GemColors, changeInQty: number): Dragon {
    const finalValue = dragon.gemsInPocket[color] + changeInQty < 0 ? 0 : dragon.gemsInPocket[color] + changeInQty
    return update(dragon, {
      gemsInPocket: { $merge: { [color]: finalValue } }
    })
  },

  // Removes all gems of given color
  removeAllGems: function (dragon: Dragon, color: GemColors): Dragon {
    return update(dragon, {
      gemsInPocket: { $merge: { [color]: 0 } }
    })
  }
}
