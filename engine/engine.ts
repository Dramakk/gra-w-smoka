import update from 'immutability-helper'
import { Field, Scale, Finish } from '../levels/fields'
import { GemColors, Level, LevelGetters, LevelManipulation, LevelSpeedControls } from '../levels/level'
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

export function step (currentState: EngineState): [EngineState, boolean] {
  const [nextState, hasMoved] = move(currentState)

  return hasMoved ? [changeState(nextState), hasMoved] : [nextState, hasMoved]
}

export function resetEngineState (currentState: EngineState): EngineState {
  const afterDragonReset = resetDragon(currentState)

  return update(afterDragonReset, {
    level: { $set: LevelSpeedControls.resetLevel(afterDragonReset.level) }
  })
}

// Private function definitions
// Moves dragon to new field (returns false if dragon cant move)
function move (currentState: EngineState): [EngineState, boolean] {
  const newFieldId: number = calculateNewField(currentState)

  if (LevelGetters.getField(currentState.level, newFieldId).typeOfField === 'WALL') {
    return [{ ...currentState }, false]
  } else {
    return [update(currentState, { dragon: { $set: DragonManipulation.moveDragon(currentState.dragon, newFieldId) } }), true]
  }
}

// Changes dragon state based on field dragon is on.
function changeState (currentState: EngineState): EngineState {
  const currentField: Field = LevelGetters.getField(currentState.level, currentState.dragon.fieldId)
  switch (currentField.typeOfField) {
    // Again we have to handle all arrows separetly because of typeOfField definition.
    case 'ARROWUP':
      return update(currentState, { dragon: { $set: DragonManipulation.changeDragonDirection(currentState.dragon, 'U') } })
    case 'ARROWDOWN':
      return update(currentState, { dragon: { $set: DragonManipulation.changeDragonDirection(currentState.dragon, 'D') } })
    case 'ARROWLEFT':
      return update(currentState, { dragon: { $set: DragonManipulation.changeDragonDirection(currentState.dragon, 'L') } })
    case 'ARROWRIGHT':
      return update(currentState, { dragon: { $set: DragonManipulation.changeDragonDirection(currentState.dragon, 'R') } })
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
      console.log(currentFinish)
      if (currentFinish.attributes.opened) {
        console.log('game finished')
      }
      return { ...currentState }
    }
    default:
      return { ...currentState }
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
