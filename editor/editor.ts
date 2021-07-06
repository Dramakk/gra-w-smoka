import { Engine } from '../engine/engine'
import { Empty, Start } from '../levels/fields'
import { FieldOptionType, FieldToPlaceObjectType, Level } from '../levels/level'
import { FieldToPlaceType, FieldToPlaceTypeArray, LevelParser } from '../levels/levelParser'

export class Editor {
  engine : Engine
  fieldsToPlaceByUser: FieldToPlaceObjectType[]

  constructor (engine: Engine) {
    this.engine = engine
    this.fieldsToPlaceByUser = FieldToPlaceTypeArray.filter(
      (fieldType) => fieldType !== 'START').map(
      (fieldType) => { return { fieldType: fieldType, howManyAvailable: 0 } })
  }

  // Changes the quantity of given fieldToPlaceByUser. Using index, because this array, shouldn't lose any members.
  changeQtyOfFieldsToPlaceByUser (index: number, changeInQty: number): void {
    if (changeInQty < 0 && this.fieldsToPlaceByUser[index].howManyAvailable === 0) {
      return
    }
    this.fieldsToPlaceByUser[index].howManyAvailable += changeInQty
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
    levelToExport.fieldsToPlace = this.fieldsToPlaceByUser.filter((elem) => elem.howManyAvailable !== 0)
    levelToExport.fieldsToPlace = levelToExport.fieldsToPlace.filter((elem) => { return elem.fieldType !== 'START' })
    // We don't use this field in parsing
    delete levelToExport.userPlacedFields
    return JSON.stringify(levelToExport)
  }
}
