import { Engine } from '../engine/engine'
import { Empty, Start } from '../levels/fields'
import { FieldToPlaceType, LevelParser } from '../levels/levelParser'

export class Editor {
  engine : Engine
  constructor (engine: Engine) {
    this.engine = engine
  }

  deleteUserField (index: number) : void {
    const currentlyPlacedField = this.engine.level.fields[index]
    if (currentlyPlacedField instanceof Start) {
      this.engine.level.start = { position: null, direction: null }
      this.engine.gameReset()
    }
    this.engine.level.fields[index] = new Empty('E', index)
  }

  placeUserField (index: number, fieldToPlaceType : FieldToPlaceType) : void {
    if (fieldToPlaceType === 'START') {
      // TODO: Add direction selection
      this.engine.level.start = { position: index, direction: 'D' }
      // Update dragon start position in engine
      this.engine.gameReset()
    }
    const newFieldToPlace = LevelParser.newFieldFromType(index, fieldToPlaceType)
    this.engine.level.fields[index] = newFieldToPlace
  }
}
