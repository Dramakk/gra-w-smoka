import update from 'immutability-helper'
import { EditorManipulation } from '../../editor/editor'
import { resetDragon } from '../../engine/engine'
import { LevelGetters, LevelManipulation, LevelPredicates } from '../../levels/level'
import { getLevelFromState } from '../accessors'
import { FieldClickPayload, GameState } from '../reducer'

export function manageDeleteField (state: GameState, payload: FieldClickPayload): GameState {
  const level = getLevelFromState(state)

  if (LevelPredicates.isPlacedByUser(level, payload.index) || state.editor) {
    // When in editor mode we have to perform clearSquare on editor object and reassing acquired value to level in engine object
    // Otherwise just clearSquare using level utilities.
    const newEditor = state.editor
      ? update(state.editor, { level: { $set: EditorManipulation.clearSquare(state.editor.level, payload.index) } })
      : null

    return update(state, {
      engineState: {
        $set: resetDragon(update(state.engineState, {
          level: { $set: state.editor ? { ...newEditor.level } : LevelManipulation.clearSquare(level, payload.index) }
        }))
      },
      uiState: { $merge: { fieldToAdd: null, option: null, canDelete: false } },
      editor: { $set: newEditor }
    })
  }

  return update(state, {
    uiState: { $merge: { fieldToAdd: null, canDelete: false, option: null } }
  })
}

export function managePlaceField (state: GameState, payload: FieldClickPayload): GameState {
  const level = getLevelFromState(state)
  const uiState = state.uiState

  if (uiState.fieldToAdd && LevelGetters.getField(level, payload.index).typeOfField === 'EMPTY') {
    // Same as above.
    const newEditor = state.editor
      ? update(state.editor, { level: { $set: EditorManipulation.fillSquare(state.editor.level, payload.index, uiState.fieldToAdd, uiState.option) } })
      : null

    return update(state, {
      engineState: {
        $set: resetDragon(update(state.engineState, {
          level: { $set: state.editor ? { ...newEditor.level } : LevelManipulation.fillSquare(level, payload.index, uiState.fieldToAdd, uiState.option) }
        }))
      },
      uiState: { $merge: { fieldToAdd: null, option: null, canDelete: false } },
      editor: { $set: newEditor }
    })
  }

  return update(state, {
    uiState: { $merge: { fieldToAdd: null, canDelete: false, option: null } }
  })
}
