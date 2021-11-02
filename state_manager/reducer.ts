import { Editor, GadgetOptionType } from '../editor/editor'
import { EngineState } from '../engine/engine'
import { GadgetType } from '../levels/level'
import { manageChangeGadgetQty, manageDeleteField, manageDeleteMode, managePlaceField, manageReset, manageSelectField, manageStart, manageStep, manageStop } from './managers'
import React from 'react'

export type PossibleTypes = 'INITIALIZE' | 'START' | 'STOP' | 'RESET' | 'STEP' | 'SELECT_FIELD' | 'DESELECT_FIELD' | 'FIELD_CLICK' | 'DELETE_MODE' | 'CHANGE_GADGET_QTY'

export interface StartPayload {timeout: number, dispatch: React.Dispatch<Action>}
export interface SelectFieldPayload {fieldType: GadgetType, option?: GadgetOptionType }
export interface FieldClickPayload { index: number }
export interface ChangeGadgetQtyPayload { gadgetType: GadgetType, changeInQty: number}

export type PossiblePayloads = StartPayload | SelectFieldPayload | FieldClickPayload | ChangeGadgetQtyPayload

export type Action = { type: PossibleTypes, payload?: PossiblePayloads }

export interface UIState { fieldToAdd: GadgetType, option: GadgetOptionType; canDelete: boolean }
export interface GameState { engineState: EngineState, uiState: UIState, editor?: Editor, loop?: ReturnType<typeof setInterval> }
export interface DispatchProps { dispatch: React.Dispatch<Action> }

/*
  This function serves as a single source of truth about state. Every action taken in game
  should be described here and have according manager in managers.ts file.

  We use this function with useReducer hook to pass only one dependency down the components tree.
*/
export function stateReducer (state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'INITIALIZE':
      return state
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
