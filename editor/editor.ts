import { Engine } from '../engine/engine'
import { Multiset } from '../helpers/multiset'
import { Empty, Start } from '../levels/fields'
import { Directions, GadgetType, GadgetTypeArray } from '../levels/level'

// Type for dropdown options of fields to place by user.
export type GadgetOptionType = {direction : Directions}

export class Editor {
  engine : Engine
  // Array of fields which are going to be available to player, when level is imported.
  gadgetsToPlaceByPlayer: Multiset<GadgetType>

  constructor (engine: Engine) {
    this.engine = engine
    this.gadgetsToPlaceByPlayer = new Multiset<GadgetType>()
    GadgetTypeArray.filter((fieldType) => fieldType !== 'START').map((fieldType) => { return this.gadgetsToPlaceByPlayer.setZero(fieldType) })
  }

  // Invoked when user deletes object from the board.
  clearSquare (index: number) : void {
    const currentlyPlacedField = this.engine.level.fields[index]
    if (currentlyPlacedField instanceof Start) {
      // We can set postition and direction to null. If either is null, game won't start (see gameStart from engine.ts).
      this.engine.level.start = { position: null, direction: null }
      this.engine.level.gadgets.add('START')
      this.engine.gameReset()
    }
    this.engine.level.fields[index] = new Empty('E', index)
  }

  // Invoked when user places object on the board.
  fillSquare (index: number, gadgetType : GadgetType, choosenOptions: GadgetOptionType) : void {
    if (!this.engine.level.canPlaceField(gadgetType)) {
      return
    }
    if (gadgetType === 'START') {
      this.engine.level.start = { position: index, direction: choosenOptions.direction }
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
    const gadgetsToExport = new Multiset<GadgetType>()
    for (const gadget of this.gadgetsToPlaceByPlayer.toArray()) {
      const gadgetType = gadget[0]
      const howManyAvailable = gadget[1]

      if (gadgetType === 'START') {
        continue
      }

      if (howManyAvailable === 0) {
        continue
      }

      gadgetsToExport.add(gadgetType)
    }

    levelToExport.gadgets = gadgetsToExport.toArray()
    // We don't use this field in parsing
    delete levelToExport.playerPlacedGadgets
    return JSON.stringify(levelToExport)
  }
}
