import { Editor, GadgetOptionType } from '../editor/editor'
import { EngineState } from '../engine/engine'
import { GadgetType } from '../levels/level'
import { manageReset, manageSelectField, manageStart, manageStep, manageStop } from './managers'
import React from 'react'

export type PossibleTypes = 'INITIALIZE' | 'START' | 'STOP' | 'RESET' | 'STEP' | 'SELECT_FIELD' | 'DESELECT_FIELD' | 'DELETE_FIELD' | 'PLACE_FIELD'
export type PlacementActions = 'DELETE' | 'PLACE';

export interface StartPayload {timeout: number, dispatch: React.Dispatch<Action>}
export interface SelectFieldPayload {fieldType: GadgetType, option?: GadgetOptionType }
export type PossiblePayloads = StartPayload | SelectFieldPayload

export type Action = { type: PossibleTypes, payload?: PossiblePayloads }

export interface UIState { fieldToAdd: GadgetType, option: GadgetOptionType; }
export interface GameState { engineState: EngineState, uiState: UIState, editor?: Editor, loop?: ReturnType<typeof setInterval> }
export interface DispatchProps { dispatch: React.Dispatch<Action> }

/*
  What actions do we have?:
    - Initialize
    - Place field
    - Delete field
    - Choose filed to place
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
    case 'DELETE_FIELD':
      return state
    case 'PLACE_FIELD':
      return state
    default:
      throw new Error('Impossible action')
  }
}
