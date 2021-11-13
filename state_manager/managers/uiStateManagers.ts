import update from 'immutability-helper'
import { GameState, SelectFieldPayload } from '../reducer'

export function manageSelectField (state: GameState, payload: SelectFieldPayload): GameState {
  return update(state, { uiState: { $set: { fieldToAdd: payload.fieldType, option: payload.option, canDelete: false } } })
}

export function manageDeleteMode (state: GameState): GameState {
  return update(state, { uiState: { $merge: { canDelete: !state.uiState.canDelete } } })
}
