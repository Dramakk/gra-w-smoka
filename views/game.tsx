import React from 'react'
import { EngineState } from '../engine/engine'
import * as level from '../levels/level'
import { BottomTooltip } from './bottomTooltip'
import { SpeedControls } from './speedControls'
import * as editor from '../editor/editor'
import { BoardComponent } from './board'
import { GadgetsSelection } from './gadgetsSelection'
import { items } from '../helpers/counter'
import { stateReducer } from '../state_manager/reducer'
import { getDragonFromState, getLevelFromState } from '../state_manager/accessors'
import ReactDOM from 'react-dom'

// Determine which action user tries to perform
export type PlacementActions = 'DELETE' | 'PLACE';
type GameProps = { engine: EngineState, editorMode: boolean, editor?: editor.Editor};

export function Game (props: GameProps): React.ReactElement {
  const [state, dispatch] = React.useReducer(stateReducer,
    {
      engineState: props.engine,
      uiState: { fieldToAdd: null, option: null, canDelete: false },
      editor: props.editor,
      loop: null
    })

  const dragon = getDragonFromState(state)
  const currentLevelState = getLevelFromState(state)
  const board = [...Array(level.getLevelSize(currentLevelState)).keys()].map(index => { return level.getField(currentLevelState, index) })
  const canExport = !!(dragon.fieldId && dragon.direction)

  // TODO: Stworzyć oddzielny komponent z ładnym wyświetlaniem tego JSONa
  // Renders exported level in JSON format.
  function exportLevel (editorState: editor.Editor) : void {
    ReactDOM.render((<div>{editor.exportLevel(editorState)}</div>), document.querySelector('#app-container'))
  }

  return (
      <div className='container'>
        <p>{state.uiState.fieldToAdd}</p>
        <BoardComponent dispatch={dispatch} dragonPosition={dragon.fieldId} rowCount={level.getRowCount(currentLevelState)} fieldsPerRow={level.getFieldsPerRow(currentLevelState)} board={board}></BoardComponent>
        <BottomTooltip dispatch={dispatch} fieldsToPlace={[...items(currentLevelState.gadgets).entries()]} />
        <SpeedControls dispatch={dispatch} />
        {state.editor
          ? <div>
            <GadgetsSelection editor={state.editor} dispatch={dispatch} />
            <button disabled={!canExport} onClick={() => exportLevel(state.editor)}>EXPORT LEVEL</button>
          </div>
          : null
        }
    </div>
  )
}
