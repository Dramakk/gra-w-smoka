import React, { ReactElement } from 'react'
import { EngineState, resetDragon, step } from '../engine/engine'
import * as level from '../levels/level'
import { BottomTooltipComponent } from './bottomTooltip'
import { SpeedControlsComponent } from './speedControls'
import * as editor from '../editor/editor'
import { BoardComponent } from './board'
import { GadgetsSelectionComponent } from './gadgetsSelection'
import ReactDOM from 'react-dom'
import { items } from '../helpers/counter'

// Determine which action user tries to perform
export type PlacementActions = 'DELETE' | 'PLACE';
export type GameState = { fieldToAdd: level.GadgetType, level: level.Level, placementAction: PlacementActions, option: editor.GadgetOptionType; };
type GameProps = { engine: EngineState, editorMode: boolean, editor?: editor.Editor};

// This class serves as the wrapper for game (either just playing or editing).
export class GameComponent extends React.Component<GameProps, GameState> {
  engine: EngineState;
  editor?: editor.Editor;
  loop: ReturnType<typeof setInterval>;

  constructor (props: GameProps) {
    super(props)
    this.engine = props.engine
    if (props.editorMode) {
      this.editor = props.editor
    }

    // When in editor mode, we want to override standard behaviour of filling and clearing the square.
    if (props.editorMode) {
      this.placeElement = (index: number) => {
        this.editor.level = editor.fillSquare(this.editor.level, index, this.state.fieldToAdd, this.state.option)
        this.engine.level = this.editor.level
        this.setState({ fieldToAdd: null, level: this.editor.level, placementAction: null, option: null })
      }
      this.deleteElement = (index: number) => {
        this.editor.level = editor.clearSquare(this.editor.level, index)
        this.engine.level = this.editor.level
        this.setState({ fieldToAdd: null, level: this.editor.level, placementAction: null, option: null })
      }
    }

    this.state = { fieldToAdd: null, level: this.engine.level, placementAction: null, option: null }
  }

  // Updates state to match currently selected field to place on board.
  changeFieldToPlace (fieldType: level.GadgetType, option?: editor.GadgetOptionType): void {
    this.setState({ fieldToAdd: fieldType, level: this.engine.level, placementAction: 'PLACE', option: option })
  }

  // Updates state to match currently selected action (place or delete)
  changePlacementAction (actionMode: PlacementActions): void {
    this.setState({ fieldToAdd: null, level: this.engine.level, placementAction: actionMode })
  }

  /**
   * State holds information about current placement mode.
   * Clicking element on bottom tooltip, changes mode to 'PLACE' and allows placement of element on the board.
   * Clicking DELETE PLACED FIELD button, changes mode to 'DELETE' and allows deletion of element placed by user.
   */
  fieldPlacementController (index: number): void {
    if (this.state.placementAction === 'DELETE') {
      this.deleteElement(index)
    } else if (this.state.placementAction === 'PLACE') {
      this.placeElement(index)
    }

    this.engine = resetDragon(this.engine)
  }

  // Deletes element from board and updates view. Overriden in editor mode.
  deleteElement (index: number): void {
    if (level.isPlacedByUser(this.engine.level, index)) {
      this.engine.level = level.clearSquare(this.engine.level, index)
    }
    this.setState({ fieldToAdd: null, level: this.engine.level, placementAction: null })
  }

  // Places element on board and updates view. Overriden in editor mode.
  placeElement (index: number): void {
    if (this.state.fieldToAdd && level.getField(this.engine.level, index).typeOfField === 'EMPTY') {
      this.engine.level = level.fillSquare(this.engine.level, index, this.state.fieldToAdd)
    }
    this.setState({ fieldToAdd: null, level: this.engine.level, placementAction: null })
  }

  // TODO: Dodać różne wartości do wybrania jako międzyczas.
  // Starts simulation with 1s interval
  gameStart () : void {
    // Check if dragon position is set. Invalid dragon position is possible during level creation.
    if (!this.engine.dragon.fieldId || !this.engine.dragon.direction) {
      // Just don't start the game
      return
    }

    this.loop = setInterval(() => {
      const [nextState, moved] = step(this.engine)
      this.engine = nextState

      if (!moved) {
        this.gameStop()
      }

      this.setState({ level: this.engine.level })
    }, 1000)
  }

  // Stops simulation
  gameStop () : void {
    clearInterval(this.loop)
  }

  // Stops simulation and resets dragon position.
  // Level (and placed fields) ramains unchanged.
  gameReset () : void {
    this.gameStop()
    this.engine = resetDragon(this.engine)
    this.setState({ level: this.engine.level })
  }

  // TODO: Stworzyć oddzielny komponent z ładnym wyświetlaniem tego JSONa
  // Renders exported level in JSON format.
  exportLevel () : void {
    ReactDOM.render((<div>{editor.exportLevel(this.editor)}</div>), document.querySelector('#app-container'))
  }

  render (): ReactElement {
    const board = [...Array(level.getLevelSize(this.engine.level)).keys()].map(index => { return level.getField(this.engine.level, index) })
    const canExport = !!(this.engine.dragon.fieldId && this.engine.dragon.direction)

    return (
      <div className='container'>
        <p>{this.state.fieldToAdd}</p>
        <BoardComponent fieldPlacementController={this.fieldPlacementController.bind(this)} dragonPosition={this.engine.dragon.fieldId} rowCount={level.getRowCount(this.engine.level)} fieldsPerRow={level.getFieldsPerRow(this.engine.level)} board={board}></BoardComponent>
        <BottomTooltipComponent fieldsToPlace={[...items(this.engine.level.gadgets).entries()]} chooseGadgetToPlace={this.changeFieldToPlace.bind(this)} changePlacementMode={this.changePlacementAction.bind(this)} />
        <SpeedControlsComponent gameStart={this.gameStart.bind(this)} gameStop={this.gameStop.bind(this)} gameReset={this.gameReset.bind(this)} />
        {this.props.editorMode
          ? <div>
            <GadgetsSelectionComponent editor={this.editor} initialGadgets={this.editor.playerGadgets} />
            <button disabled={!canExport} onClick={() => this.exportLevel()}>EXPORT LEVEL</button>
          </div>
          : null
        }
      </div>
    )
  }
}
