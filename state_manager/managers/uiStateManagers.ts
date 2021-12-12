import update from 'immutability-helper'
import { GameState, SelectFieldPayload } from '../reducer'

export function manageSelectField (state: GameState, payload: SelectFieldPayload): GameState {
  if (state.uiState.fieldToAdd === payload.fieldType && state.uiState.option === payload.option) {
    return update(state, { uiState: { $merge: { fieldToAdd: null, option: null, canDelete: false } } })
  }
  return update(state, { uiState: { $merge: { fieldToAdd: payload.fieldType, option: payload.option, canDelete: false } } })
}

export function manageDeleteMode (state: GameState): GameState {
  return update(state, { uiState: { $merge: { canDelete: !state.uiState.canDelete } } })
}
