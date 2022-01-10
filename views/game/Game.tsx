import React, { useEffect, useMemo, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { EngineState } from '../../engine/engine'
import { items } from '../../helpers/counter'
import { stateReducer } from '../../state_manager/reducer'
import { getDragonFromState, getLevelFromState } from '../../state_manager/accessors'
import { Editor, EditorCreation } from '../../editor/editor'
import BoardComponent from './Board'
import GemPanel from './GemPanel'
import Tree from './Tree'
import BottomTooltip from './BottomTooltip'
import SpeedControls from './SpeedControls'
import GadgetsSelection from './GadgetsSelection'
import GadgetEdit, { SelectedOptions } from './GadgetEdit'
import NavigationError from './NavigationError'
import Modal, { ButtonDescription } from '../helpers/Modal'
import { LevelGetters } from '../../levels/level'
import { Finish } from '../../levels/fields'
// This variable provides dispatch method to the whole component tree
// To access this value we use useContext hook in child components
export const DispatchContext = React.createContext(null)

export default function Game (): React.ReactElement {
  // This is the place where all magic happens. We create state object and dispatch function which is passed down the tree.
  // Using dispatch we can update state in this place and trigger update of every component (if needed)
  const location = useLocation()
  const history = useHistory()
  const locationState: { game: EngineState, editor: Editor} = location.state as { game: EngineState, editor: Editor}
  const [padding, setPadding] = useState(0)
  const steps: Record<string, HTMLAudioElement> = useMemo(() => {
    return {
      0: new Audio('/music/step4.mp3'),
      250: new Audio('/music/step3.mp3'),
      500: new Audio('/music/step2.mp3'),
      750: new Audio('/music/step1.mp3')
    }
  }, [])
  const gameFinishedSound = useMemo(() => new Audio('/music/cheers.mp3'), [])
  const starsSound = useMemo(() => new Audio('/music/aww.mp3'), [])
  Object.keys(steps).forEach(timeout => {
    steps[timeout].loop = true
  })
  const [playingAudio, setPlayingAudio] = useState(steps[500])

  if (!locationState) {
    return <NavigationError />
  }

  const [state, dispatch] = React.useReducer(stateReducer,
    {
      engineState: locationState.game,
      uiState: {
        timeout: 500,
        fieldToAdd: null,
        selectedOptions: null,
        gadgetEditState: {
          fieldId: null,
          showModal: false,
          canEdit: false,
          availableOptions: {}
        }
      },
      editor: locationState.editor,
      loop: null
    })

  const dragon = getDragonFromState(state)
  const currentLevelState = getLevelFromState(state)
  const canExport = !!(dragon.fieldId && dragon.direction) &&
    state.engineState.level.fields
      .filter(field => field.typeOfField === 'FINISH').length !== 0
  const canEdit = state.editor && !state.loop
  const isStuck = !state.engineState.dragon.canMove
  const finishModalButtons: ButtonDescription[] = [
    {
      buttonText: 'Wybór poziomu',
      buttonType: 'primary',
      onClick: () => {
        dispatch({ type: 'CHANGE_GAME_FINISHED' })
        history.push('/levels')
      }
    },
    {
      buttonText: 'Zamknij',
      buttonType: 'primary',
      onClick: () => dispatch({ type: 'CHANGE_GAME_FINISHED' })
    }
  ]

  useEffect(() => {
    playingAudio.pause()
    setPlayingAudio(steps[state.uiState.timeout])
  }, [state.uiState.timeout, state.loop])

  useEffect(() => {
    if (state.loop) playingAudio.play()
    else playingAudio.pause()
  }, [playingAudio, state.loop])

  useEffect(() => {
    if (state.uiState.gameFinished) gameFinishedSound.play()
  }, [state.uiState.gameFinished])

  useEffect(() => {
    const finish: Finish = LevelGetters.getField(currentLevelState, currentLevelState.finishId) as Finish
    if (isStuck && !(dragon.fieldId === currentLevelState.finishId && finish.attributes.opened === 1)) starsSound.play()
  }, [state.engineState.dragon.canMove])

  // Renders exported level in JSON format.
  function exportLevel (editorState: Editor) : void {
    history.push('/editor/export', { levelToExport: EditorCreation.exportLevel(editorState) })
  }

  return (
      // Here we provide desired value of dispatch to every component down in the tree.
      <DispatchContext.Provider value={dispatch}>
        <div className='game-container' style={{ paddingBottom: `${padding}px` }}>
          <div className="board-wrapper">
            <BoardComponent
              dragonPosition={dragon.fieldId}
              dragonDirectionHistory={dragon.directionHistory}
              editorMode={canEdit}
              isMoving={!!state.loop}
              isStuck={isStuck}
              level={state.engineState.level}
              timeout={state.uiState.timeout}
            />
          </div>
          <div className="right-panel-wrapper">
            <GemPanel
              treeGems={state.engineState.level.treeGems}
              gemsInPocket={state.engineState.dragon.gemsInPocket}
              scaleGems={state.engineState.level.scalesGems}
              canEdit={canEdit}
            />
            <SpeedControls setPadding={setPadding} timeout={state.uiState.timeout}/>
          </div>
          <Tree canEdit={canEdit} treeRegisters={state.engineState.level.treeRegisters}/>
          <BottomTooltip selectedField={state.uiState.fieldToAdd} fieldsToPlace={[...items(currentLevelState.gadgets).entries()]} />
          {state.editor
            ? <div className='gadgets-selection-container'>
              <GadgetsSelection editor={state.editor} />
              <button className={`${!canExport && 'button-disabled'}`} disabled={!canExport} onClick={() => exportLevel(state.editor)}>Udostępnij swój poziom</button>
            </div>
            : null
          }
          <GadgetEdit
            state={state.uiState.gadgetEditState}
            selectedGadget={state.uiState.fieldToAdd}
            selectedOptions={state.uiState.selectedOptions as SelectedOptions}
          />
        </div>
        <Modal buttons={finishModalButtons} title={'Gratulacje!'} show={state.uiState.gameFinished}>
          <div>Smok dotarł na miejsce!</div>
        </Modal>
      </DispatchContext.Provider>
  )
}
