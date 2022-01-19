import update from 'immutability-helper'
import { LevelManipulation } from '../../levels/level'
import { resetDragon } from '../../engine/engine'
import { add, counterDelete } from '../../helpers/counter'
import { ChangeGadgetQtyPayload, ChangeGemQtyPayload, ChangeRegisterPayload, GameState } from '../reducer'

export function manageChangeGadgetQty (state: GameState, payload: ChangeGadgetQtyPayload): GameState {
  const newEditor = payload.changeInQty > 0
    ? update(state.editor, { playerGadgets: { $set: add(state.editor.playerGadgets, payload.gadgetType) } })
    : update(state.editor, { playerGadgets: { $set: counterDelete(state.editor.playerGadgets, payload.gadgetType) } })

  return update(state, { editor: { $set: newEditor } })
}

export function manageChangeGemQty (state: GameState, payload: ChangeGemQtyPayload): GameState {
  const { who, color, changeInQty } = payload

  return update(state, {
    engineState: {
      $set: resetDragon(update(state.engineState, { level: { $set: LevelManipulation.changeLevelGemQty(state.engineState.level, who, color, changeInQty) } }))
    },
    editor: { $set: state.editor && update(state.editor, { level: { $set: LevelManipulation.changeLevelGemQty(state.editor.level, who, color, changeInQty) } }) }
  })
}

export function manageChangeRegister (state: GameState, payload: ChangeRegisterPayload): GameState {
  const { registerNumber, register } = payload
  const engineLevelAfterChange = LevelManipulation.changeLevelRegisters(state.engineState.level, registerNumber, register)
  const editorLevelAfterChange = LevelManipulation.changeLevelRegisters(state.editor.level, registerNumber, register)

  return update(state, {
    engineState: {
      $set: resetDragon(update(state.engineState, { level: { $set: update(engineLevelAfterChange, { baseTreeRegisters: { $set: engineLevelAfterChange.treeRegisters } }) } }))
    },
    editor: { $set: state.editor && update(state.editor, { level: { $set: update(editorLevelAfterChange, { baseTreeRegisters: { $set: editorLevelAfterChange.treeRegisters } }) } }) }
  })
}
