import update from 'immutability-helper'
import { EditorManipulation, EditorPredicates } from '../../editor/editor'
import { resetDragon, resetEngineState } from '../../engine/engine'
import { generateGadgetDescription } from '../../levels/fields'
import { GadgetOptionType, LevelGetters, LevelManipulation, LevelPredicates, LevelSpeedControls } from '../../levels/level'
import { SelectedOptions } from '../../views/game/GadgetEdit'
import { getLevelFromState } from '../accessors'
import { FieldClickPayload, GameState } from '../reducer'
import { manageClearUIState } from './uiStateManagers'

export function manageFieldClick (state: GameState, payload: FieldClickPayload): GameState {
  const fieldId = payload.index
  const level = getLevelFromState(state)
  const field = LevelGetters.getField(level, fieldId)
  // Exclude rocks on board edges and fields that are not placed by player from editing
  const canEdit =
    LevelPredicates.isPlacedByUser(level, fieldId) ||
      (state.editor &&
          !EditorPredicates.isBorder(fieldId, LevelGetters.getFieldsPerRow(level), LevelGetters.getRowCount(level)))

  // If field is not empty and we can edit the gadget then open edit modal and populate options.
  if (field.typeOfField !== 'EMPTY' && canEdit) {
    const attributes = field.typeOfField === 'START'
      ? { direction: state.engineState.dragon.direction }
      : field.attributes

    return update(state, {
      uiState: {
        $merge: {
          fieldToAdd: field.typeOfField,
          selectedOptions: attributes as SelectedOptions,
          gadgetEditState: {
            showModal: true,
            canEdit: true,
            fieldId,
            availableOptions: generateGadgetDescription(field.typeOfField)
          }
        }
      }
    })
  }

  // If there field is empty, try to place gadget on board
  return managePlaceField(state, payload)
}

export function manageDeleteField (state: GameState, payload: FieldClickPayload): GameState {
  const level = getLevelFromState(state)

  if (LevelPredicates.isPlacedByUser(level, payload.index) || state.editor) {
    // When in editor mode we have to perform clearSquare on editor object and reassing acquired value to level in engine object
    // Otherwise just clearSquare using level utilities.
    const newEditor = state.editor
      ? update(state.editor, { level: { $set: EditorManipulation.clearSquare(state.editor.level, payload.index) } })
      : null
    const levelAfterDelete = state.editor ? { ...newEditor.level } : LevelManipulation.clearSquare(level, payload.index)
    const levelAfterReset = LevelSpeedControls.resetFinish(LevelSpeedControls.resetGems(levelAfterDelete))
    return update(state, {
      engineState: {
        $set: resetDragon(update(state.engineState, {
          level: { $set: levelAfterReset }
        }))
      },
      uiState: { $merge: manageClearUIState(state).uiState },
      editor: { $set: newEditor }
    })
  }

  return update(state, {
    uiState: { $merge: manageClearUIState(state).uiState }
  })
}

export function managePlaceField (state: GameState, payload: FieldClickPayload): GameState {
  const level = getLevelFromState(state)
  const uiState = state.uiState

  if (uiState.fieldToAdd && LevelGetters.getField(level, payload.index).typeOfField === 'EMPTY') {
    // Same as above.
    const newEditor = state.editor
      ? update(state.editor, { level: { $set: EditorManipulation.fillSquare(state.editor.level, payload.index, uiState.fieldToAdd, uiState.selectedOptions as GadgetOptionType) } })
      : null

    const levelWithGadget = state.editor ? { ...newEditor.level } : LevelManipulation.fillSquare(level, payload.index, uiState.fieldToAdd, uiState.selectedOptions as GadgetOptionType)
    const levelAfterReset = LevelSpeedControls.resetFinish(LevelSpeedControls.resetGems(levelWithGadget))
    return update(state, {
      engineState: {
        $set: resetDragon(update(state.engineState, {
          level: { $set: levelAfterReset }
        }))
      },
      uiState:
        state.uiState.fieldToAdd === 'START' ||
        state.uiState.fieldToAdd === 'FINISH' ||
        !LevelPredicates.canPlaceField(levelWithGadget, state.uiState.fieldToAdd)
          ? { $merge: manageClearUIState(state).uiState }
          : { $merge: {} },
      editor: { $set: newEditor }
    })
  }

  return update(state, {
    uiState: { $merge: manageClearUIState(state).uiState }
  })
}
