import update from 'immutability-helper'
import { Directions, GemColors } from '../levels/level'

export interface Dragon {
  fieldId: number;
  direction: Directions;
  gemsInPocket: Record<GemColors, number>
  canMove: boolean;
  directionHistory: {
    previous: Directions;
    current: Directions;
  }
}

export const DragonManipulation = {
  changeDragonDirection: function (dragon: Dragon, direction: Directions): Dragon {
    return update(dragon, {
      $merge: { direction }
    })
  },

  moveDragon: function (dragon: Dragon, fieldId: number): Dragon {
    return update(dragon, {
      $merge: { fieldId: fieldId }
    })
  },

  addPocketGems: function (dragon: Dragon, color: GemColors, changeInQty: number): Dragon {
    const finalValue = dragon.gemsInPocket[color] + changeInQty < 0 ? 0 : dragon.gemsInPocket[color] + changeInQty
    return update(dragon, {
      gemsInPocket: { $merge: { [color]: finalValue } }
    })
  },

  setPocketGems: function (dragon: Dragon, color: GemColors, changeInQty: number): Dragon {
    return update(dragon, {
      gemsInPocket: { $merge: { [color]: changeInQty } }
    })
  },

  // Removes all gems of given color
  removeAllGems: function (dragon: Dragon, color: GemColors): Dragon {
    return update(dragon, {
      gemsInPocket: { $merge: { [color]: 0 } }
    })
  },

  swapPocketGems: function (dragon: Dragon, firstColor: GemColors, secondColor: GemColors): Dragon {
    const firstColorNumber = dragon.gemsInPocket[firstColor]
    const newDragon = update(dragon, {
      gemsInPocket: { $merge: { [firstColor]: dragon.gemsInPocket[secondColor] } }
    })
    return update(newDragon, {
      gemsInPocket: { $merge: { [secondColor]: firstColorNumber } }
    })
  }
}
