import { resetEngineState, step } from '../../engine/engine'
import { getDragonFromState } from '../accessors'
import { GameState, StartPayload } from '../reducer'
import update from 'immutability-helper'

export function manageStep (state: GameState): GameState {
  const nextState = step(state.engineState)

  if (!state.engineState.dragon.canMove) {
    return manageStop(update(state, { engineState: { $set: nextState } }))
  }

  return update(state, { engineState: { $set: nextState }, uiState: { dragonDirections: { $push: [state.engineState.dragon.direction] } } })
}

export function manageStart (state: GameState, payload: StartPayload): GameState {
  const dragon = getDragonFromState(state)
  if (!dragon.fieldId || !dragon.direction) {
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

export function manageStop (state: GameState): GameState {
  clearInterval(state.loop)

  return update(state, { loop: { $set: null } })
}

export function manageReset (state: GameState): GameState {
  const newState = state.loop ? manageStop(state) : state

  return update(newState, { engineState: { $set: resetEngineState(newState.engineState) } })
}
