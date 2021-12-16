import { resetDragon, resetEngineState, step } from '../../engine/engine'
import { LevelSpeedControls } from '../../levels/level'
import { getDragonFromState } from '../accessors'
import { GameState, StartPayload } from '../reducer'
import update from 'immutability-helper'

export function manageStep (state: GameState): GameState {
  const nextState = step(state.engineState)

  const directionHistory = update(state.engineState.dragon.directionHistory, {
    $set: {
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
      }, payload.timeout)
    }
  })
}

export function managePause (state: GameState): GameState {
  clearInterval(state.loop)

  return update(state, { loop: { $set: null } })
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
