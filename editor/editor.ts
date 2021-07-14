import { Engine } from '../engine/engine'
import { Counter } from '../helpers/counter'
import { Wall, Field, Empty, Start } from '../levels/fields'
import { Directions, GadgetType, GadgetTypeArray, Level, StartType } from '../levels/level'

// Type for dropdown options of fields to place by user.
export type GadgetOptionType = {direction : Directions}

export class Editor {
  engine : Engine
  // Array of fields which are going to be available to player, when level is imported.
  gadgetsPlayer: Counter<GadgetType>

  constructor (howManyRows: number, howManyPerRow: number) {
    this.engine = new Engine(this.createLevelForEditor(howManyPerRow, howManyPerRow))
    this.gadgetsPlayer = new Counter<GadgetType>()
    GadgetTypeArray.filter((fieldType) => fieldType !== 'START').map((fieldType) => { return this.gadgetsPlayer.setZero(fieldType) })
  }

  // Creates empty board, surrounded by walls.
  createLevelForEditor (howManyRows: number, fieldsPerRow: number): Level {
    const levelFields: Field[] = [...Array(howManyRows * fieldsPerRow).keys()].map((index: number) => {
      // Insert walls at boundaries of board
      if (index < fieldsPerRow || index % fieldsPerRow === 0 || (index + 1) % fieldsPerRow === 0 || ((howManyRows * fieldsPerRow - index) < fieldsPerRow)) {
        return new Wall('W', index)
      }

      return new Empty('E', index)
    })
    const start: StartType = { position: null, direction: null }
    const gadgets: Counter<GadgetType> = new Counter<GadgetType>()

    GadgetTypeArray.map((gadgetType: GadgetType) => {
      if (gadgetType === 'START') {
        return gadgets.add(gadgetType)
      }
      return gadgets.setInfinity(gadgetType)
    })

    return new Level(levelFields, fieldsPerRow, gadgets, start)
  }

  // Invoked when user deletes object from the board.
  clearSquare (index: number) : void {
    const currentlyPlacedField = this.engine.level.fields[index]
    if (currentlyPlacedField instanceof Start) {
      // We can set position and direction to null. When either is null, game won't start. (see gameStart from engine.ts).
      // Using nulls instead of undefined because of engine implementation.
      this.engine.level.start = { position: null, direction: null }
      this.engine.level.gadgets.add('START')
      this.engine.gameReset()
    }
    this.engine.level.fields[index] = new Empty('E', index)
  }

  // Invoked when user places object on the board.
  fillSquare (index: number, gadgetType : GadgetType, options: GadgetOptionType) : void {
    if (!this.engine.level.canPlaceField(gadgetType)) {
      return
    }
    if (gadgetType === 'START') {
      this.engine.level.start = { position: index, direction: options.direction }
      this.engine.level.gadgets.delete('START')
      // Update dragon start position in engine
      this.engine.gameReset()
    }
    const newGadget = this.engine.level.newFieldFromType(index, gadgetType)
    this.engine.level.fields[index] = newGadget
  }

  // Function used to export built level to JSON.
  exportLevel () : string {
    const levelToExport: any = this.engine.level
    const gadgetsToExport = new Counter<GadgetType>()
    for (const [gadgetType, howManyAvailable] of this.gadgetsPlayer.items()) {
      if (gadgetType === 'START') {
        continue
      }

      if (howManyAvailable === 0) {
        continue
      }

      [...Array(howManyAvailable).keys()].map(() => gadgetsToExport.add(gadgetType))
    }

    levelToExport.gadgets = [...gadgetsToExport.items().entries()]
    // We don't use this field in parsing
    delete levelToExport.playerPlacedGadgets
    return JSON.stringify(levelToExport)
  }
}
