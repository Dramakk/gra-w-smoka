import React, { useEffect, useMemo, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { EngineState, resetDragon } from '../../engine/engine'
import { items } from '../../helpers/counter'
import { GameState, stateReducer } from '../../state_manager/reducer'
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
import Loading from '../helpers/Loading'
import { parseLevel } from '../../levels/levelParser'

interface LocationState {
  game: EngineState,
  editor?: Editor
}

// This variable provides dispatch method to the whole component tree
// To access this value we use useContext hook in child components
export const DispatchContext = React.createContext(null)

export default function Game (): React.ReactElement {
  // This is the place where all magic happens. We create state object and dispatch function which is passed down the tree.
  // Using dispatch we can update state in this place and trigger update of every component (if needed)
  const location = useLocation()
  const { id } = useParams <{ id: string }>()
  const history = useHistory()
  const [padding, setPadding] = useState(0)
  const [loading, setLoading] = useState(true)
  const [state, dispatch] = React.useReducer(stateReducer, null)
  const [nextLevel, setNextLevel] = useState('')
  const [finishModalButtons, setFinishModalButtons] = useState<ButtonDescription[]>([])
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
  const dragon = state && getDragonFromState(state)
  const currentLevelState = state && getLevelFromState(state)
  const canExport = !!(dragon?.fieldId && dragon?.direction) &&
    state?.engineState?.level?.fields
      .filter(field => field.typeOfField === 'FINISH').length !== 0
  const canEdit = state?.editor && !state?.loop
  const isStuck = !state?.engineState?.dragon?.canMove

  // Renders exported level in JSON format.
  function exportLevel (editorState: Editor) : void {
    history.push('/editor/export', { levelToExport: EditorCreation.exportLevel(editorState) })
  }

  async function handleResponse (initialState: GameState, response: any) {
    const parsedResponse = await response.json()
    try {
      const level = parseLevel(parsedResponse)
      const game = resetDragon({ level, dragon: null, shouldInteract: true })
      dispatch({
        type: 'SET',
        payload: {
          initialState: {
            ...initialState,
            engineState: game
          }
        }
      })
      setLoading(false)
    } catch (e) {
      console.log(e)
      history.push('/404')
    }
  }

  // Set all step sounds to loop
  Object.keys(steps).forEach(timeout => {
    steps[timeout].loop = true
  })

  if (!location.state && !id) {
    return <NavigationError />
  }

  useEffect(() => {
    const initialState: GameState = {
      engineState: null,
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
      editor: null,
      loop: null
    }

    if (id) {
      fetch(`/${id}.json`)
        .then(res => handleResponse(initialState, res))
        .catch(err => {
          console.log(err)
          history.push('/404')
        })
    } else if (location.state) {
      // This handles editor state
      const locationState = location.state as LocationState
      dispatch({
        type: 'SET',
        payload: {
          initialState: {
            ...initialState,
            editor: locationState.editor,
            engineState: locationState.game
          }
        }
      })
      setLoading(false)
    }

    const searchParams = new URLSearchParams(location.search)
    setNextLevel(searchParams.get('next'))
  }, [])

  useEffect(() => {
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
        buttonText: 'Następny poziom',
        buttonType: nextLevel ? 'success' : 'disabled',
        onClick: () => {
          const queryString = nextLevel ? `?open=${nextLevel}` : undefined
          history.push(`/levels${queryString}`)
        }
      },
      {
        buttonText: 'Zamknij',
        buttonType: 'primary',
        onClick: () => dispatch({ type: 'CHANGE_GAME_FINISHED' })
      }
    ]

    if (state?.editor) {
      return setFinishModalButtons([
        {
          buttonText: 'Zamknij',
          buttonType: 'primary',
          onClick: () => dispatch({ type: 'CHANGE_GAME_FINISHED' })
        }
      ])
    }

    setFinishModalButtons(finishModalButtons)
  }, [nextLevel, state?.editor])

  useEffect(() => {
    Object.keys(steps).forEach(key => {
      steps[key].pause()
    })

    if (state?.loop) steps[state.uiState.timeout].play()
  }, [state?.uiState?.timeout, state?.loop])

  useEffect(() => {
    if (state?.uiState?.gameFinished) gameFinishedSound.play()
  }, [state?.uiState?.gameFinished])

  useEffect(() => {
    if (currentLevelState) {
      const finish: Finish = LevelGetters.getField(currentLevelState, currentLevelState?.finishId) as Finish
      if (isStuck && !(dragon.fieldId === currentLevelState.finishId && finish.attributes.opened === 1)) starsSound.play()
    }
  }, [state?.engineState?.dragon?.canMove])

  useEffect(() => {
    return () => Object.keys(steps).forEach(step => steps[step].pause())
  }, [])

  if (loading) {
    return <Loading />
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
