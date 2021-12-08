import update from 'immutability-helper'
import { Field, Scale, Finish, ArithmeticOperation, Arrow, Swap, If, RegisterOperation, Entrance } from '../levels/fields'
import { GemColors, Level, LevelGetters, LevelManipulation, LevelSpeedControls, Signs } from '../levels/level'
import { Dragon, DragonManipulation } from './dragon'

export type EngineState = {
  level: Level,
  dragon: Dragon
}

export function resetDragon (currentState: EngineState): EngineState {
  return update(currentState, {
    dragon: { $set: currentState.level.baseDragon }
  })
}

export function step (currentState: EngineState): EngineState {
  const nextState = move(currentState)

  return (nextState.dragon.canMove) ? changeState(nextState) : nextState
}

export function resetEngineState (currentState: EngineState): EngineState {
  const afterDragonReset = resetDragon(currentState)

  return update(afterDragonReset, {
    level: { $set: LevelSpeedControls.resetLevel(afterDragonReset.level) }
  })
}

// Private function definitions
// Moves dragon to new field (returns false if dragon cant move)
function move (currentState: EngineState): EngineState {
  const newFieldId: number = calculateNewField(currentState)

  if (LevelGetters.getField(currentState.level, newFieldId).typeOfField === 'WALL' || !currentState.dragon.canMove) {
    return update(currentState, { dragon: { $merge: { canMove: false } } })
  } else {
    return update(currentState, { dragon: { $set: DragonManipulation.moveDragon(currentState.dragon, newFieldId) } })
  }
}

// Changes dragon state based on field dragon is on.
function changeState (currentState: EngineState): EngineState {
  const currentField: Field = LevelGetters.getField(currentState.level, currentState.dragon.fieldId)
  switch (currentField.typeOfField) {
    // Again we have to handle all arrows separetly because of typeOfField definition.
    case 'ARROWUP':
    case 'ARROWDOWN':
    case 'ARROWLEFT':
    case 'ARROWRIGHT': {
      const currentArrow = currentField as Arrow
      return update(currentState, { dragon: { $set: DragonManipulation.changeDragonDirection(currentState.dragon, currentArrow.attributes.direction) } })
    }
    case 'SCALE': {
      // TS can't deduct that attributes include gemColor
      const currentScale = currentField as Scale
      const gemColor : GemColors = currentScale.attributes.gemColor
      return update(currentState, {
        level: { $set: LevelManipulation.changeLevelGemQty(currentState.level, 'SCALE', gemColor, currentState.dragon.gemsInPocket[gemColor]) },
        dragon: { $set: DragonManipulation.removeAllGems(currentState.dragon, gemColor) }
      })
    }
    case 'FINISH': {
      const currentFinish = currentField as Finish
      if (currentFinish.attributes.opened) {
        console.log('game finished')
        return update(currentState, { dragon: { $merge: { canMove: false } } })
      }
      return { ...currentState }
    }
    case 'ADD': {
      const currentArithmeticOperation = currentField as ArithmeticOperation
      const numberOfGems = getNumberOfGems(currentState.dragon, currentArithmeticOperation.attributes.numberOfGems)
      return update(currentState, {
        dragon: { $set: DragonManipulation.addPocketGems(currentState.dragon, currentArithmeticOperation.attributes.targetGemColor, numberOfGems) }
      })
    }
    case 'SUBSTRACT': {
      const currentArithmeticOperation = currentField as ArithmeticOperation
      const numberOfGems = getNumberOfGems(currentState.dragon, currentArithmeticOperation.attributes.numberOfGems)
      return update(currentState, {
        dragon: { $set: DragonManipulation.addPocketGems(currentState.dragon, currentArithmeticOperation.attributes.targetGemColor, -numberOfGems) }
      })
    }
    case 'MULTIPLY': {
      const currentArithmeticOperation = currentField as ArithmeticOperation
      const numberOfGems = getNumberOfGems(currentState.dragon, currentArithmeticOperation.attributes.numberOfGems)
      return handleMultiplication(currentState, currentArithmeticOperation.attributes.targetGemColor, numberOfGems)
    }
    case 'DIVIDE': {
      const currentArithmeticOperation = currentField as ArithmeticOperation
      const numberOfGems = getNumberOfGems(currentState.dragon, currentArithmeticOperation.attributes.numberOfGems)
      return handleDivision(currentState, currentArithmeticOperation.attributes.targetGemColor, numberOfGems)
    }
    case 'SET': {
      const currentArithmeticOperation = currentField as ArithmeticOperation
      const numberOfGems = getNumberOfGems(currentState.dragon, currentArithmeticOperation.attributes.numberOfGems)
      return update(currentState, {
        dragon: { $set: DragonManipulation.setPocketGems(currentState.dragon, currentArithmeticOperation.attributes.targetGemColor, numberOfGems) }
      })
    }
    case 'SWAP': {
      const currentSwap = currentField as Swap
      if (currentSwap.attributes.firstGemColor !== currentSwap.attributes.secondGemColor) {
        return update(currentState, {
          dragon: { $set: DragonManipulation.swapPocketGems(currentState.dragon, currentSwap.attributes.firstGemColor, currentSwap.attributes.secondGemColor) }
        })
      } else return { ...currentState }
    }
    case 'IF': {
      const currentIf = currentField as If
      return update(currentState, {
        dragon: { $set: handleIf(currentState.dragon, currentIf.attributes.leftGemColor, currentIf.attributes.rightNumberOfGems, currentIf.attributes.sign) }
      })
    }
    case 'STORE': {
      const currentRegisterOperation = currentField as RegisterOperation
      return handleRegisterOperation(currentState, currentRegisterOperation.attributes.targetGemColor, currentRegisterOperation.attributes.registerNumber, true)
    }
    case 'TAKE': {
      const currentRegisterOperation = currentField as RegisterOperation
      return handleRegisterOperation(currentState, currentRegisterOperation.attributes.targetGemColor, currentRegisterOperation.attributes.registerNumber, false)
    }
    case 'ENTRANCE': {
      const currentEntrance = currentField as Entrance
      // Stop dragon if there is no exit set
      if (currentEntrance.attributes.exit === null) {
        return update(currentState, { dragon: { $merge: { canMove: false } } })
      } else {
        const newDragon = DragonManipulation.moveDragon(currentState.dragon, currentEntrance.attributes.exit)
        return update(currentState, { dragon: { $set: DragonManipulation.changeDragonDirection(newDragon, 'U') } })
      }
    }
    default:
      return { ...currentState }
  }
}

// Helper functions to handle arithmetic operations on gems
function getNumberOfGems (dragon: Dragon, numberOfGems: GemColors | number) : number {
  if (typeof (numberOfGems) === 'number') return numberOfGems
  else return dragon.gemsInPocket[numberOfGems]
}
function handleMultiplication (currentState: EngineState, targetGemColor: GemColors, numberOfGems: number) : EngineState {
  const newNumberOfGems = currentState.dragon.gemsInPocket[targetGemColor] * numberOfGems
  return update(currentState, {
    dragon: { $set: DragonManipulation.setPocketGems(currentState.dragon, targetGemColor, newNumberOfGems) }
  })
}
function handleDivision (currentState: EngineState, targetGemColor: GemColors, numberOfGems: number) : EngineState {
  // Stop if divisin by 0
  if (numberOfGems === 0) return update(currentState, { dragon: { $merge: { canMove: false } } })
  const newNumberOfGems = Math.floor(currentState.dragon.gemsInPocket[targetGemColor] / numberOfGems)
  return update(currentState, {
    dragon: { $set: DragonManipulation.setPocketGems(currentState.dragon, targetGemColor, newNumberOfGems) }
  })
}
function handleIf (currentDragon: Dragon, leftGemColor: GemColors, rightNumberOfGems: GemColors | number, sign: Signs) : Dragon {
  const numberOfLeftGems = currentDragon.gemsInPocket[leftGemColor]
  const numberOfRightGems = getNumberOfGems(currentDragon, rightNumberOfGems)
  if ((sign === '<' && numberOfLeftGems < numberOfRightGems) || (sign === '=' && numberOfLeftGems === numberOfRightGems) || (sign === '>' && numberOfLeftGems > numberOfRightGems)) {
    return DragonManipulation.changeDragonDirection(currentDragon, 'R')
  } else {
    return DragonManipulation.changeDragonDirection(currentDragon, 'L')
  }
}
function handleRegisterOperation (currentState: EngineState, targetGemColor: GemColors, registerNumber: number | GemColors, store: boolean) : EngineState {
  const registerIndex = getNumberOfGems(currentState.dragon, registerNumber)
  if (registerIndex >= 0 && registerIndex <= 19) {
    if (store) {
      const numberOfGems = currentState.dragon.gemsInPocket[targetGemColor]
      return update(currentState,
        { level: { $set: LevelManipulation.changeGemsRegister(currentState.level, registerIndex, numberOfGems) } })
    } else {
      const numberOfGems = currentState.level.treeRegisters[registerIndex].stored
      return update(currentState,
        { dragon: { $set: DragonManipulation.addPocketGems(currentState.dragon, targetGemColor, numberOfGems) } })
    }
  } else {
    return update(currentState, { dragon: { $merge: { canMove: false } } })
  }
}
// Calculates new fieldId based on dragon direction.
function calculateNewField (currentState: EngineState): number {
  let newFieldId: number = currentState.dragon.fieldId
  switch (currentState.dragon.direction) {
    case 'L':
      newFieldId -= 1
      break
    case 'R':
      newFieldId += 1
      break
    case 'U':
      newFieldId -= currentState.level.fieldsPerRow
      break
    case 'D':
      newFieldId += currentState.level.fieldsPerRow
      break
  }
  return newFieldId
}
