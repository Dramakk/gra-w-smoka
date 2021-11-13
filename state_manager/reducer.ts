import { Editor, GadgetOptionType } from '../editor/editor'
import { EngineState } from '../engine/engine'
import { GadgetType } from '../levels/level'
import { manageChangeGadgetQty, manageDeleteField, manageDeleteMode, managePlaceField, manageReset, manageSelectField, manageStart, manageStep, manageStop } from './managers'
import React from 'react'

export type PossibleActions =
  | 'START' // Start the game action
  | 'STOP' // Stop the game action
  | 'RESET' // Reset gamem action
  | 'STEP' // Invoked at each step
  | 'SELECT_FIELD' // Invoked when user selects field to place
  | 'DESELECT_FIELD' // Invoked after user places the field
  | 'FIELD_CLICK' // Invoked when user clicks field on the map
  | 'DELETE_MODE' // Invoked when user switches to/from delete mode
  | 'CHANGE_GADGET_QTY' // Invoked in editor mode, when user changes quantity of gadgets available to be placed on the map

// Here are types describing possible payloads of actions
// Naming convention ActionTypePayload
export interface StartPayload {timeout: number, dispatch: React.Dispatch<Action>}
export interface SelectFieldPayload {fieldType: GadgetType, option?: GadgetOptionType }
export interface FieldClickPayload { index: number }
export interface ChangeGadgetQtyPayload { gadgetType: GadgetType, changeInQty: number}

export type PossiblePayloads = StartPayload | SelectFieldPayload | FieldClickPayload | ChangeGadgetQtyPayload

export type Action = { type: PossibleActions, payload?: PossiblePayloads }

export interface UIState { fieldToAdd: GadgetType, option: GadgetOptionType; canDelete: boolean }

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
    case 'STOP':
      return manageStop(state)
    case 'RESET':
      return manageReset(state)
    case 'SELECT_FIELD':
      return manageSelectField(state, action.payload as SelectFieldPayload)
    case 'DESELECT_FIELD':
      return state
    case 'DELETE_MODE':
      return manageDeleteMode(state)
    case 'FIELD_CLICK':
      if (state.uiState.canDelete) {
        return manageDeleteField(state, action.payload as FieldClickPayload)
      }

      return managePlaceField(state, action.payload as FieldClickPayload)
    case 'CHANGE_GADGET_QTY':
      return manageChangeGadgetQty(state, action.payload as ChangeGadgetQtyPayload)
    default:
      throw new Error('Impossible action')
  }
}
