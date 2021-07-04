import { Engine } from '../engine/engine'
import { Empty, Start } from '../levels/fields'
import { FieldOptionType, FieldToPlaceObjectType, Level } from '../levels/level'
import { FieldToPlaceType, LevelParser } from '../levels/levelParser'

export class Editor {
  engine : Engine
  fieldsToPlaceByUser: FieldToPlaceObjectType[]

  constructor (engine: Engine) {
    this.engine = engine
  }

  deleteUserField (index: number) : void {
    const currentlyPlacedField = this.engine.level.fields[index]
    if (currentlyPlacedField instanceof Start) {
      this.engine.level.start = { position: null, direction: null }
      this.engine.level.changeQuantityPlacedFields('START', 1)
      this.engine.gameReset()
    }
    this.engine.level.fields[index] = new Empty('E', index)
  }

  placeUserField (index: number, fieldToPlaceType : FieldToPlaceType, choosenOptions: FieldOptionType) : void {
    if (!this.engine.level.canPlaceField(fieldToPlaceType)) {
      return
    }
    if (fieldToPlaceType === 'START') {
      this.engine.level.start = { position: index, direction: choosenOptions.direction }
      this.engine.level.changeQuantityPlacedFields('START', -1)
      console.log(this.engine.level.fieldsToPlace)
      // Update dragon start position in engine
      this.engine.gameReset()
    }
    const newFieldToPlace = LevelParser.newFieldFromType(index, fieldToPlaceType)
    this.engine.level.fields[index] = newFieldToPlace
  }

  // Function used to export built level to JSON.
  exportLevel () : string {
    const levelToExport: Level = this.engine.level
    // Default behaviour just to test things
    levelToExport.fieldsToPlace = levelToExport.fieldsToPlace.map((elem) => { elem.howManyAvailable = 10; return elem })
    levelToExport.fieldsToPlace = levelToExport.fieldsToPlace.filter((elem) => { return elem.fieldType !== 'START' })
    return JSON.stringify(levelToExport)
  }
}
