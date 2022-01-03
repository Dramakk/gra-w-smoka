import update from 'immutability-helper'
import { generateGadgetDescription } from '../../levels/fields'
import { GadgetOptionKeys, LevelPredicates } from '../../levels/level'
import { SelectedOptions } from '../../views/game/GadgetEdit'
import { GameState, SelectGadgetPayload, SelectOptionsPayload } from '../reducer'
import { manageDeleteField, managePlaceField } from './placementManagers'

export function manageSelectGadget (state: GameState, payload: SelectGadgetPayload): GameState {
  const availableOptions = generateGadgetDescription(payload.fieldType)
  // Select first option in every dropdown menu
  const selectedOptions = Object
    .keys(availableOptions)
    .reduce((prev, optionKey: GadgetOptionKeys) => {
      prev[optionKey] = availableOptions[optionKey][0]
      return { ...prev }
    }, {} as SelectedOptions)

  if (state.uiState.fieldToAdd === payload.fieldType || !LevelPredicates.canPlaceField(state.engineState.level, payload.fieldType)) {
    // User clicked on already selected gadget - deselect
    // Or placed all of given field
    return update(state, {
      uiState: {
        $merge: manageClearUIState(state).uiState
      }
    })
  }

  if (Object.keys(availableOptions).length === 0) {
    // There are no options for this gadget - don't open modal
    return update(state, { uiState: { $merge: { fieldToAdd: payload.fieldType } } })
  }

  // Gadget has options so open modal and populate options
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

  // Otherwise just close modal and clean up
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
          availableOptions: state.uiState.gadgetEditState.availableOptions,
          canEdit: false
        },
        selectedOptions: {}
      }
    }
  })
}
