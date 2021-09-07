import * as fields from '../levels/fields'
import React, { ReactElement } from 'react'
import { Engine } from '../engine/engine'
import { GadgetType, Level } from '../levels/level'
import { BottomTooltipComponent } from './bottomTooltip'
import { SpeedControlsComponent } from './speedControls'
import { Editor, GadgetOptionType } from '../editor/editor'
import { BoardComponent } from './board'
import { GadgetsSelectionComponent } from './gadgetsSelection'
import ReactDOM from 'react-dom'

// Determine which action user tries to perform
export type PlacementActions = 'DELETE' | 'PLACE';
export type GameState = { fieldToAdd: GadgetType, level: Level, placementAction: PlacementActions, option: GadgetOptionType; };
type GameProps = { engine: Engine, editorMode: boolean, editor?: Editor};

// This class serves as the wrapper for game (either just playing or editing).
export class GameComponent extends React.Component<GameProps, GameState> {
  engine: Engine;
  editor?: Editor;
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
        this.editor.fillSquare(index, this.state.fieldToAdd, this.state.option)
        this.engine.level = this.editor.level
        this.setState({ fieldToAdd: null, level: this.editor.level, placementAction: null, option: null })
      }
      this.deleteElement = (index: number) => {
        this.editor.clearSquare(index)
        this.engine.level = this.editor.level
        this.setState({ fieldToAdd: null, level: this.editor.level, placementAction: null, option: null })
      }
    }

    this.state = { fieldToAdd: null, level: this.engine.level, placementAction: null, option: null }
  }

  // Updates state to match currently selected field to place on board.
  changeFieldToPlace (fieldType: GadgetType, option?: GadgetOptionType): void {
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

    this.engine.resetDragon()
  }

  // Deletes element from board and updates view. Overriden in editor mode.
  deleteElement (index: number): void {
    if (this.engine.level.isPlacedByUser(index)) {
      this.engine.level.clearSquare(index)
    }
    this.setState({ fieldToAdd: null, level: this.engine.level, placementAction: null })
  }

  // Places element on board and updates view. Overriden in editor mode.
  placeElement (index: number): void {
    if (this.state.fieldToAdd && this.engine.level.getField(index) instanceof fields.Empty) {
      this.engine.level.fillSquare(index, this.state.fieldToAdd)
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
      const moved = this.engine.step()

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
    this.engine.resetDragon()
    this.setState({ level: this.engine.level })
  }

  // TODO: Stworzyć oddzielny komponent z ładnym wyświetlaniem tego JSONa
  // Renders exported level in JSON format.
  exportLevel () : void {
    ReactDOM.render((<div>{this.editor.exportLevel()}</div>), document.querySelector('#app-container'))
  }

  render (): ReactElement {
    const board = [...Array(this.engine.level.getLevelSize()).keys()].map(index => { return this.engine.level.getField(index) })
    const canExport = !!(this.engine.dragon.fieldId && this.engine.dragon.direction)

    return (
      <div className='container'>
        <p>{this.state.fieldToAdd}</p>
        <BoardComponent fieldPlacementController={this.fieldPlacementController.bind(this)} dragonPosition={this.engine.dragon.fieldId} rowCount={this.engine.level.getRowCount()} fieldsPerRow={this.engine.level.getFieldsPerRow()} board={board}></BoardComponent>
        <BottomTooltipComponent fieldsToPlace={[...this.engine.level.gadgets.items().entries()]} chooseGadgetToPlace={this.changeFieldToPlace.bind(this)} changePlacementMode={this.changePlacementAction.bind(this)} />
        <SpeedControlsComponent gameStart={this.gameStart.bind(this)} gameStop={this.gameStop.bind(this)} gameReset={this.gameReset.bind(this)} />
        {this.props.editorMode
          ? <div>
            <GadgetsSelectionComponent editor={this.editor} initialGadgets={this.editor.gadgetsPlayer} />
            <button disabled={!canExport} onClick={() => this.exportLevel()}>EXPORT LEVEL</button>
          </div>
          : null
        }
      </div>
    )
  }
}
