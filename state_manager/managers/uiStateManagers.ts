import update from 'immutability-helper'
import { generateGadgetDescription } from '../../levels/fields'
import { GadgetOptionKeys } from '../../levels/level'
import { SelectedOptions } from '../../views/game/GadgetEdit'
import { GameState, SelectGadgetPayload, SelectOptionsPayload } from '../reducer'
import { manageDeleteField, managePlaceField } from './placementManagers'

export function manageSelectGadget (state: GameState, payload: SelectGadgetPayload): GameState {
  const availableOptions = generateGadgetDescription(payload.fieldType)
  const selectedOptions = Object
    .keys(availableOptions)
    .reduce((prev, optionKey: GadgetOptionKeys) => {
      prev[optionKey] = availableOptions[optionKey][0]
      return { ...prev }
    }, {} as SelectedOptions)

  if (state.uiState.fieldToAdd === payload.fieldType) {
    return update(state, {
      uiState: {
        $merge: manageClearUIState(state).uiState
      }
    })
  }

  if (Object.keys(availableOptions).length === 0) {
    return update(state, { uiState: { $merge: { fieldToAdd: payload.fieldType } } })
  }

  return update(state, {
    uiState: {
      $merge: {
        fieldToAdd: payload.fieldType,
        selectedOptions,
        gadgetEditState: {
          fieldId: null,
          showModal: true,
          availableOptions,
          canEdit: false
        }
      }
    }
  })
}

export function manageCommitEdit (state: GameState): GameState {
  if (state.uiState.gadgetEditState.canEdit) {
    // We go in here when user clicks 'Zatwierdź' after editing existing field on the board
    // We have to delete currently placed field and replace it with one that has updated options
    const uiStateCopy = { ...state.uiState }
    const newState = update(manageDeleteField(state, { index: uiStateCopy.gadgetEditState.fieldId }), { uiState: { $set: uiStateCopy } })
    return managePlaceField(newState, { index: state.uiState.gadgetEditState.fieldId })
  }
  return update(state, { uiState: { gadgetEditState: { $set: manageClearUIState(state).uiState.gadgetEditState } } })
}

export function manageSelectOptions (state: GameState, payload: SelectOptionsPayload): GameState {
  return update(state, {
    uiState: {
      selectedOptions: { $set: payload.selectedOptions }
    }
  })
}

export function manageClearUIState (state: GameState): GameState {
  return update(state, {
    uiState: {
      $set: {
        fieldToAdd: null,
        gadgetEditState: {
          fieldId: null,
          showModal: false,
          availableOptions: {},
          canEdit: false
        },
        selectedOptions: null
      }
    }
  })
}
