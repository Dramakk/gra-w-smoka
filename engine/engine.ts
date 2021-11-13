import { Field } from '../levels/fields'
import { getField, Level } from '../levels/level'
import { Dragon, changeDragonDirection, moveDragon } from './dragon'

export type EngineState = {
  level: Level,
  dragon: Dragon
}

export function resetDragon (currentState: EngineState): EngineState {
  return {
    ...currentState,
    dragon: { fieldId: currentState.level.start.position, direction: currentState.level.start.direction, canMove: true }
  }
}

export function step (currentState: EngineState): [EngineState, boolean] {
  const [nextState, hasMoved] = move(currentState)

  return hasMoved ? [changeState(nextState), hasMoved] : [nextState, hasMoved]
}

// Private function definitions
// Moves dragon to new field (returns false if dragon cant move)
function move (currentState: EngineState): [EngineState, boolean] {
  const newFieldId: number = calculateNewField(currentState)

  if (getField(currentState.level, newFieldId).typeOfField === 'WALL') {
    return [{ ...currentState }, false]
  } else {
    return [{ ...currentState, dragon: moveDragon(currentState.dragon, newFieldId) }, true]
  }
}

// Changes dragon state based on field dragon is on.
function changeState (currentState: EngineState): EngineState {
  const currentField: Field = getField(currentState.level, currentState.dragon.fieldId)
  switch (currentField.typeOfField) {
    // Again we have to handle all arrows separetly because of typeOfField definition.
    case 'ARROWUP':
      return { ...currentState, dragon: changeDragonDirection(currentState.dragon, 'U') }
    case 'ARROWDOWN':
      return { ...currentState, dragon: changeDragonDirection(currentState.dragon, 'D') }
    case 'ARROWLEFT':
      return { ...currentState, dragon: changeDragonDirection(currentState.dragon, 'L') }
    case 'ARROWRIGHT':
      return { ...currentState, dragon: changeDragonDirection(currentState.dragon, 'R') }
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
