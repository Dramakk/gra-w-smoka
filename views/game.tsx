import React from 'react'
import { EngineState } from '../engine/engine'
import { BottomTooltip } from './bottomTooltip'
import { SpeedControls } from './speedControls'
import { BoardComponent } from './board'
import { GadgetsSelection } from './gadgetsSelection'
import { items } from '../helpers/counter'
import { stateReducer } from '../state_manager/reducer'
import { getDragonFromState, getLevelFromState } from '../state_manager/accessors'
import ReactDOM from 'react-dom'
import { GemControls } from './gemControls'
import { LevelGetters } from '../levels/level'
import { Editor, EditorCreation } from '../editor/editor'
import { Tree } from './tree'

// This variable provides dispatch method to the whole component tree
// To access this value we use useContext hook in child components
export const DispatchContext = React.createContext(null)

type GameProps = { engine: EngineState, editorMode: boolean, editor?: Editor};

export function Game (props: GameProps): React.ReactElement {
  // This is the place where all magic happens. We create state object and dispatch function which is passed down the tree.
  // Using dispatch we can update state in this place and trigger update of every component (if needed)
  const [state, dispatch] = React.useReducer(stateReducer,
    {
      engineState: props.engine,
      uiState: { fieldToAdd: null, option: null, canDelete: false },
      editor: props.editor,
      loop: null
    })

  const dragon = getDragonFromState(state)
  const currentLevelState = getLevelFromState(state)
  const board = [...Array(LevelGetters.getLevelSize(currentLevelState)).keys()]
    .map(index => { return LevelGetters.getField(currentLevelState, index) })
  const canExport = !!(dragon.fieldId && dragon.direction) &&
  state.engineState.level.fields
    .filter(field => field.typeOfField === 'FINISH').length !== 0

  // TODO: Stworzyć oddzielny komponent z ładnym wyświetlaniem tego JSONa
  // Renders exported level in JSON format.
  function exportLevel (editorState: Editor) : void {
    ReactDOM.render((<div>{EditorCreation.exportLevel(editorState)}</div>),
      document.querySelector('#app-container'))
  }

  return (
      // Here we provide desired value of dispatch to every component down in the tree.
      <DispatchContext.Provider value={dispatch}>
        <div className='container'>
          <p>{state.uiState.fieldToAdd}</p>
          <p>WAGI {JSON.stringify(state.engineState.level.fields.filter(field => field.typeOfField === 'SCALE'))}</p>
          <p>RESET {JSON.stringify(state.engineState.level.baseDragon)}</p>
          <p>CURRENT {JSON.stringify(state.engineState.dragon.gemsInPocket)}</p>
          <p>ON SCALES {JSON.stringify(state.engineState.level.scalesGems)}</p>
          <p>TREE {JSON.stringify(state.engineState.level.treeGems)}</p>
          <BoardComponent
            dragonPosition={dragon.fieldId}
            rowCount={LevelGetters.getRowCount(currentLevelState)}
            fieldsPerRow={LevelGetters.getFieldsPerRow(currentLevelState)}
            board={board}></BoardComponent>
          <BottomTooltip fieldsToPlace={[...items(currentLevelState.gadgets).entries()]} />
          <SpeedControls />
          <Tree />
          {state.editor
            ? <div>
              <GadgetsSelection editor={state.editor} />
              <GemControls who='DRAGON' />
              <GemControls who='TREE' />
              <button disabled={!canExport} onClick={() => exportLevel(state.editor)}>EXPORT LEVEL</button>
            </div>
            : null
          }
      </div>
    </DispatchContext.Provider>
  )
}
