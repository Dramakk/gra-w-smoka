import { Editor } from '../editor/editor'
import { EngineState } from '../engine/engine'
import { GadgetOptionDescription, GadgetType, GemColors, RegisterData } from '../levels/level'
import React from 'react'
import { managePause, manageReset, manageStart, manageStep, manageStop } from './managers/movementManagers'
import { manageChangeGameFinished, manageClearUIState, manageCloseModal, manageCommitEdit, manageSelectGadget, manageSelectOptions } from './managers/uiStateManagers'
import { manageDeleteField, manageFieldClick } from './managers/placementManagers'
import { manageChangeGadgetQty, manageChangeGemQty, manageChangeRegister } from './managers/editorManagers'
import { SelectedOptions } from '../views/game/GadgetEdit'

export type PossibleActions =
  | 'START' // Start the game action
  | 'PAUSE' // Pause the game action
  | 'STOP' // Stop the game action like reset but don't clear placed gadgets
  | 'RESET' // Reset the game - reset game to state after import
  | 'STEP' // Invoked at each step
  | 'SELECT_GADGET' // Invoked when user selects field to place
  | 'SELECT_OPTIONS' // Invoked when user selects options for gadget
  | 'CLEAR_UI_STATE' // Used to clear edit modal state
  | 'CLOSE_MODAL' // Invoked when we user close gadget edit modal to prevent UI clipping
  | 'COMMIT_EDIT' // Invoked when user clicks 'Zatwierdź' button in edit modal
  | 'DELETE_FIELD' // Invoked when user clicks 'Usuń' button in edit modal
  | 'FIELD_CLICK' // Invoked when user clicks field on the map
  | 'CHANGE_GADGET_QTY' // Invoked in editor mode, when user changes quantity of gadgets available to be placed on the map
  | 'CHANGE_GEM_QTY' // Invoked in editor mode, when user changes quantity gems held by the dragon or needed by the tree
  | 'CHANGE_REGISTER' // Invoked in editor mode, when user changes register description
  | 'CHANGE_GAME_FINISHED' // Invoked when user closes "Koniec gry" modal or dragon steps on finish

// Here are types describing possible payloads of actions
// Naming convention ActionTypePayload
export interface StartPayload {timeout: number, dispatch: React.Dispatch<Action>}
export interface SelectGadgetPayload {fieldType: GadgetType }
export interface FieldClickPayload { index: number }
export interface ChangeGadgetQtyPayload { gadgetType: GadgetType, changeInQty: number}
export interface ChangeGemQtyPayload { who: 'DRAGON' | 'TREE', color: GemColors, changeInQty: number }
export interface ChangeRegisterPayload { registerNumber: number, register: RegisterData }
export interface SelectOptionsPayload { selectedOptions: SelectedOptions }
export interface CloseModalPayload { nextAction: Action, dispatch: React.Dispatch<Action> }

export type PossiblePayloads =
  | StartPayload
  | SelectGadgetPayload
  | FieldClickPayload
  | ChangeGadgetQtyPayload
  | ChangeGemQtyPayload
  | ChangeRegisterPayload
  | SelectOptionsPayload
  | CloseModalPayload

export type Action = { type: PossibleActions, payload?: PossiblePayloads }

export interface GadgetEditState {
  fieldId: number | null,
  showModal: boolean,
  canEdit: boolean
  availableOptions: GadgetOptionDescription
}

export interface UIState {
  fieldToAdd: GadgetType | null
  selectedOptions: SelectedOptions
  gadgetEditState: GadgetEditState
  gameFinished?: boolean
}

// Holds state of the whole game (engine + editor + UI)
export interface GameState { engineState: EngineState, uiState: UIState, editor?: Editor, loop?: ReturnType<typeof setInterval> }

/*
  This function serves as a single source of truth about state. Every action taken in game
  should be described here and have according manager in managers.ts file.

  We use this function with useReducer hook to pass only one dependency down the components tree.
*/
export function stateReducer (state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'STEP':
      return manageStep(state)
    case 'START':
      return manageStart(state, action.payload as StartPayload)
    case 'PAUSE':
      return managePause(state)
    case 'STOP':
      return manageStop(state)
    case 'RESET':
      return manageReset(state)
    case 'SELECT_GADGET':
      return manageSelectGadget(state, action.payload as SelectGadgetPayload)
    case 'SELECT_OPTIONS':
      return manageSelectOptions(state, action.payload as SelectOptionsPayload)
    case 'CLEAR_UI_STATE':
      return manageClearUIState(state)
    case 'COMMIT_EDIT':
      return manageCommitEdit(state)
    case 'CLOSE_MODAL':
      return manageCloseModal(state, action.payload as CloseModalPayload)
    case 'DELETE_FIELD':
      return manageDeleteField(state, action.payload as FieldClickPayload)
    case 'FIELD_CLICK':
      return manageFieldClick(state, action.payload as FieldClickPayload)
    case 'CHANGE_GADGET_QTY':
      return manageChangeGadgetQty(state, action.payload as ChangeGadgetQtyPayload)
    case 'CHANGE_GEM_QTY':
      return manageChangeGemQty(state, action.payload as ChangeGemQtyPayload)
    case 'CHANGE_REGISTER':
      return manageChangeRegister(state, action.payload as ChangeRegisterPayload)
    case 'CHANGE_GAME_FINISHED':
      return manageChangeGameFinished(state)
    default:
      throw new Error('Impossible action')
  }
}
