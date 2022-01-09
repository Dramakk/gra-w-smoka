import { changeState, move, resetDragon, resetEngineState } from '../../engine/engine'
import { LevelGetters, LevelSpeedControls } from '../../levels/level'
import { getDragonFromState } from '../accessors'
import { GameState, StartPayload } from '../reducer'
import update from 'immutability-helper'
import { manageChangeGameFinished } from './uiStateManagers'

export function manageStep (state: GameState): GameState {
  const currentField = LevelGetters.getField(state.engineState.level, state.engineState.dragon.fieldId)
  let nextState = { ...state.engineState }

  // First we have to check if dragon should interact with PAUSE field
  // When we encounter PAUSE we don't update anything, just stop the loop and mark interaction as performed
  if (currentField.typeOfField === 'PAUSE' && nextState.shouldInteract) {
    return managePause(update(state, { engineState: { shouldInteract: { $set: false } } }))
  }

  // This if makes dragon to interfact with field, which means dragon will wait for loop timeout
  // after entering field with gadget.
  if (currentField.typeOfField === 'EMPTY' || currentField.typeOfField === 'START' || !nextState.shouldInteract) {
    nextState = move(nextState)
    nextState.shouldInteract = true
  } else if (nextState.shouldInteract) {
    nextState = changeState(nextState)
    nextState.shouldInteract = false
  }

  const directionHistory = update(state.engineState.dragon.directionHistory, {
    $merge: {
      previous: state.engineState.dragon.directionHistory.current,
      current: nextState.dragon.direction
    }
  })

  const nextStateWithUpdatedHistory = update(nextState, { dragon: { $merge: { directionHistory } } })
  if (!state.engineState.dragon.canMove) {
    return managePause(update(state, { engineState: { $set: nextStateWithUpdatedHistory } }))
  }

  return update(state, { engineState: { $set: nextStateWithUpdatedHistory } })
}

export function manageStart (state: GameState, payload: StartPayload): GameState {
  const dragon = getDragonFromState(state)
  if (!dragon.fieldId || !dragon.direction || state.loop) {
    // Just don't start the game
    return { ...state }
  }

  return update(state, {
    loop: {
      $set: setInterval(() => {
        payload.dispatch({ type: 'STEP' })
      }, state.uiState.timeout)
    }
  })
}

export function managePause (state: GameState): GameState {
  clearInterval(state.loop)
  const nextState = update(state, { loop: { $set: null } })
  return manageChangeGameFinished(nextState)
}

export function manageStop (state: GameState): GameState {
  const newState = state.loop ? managePause(state) : state
  const afterDragonReset = resetDragon(newState.engineState)
  const levelAfterReset = LevelSpeedControls.resetFinish(LevelSpeedControls.resetGems(afterDragonReset.level))
  const engineStateAfterReset = update(afterDragonReset, { level: { $set: levelAfterReset } })

  return update(newState, { engineState: { $set: engineStateAfterReset } })
}

export function manageReset (state: GameState): GameState {
  const newState = state.loop ? managePause(state) : state

  return update(newState, { engineState: { $set: resetEngineState(newState.engineState) } })
}

export function manageChangeFromHole (state: GameState): GameState {
  return update(state, { engineState: { dragon: { directionHistory: { $merge: { fromHole: !state.engineState.dragon.directionHistory.fromHole } } } } })
}
