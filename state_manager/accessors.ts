import { Dragon } from '../engine/dragon'
import { Level } from '../levels/level'
import { GameState } from './reducer'

export function getLevelFromState (state: GameState): Level {
  return state.engineState.level
}

export function getDragonFromState (state: GameState): Dragon {
  return state.engineState.dragon
}
