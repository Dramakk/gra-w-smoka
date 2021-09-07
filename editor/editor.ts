import { Counter } from '../helpers/counter'
import { Wall, Field, Empty, Start } from '../levels/fields'
import { Directions, GadgetType, GadgetTypeArray, Level, StartType } from '../levels/level'

// Type for dropdown options of fields to place by user.
export type GadgetOptionType = {direction : Directions}

export class Editor {
  level : Level
  // Array of fields which are going to be available to player, when level is imported.
  gadgetsPlayer: Counter<GadgetType>

  constructor (howManyRows: number, howManyPerRow: number) {
    this.level = this.createLevelForEditor(howManyRows, howManyPerRow)
    this.gadgetsPlayer = new Counter<GadgetType>()
    GadgetTypeArray.filter((fieldType) => fieldType !== 'START').map((fieldType) => { return this.gadgetsPlayer.setZero(fieldType) })
  }

  isBorder (index: number, fieldsPerRow: number, howManyRows: number): boolean {
    return (index < fieldsPerRow || index % fieldsPerRow === 0 || (index + 1) % fieldsPerRow === 0 || ((howManyRows * fieldsPerRow - index) < fieldsPerRow))
  }

  // Creates empty board, surrounded by walls.
  createLevelForEditor (howManyRows: number, fieldsPerRow: number): Level {
    const levelFields: Field[] = [...Array(howManyRows * fieldsPerRow).keys()].map((index: number) => {
      // Insert walls at boundaries of board
      if (this.isBorder(index, fieldsPerRow, howManyRows)) {
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
    // Prevent deleting of border walls
    if (this.isBorder(index, this.level.fieldsPerRow, this.level.getRowCount())) {
      return
    }

    const currentlyPlacedField = this.level.fields[index]
    if (currentlyPlacedField instanceof Start) {
      // We can set position and direction to null. When either is null, game won't start.
      // Using nulls instead of undefined because of engine implementation.
      this.level.start = { position: null, direction: null }
      this.level.gadgets.add('START')
    }
    this.level.fields[index] = new Empty('E', index)
  }

  // Invoked when user places object on the board.
  fillSquare (index: number, gadgetType : GadgetType, options: GadgetOptionType) : void {
    if (!this.level.canPlaceField(gadgetType)) {
      return
    }
    if (gadgetType === 'START') {
      this.level.start = { position: index, direction: options.direction }
      this.level.gadgets.delete('START')
    }
    const newGadget = this.level.newFieldFromType(index, gadgetType)
    this.level.fields[index] = newGadget
  }

  // Function used to export built level to JSON.
  exportLevel () : string {
    const levelToExport: any = this.level
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
