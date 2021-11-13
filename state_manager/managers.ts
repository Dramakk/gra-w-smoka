import { resetDragon, step } from '../engine/engine'
import * as levelUtils from '../levels/level'
import * as editorUtils from '../editor/editor'
import { getDragonFromState, getLevelFromState } from './accessors'
import { ChangeGadgetQtyPayload, FieldClickPayload, GameState, SelectFieldPayload, StartPayload } from './reducer'
import { add, counterDelete } from '../helpers/counter'

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

  return { ...newState, engineState: resetDragon(newState.engineState) }
}

export function manageSelectField (state: GameState, payload: SelectFieldPayload): GameState {
  return { ...state, uiState: { ...state.uiState, fieldToAdd: payload.fieldType, option: payload.option, canDelete: false } }
}

export function manageDeleteMode (state: GameState): GameState {
  return { ...state, uiState: { ...state.uiState, canDelete: !state.uiState.canDelete } }
}

export function manageDeleteField (state: GameState, payload: FieldClickPayload): GameState {
  const level = getLevelFromState(state)

  if (levelUtils.isPlacedByUser(level, payload.index)) {
    // When in editor mode we have to perform clearSquare on editor object and reassing acquired value to level in engine object
    // Otherwise just clearSquare using level utilities.
    const newEditor = state.editor
      ? { ...state.editor, level: editorUtils.clearSquare(state.editor.level, payload.index) }
      : null

    return {
      ...state,
      engineState: resetDragon({
        ...state.engineState,
        level: state.editor ? { ...newEditor.level } : levelUtils.clearSquare(level, payload.index)
      }),
      uiState: { fieldToAdd: null, option: null, canDelete: false },
      editor: newEditor
    }
  }

  return { ...state, uiState: { fieldToAdd: null, canDelete: false, option: null } }
}

export function managePlaceField (state: GameState, payload: FieldClickPayload): GameState {
  const level = getLevelFromState(state)
  const uiState = state.uiState

  if (uiState.fieldToAdd && levelUtils.getField(level, payload.index).typeOfField === 'EMPTY') {
    // Same as above.
    const newEditor = state.editor
      ? { ...state.editor, level: editorUtils.fillSquare(state.editor.level, payload.index, uiState.fieldToAdd, uiState.option) }
      : null

    return {
      ...state,
      engineState: resetDragon({
        ...state.engineState,
        level: state.editor ? { ...newEditor.level } : levelUtils.fillSquare(level, payload.index, uiState.fieldToAdd)
      }),
      uiState: { fieldToAdd: null, option: null, canDelete: false },
      editor: newEditor
    }
  }

  return { ...state, uiState: { fieldToAdd: null, canDelete: false, option: null } }
}

export function manageChangeGadgetQty (state: GameState, payload: ChangeGadgetQtyPayload): GameState {
  const newEditor = payload.changeInQty > 0
    ? { ...state.editor, playerGadgets: add(state.editor.playerGadgets, payload.gadgetType) }
    : { ...state.editor, playerGadgets: counterDelete(state.editor.playerGadgets, payload.gadgetType) }

  return { ...state, editor: newEditor }
}
