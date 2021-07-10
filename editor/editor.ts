import { Engine } from '../engine/engine'
import { Empty, Start } from '../levels/fields'
import { Directions, FieldToPlaceObjectType, FieldToPlaceType, FieldToPlaceTypeArray, Level } from '../levels/level'
import { LevelParser } from '../levels/levelParser'

// Type for dropdown options of fields to place by user.
export type FieldOptionType = {direction : Directions}

export class Editor {
  engine : Engine
  // Array of fields which are going to be available to player, when level is imported.
  fieldsToPlaceByUser: FieldToPlaceObjectType[]

  constructor (engine: Engine) {
    this.engine = engine
    this.fieldsToPlaceByUser = FieldToPlaceTypeArray.filter(
      (fieldType) => fieldType !== 'START').map(
      (fieldType) => { return { fieldType: fieldType, howManyAvailable: 0 } })
  }

  // Changes the quantity of given fieldToPlaceByUser. Using index, because this array, shouldn't lose any members.
  changeQtyOfFieldsToPlaceByUser (index: number, changeInQty: number): void {
    const howManyAvailableAfterChange = this.fieldsToPlaceByUser[index].howManyAvailable + changeInQty

    if (howManyAvailableAfterChange < 0) {
      return
    }
    this.fieldsToPlaceByUser[index].howManyAvailable += howManyAvailableAfterChange
  }

  // Invoked when user deletes object from the board.
  clearSquare (index: number) : void {
    const currentlyPlacedField = this.engine.level.fields[index]
    if (currentlyPlacedField instanceof Start) {
      // We can set postition and direction to null. If either is null, game won't start (see gameStart from engine.ts).
      this.engine.level.start = { position: null, direction: null }
      this.engine.level.changeQuantityPlacedFields('START', 1)
      this.engine.gameReset()
    }
    this.engine.level.fields[index] = new Empty('E', index)
  }

  // Invoked when user places object on the board.
  fillSquare (index: number, fieldToPlaceType : FieldToPlaceType, choosenOptions: FieldOptionType) : void {
    if (!this.engine.level.canPlaceField(fieldToPlaceType)) {
      return
    }
    if (fieldToPlaceType === 'START') {
      this.engine.level.start = { position: index, direction: choosenOptions.direction }
      this.engine.level.changeQuantityPlacedFields('START', -1)
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
