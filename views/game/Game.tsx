import React from 'react'
import { EngineState } from '../../engine/engine'
import { items } from '../../helpers/counter'
import { stateReducer } from '../../state_manager/reducer'
import { getDragonFromState, getLevelFromState } from '../../state_manager/accessors'
import ReactDOM from 'react-dom'
import { LevelGetters } from '../../levels/level'
import { Editor, EditorCreation } from '../../editor/editor'
import BoardComponent from './Board'
import GemPanel from './GemPanel'
import Tree from './Tree'
import BottomTooltip from './BottomTooltip'
import SpeedControls from './SpeedControls'
import GadgetsSelection from './GadgetsSelection'
// This variable provides dispatch method to the whole component tree
// To access this value we use useContext hook in child components
export const DispatchContext = React.createContext(null)

type GameProps = { engine: EngineState, editorMode: boolean, editor?: Editor};

export default function Game (props: GameProps): React.ReactElement {
  const dragonDirections = props.engine.dragon.direction ? [props.engine.dragon.direction] : []
  // This is the place where all magic happens. We create state object and dispatch function which is passed down the tree.
  // Using dispatch we can update state in this place and trigger update of every component (if needed)
  const [state, dispatch] = React.useReducer(stateReducer,
    {
      engineState: props.engine,
      uiState: { dragonDirections, fieldToAdd: null, option: null, canDelete: false },
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
  const canEdit = state.editor && !state.loop

  // TODO: Stworzyć oddzielny komponent z ładnym wyświetlaniem tego JSONa
  // Renders exported level in JSON format.
  function exportLevel (editorState: Editor) : void {
    ReactDOM.render((<div>{EditorCreation.exportLevel(editorState)}</div>),
      document.querySelector('#app-container'))
  }

  return (
      // Here we provide desired value of dispatch to every component down in the tree.
      <DispatchContext.Provider value={dispatch}>
        <div>{state.uiState.dragonDirections}</div>
        <div className='game-container'>
          <BoardComponent
            dragonPosition={dragon.fieldId}
            dragonDirections={state.uiState.dragonDirections}
            rowCount={LevelGetters.getRowCount(currentLevelState)}
            fieldsPerRow={LevelGetters.getFieldsPerRow(currentLevelState)}
            board={board}
          />
          <GemPanel
            treeGems={state.engineState.level.treeGems}
            gemsInPocket={state.engineState.dragon.gemsInPocket}
            scaleGems={state.engineState.level.scalesGems}
            canEdit={canEdit}
          />
          <Tree canEdit={canEdit} treeRegisters={state.engineState.level.treeRegisters}/>
          <BottomTooltip fieldsToPlace={[...items(currentLevelState.gadgets).entries()]} />
          <SpeedControls />
          {state.editor
            ? <div>
              <GadgetsSelection editor={state.editor} />
              <button disabled={!canExport} onClick={() => exportLevel(state.editor)}>EXPORT LEVEL</button>
            </div>
            : null
          }
      </div>
    </DispatchContext.Provider>
  )
}
