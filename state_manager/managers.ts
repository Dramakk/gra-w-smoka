import { resetEngineState, step } from '../engine/engine'
import { getDragonFromState } from './accessors'
import { GameState, SelectFieldPayload, StartPayload } from './reducer'

// This file contains functions used by actions in reducer. We decided to separate them, for cleaner implementation.
// Naming convention is manageActionName(state, payload)

export function manageStep (state: GameState): GameState {
  const [nextState, moved] = step(state.engineState)

  if (!moved) {
    return manageStop({ ...state, engineState: nextState })
  }

  return { ...state, engineState: nextState }
}

export function manageStart (state: GameState, payload: StartPayload): GameState {
  const dragon = getDragonFromState(state)
  if (!dragon.fieldId || !dragon.direction) {
    // Just don't start the game
    return { ...state }
  }

  return {
    ...state,
    loop: setInterval(() => {
      payload.dispatch({ type: 'STEP' })
    }, payload.timeout)
  }
}

export function manageStop (state: GameState): GameState {
  clearInterval(state.loop)

  return { ...state, loop: null }
}

export function manageReset (state: GameState): GameState {
  const newState = state.loop ? manageStop(state) : state

  return { ...newState, engineState: resetEngineState(newState.engineState) }
}

export function manageSelectField (state: GameState, payload: SelectFieldPayload): GameState {
  return { ...state, uiState: { ...state.uiState, fieldToAdd: payload.fieldType, option: payload.option } }
}

// // Updates state to match currently selected action (place or delete)
// export function changePlacementAction (actionMode: PlacementActions): void {
//   this.setState({ fieldToAdd: null, level: this.engine.level, placementAction: actionMode })
// }
