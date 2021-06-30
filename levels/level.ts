import * as fields from './fields'
import * as levelParser from './levelParser'

export type Start = {position: number, direction: levelParser.Directions}
export type FieldToPlaceObjectType = {fieldType: levelParser.FieldToPlaceType, howManyAvailable: number}
export class Level {
    fields: fields.Field[]
    fieldsPerRow: number
    fieldsToPlace : FieldToPlaceObjectType[]
    userPlacedFields : fields.Field[]
    start: Start

    constructor (fields : fields.Field[], fieldsPerRow : number, fieldsToPlace : FieldToPlaceObjectType[], start : Start) {
      this.fields = fields
      this.fieldsPerRow = fieldsPerRow
      this.fieldsToPlace = fieldsToPlace
      this.userPlacedFields = []
      this.start = start
    }

    getFields (): fields.Field[] {
      return this.fields
    }

    getFieldsPerRow (): number {
      return this.fieldsPerRow
    }

    getFieldsToPlace (): FieldToPlaceObjectType[] {
      return this.fieldsToPlace
    }

    getCellsPerRow () : number {
      return this.fieldsPerRow
    }

    getLevelSize (): number {
      return this.fields.length
    }

    getRowCount () : number {
      return this.fields.length / this.fieldsPerRow
    }

    placeUserField (index : number, fieldType : levelParser.FieldToPlaceType) : void {
      const newUserPlacedField : fields.Field = levelParser.LevelParser.newFieldFromType(index, fieldType)
      const isIndexInPlacedFields : boolean = (this.userPlacedFields.filter((element : fields.Field) => { return element.id === index }).length !== 0)

      if (isIndexInPlacedFields) {
        this.userPlacedFields = this.userPlacedFields.filter((element : fields.Field) => { return element.id !== index })
      }
      if (newUserPlacedField !== null) {
        this.userPlacedFields.push(newUserPlacedField)
      }
      this.changeQuantityPlacedFields(fieldType, -1)
    }

    deleteUserField (index : number) : void {
      const userPlacedField = this.getField(index)
      this.changeQuantityPlacedFields(levelParser.LevelParser.mapFromFieldTypeToFieldToPlaceType(userPlacedField), 1)
      this.userPlacedFields = this.userPlacedFields.filter((element : fields.Field) => { return element.id !== index })
    }

    isPlacedByUser (index : number) : boolean {
      return (this.userPlacedFields.filter((element : fields.Field) => { return element.id === index }).length !== 0)
    }

    changeQuantityPlacedFields (fieldType : levelParser.FieldToPlaceType, changeInQuantity : number) : void {
      const currentQuantityArray : FieldToPlaceObjectType[] = this.fieldsToPlace.filter((element : FieldToPlaceObjectType) => { return element.fieldType === fieldType })

      if (currentQuantityArray.length !== 0) {
        const currentQuantity : FieldToPlaceObjectType = currentQuantityArray[0]
        const indexOfCurrentElement: number = this.fieldsToPlace.indexOf(currentQuantity)

        if (currentQuantity.howManyAvailable > 1) {
          this.fieldsToPlace[indexOfCurrentElement].howManyAvailable += changeInQuantity
        } else {
          if (changeInQuantity > 0) {
            this.fieldsToPlace[indexOfCurrentElement].howManyAvailable += changeInQuantity
          }
        }
      }
    }

    getField (index: number) : fields.Field {
      if (index >= this.fields.length) {
        return null
      }

      const placedByUser = this.userPlacedFields.filter((element : fields.Field) => { return element.id === index })
      const isPlacedByUser = placedByUser.length

      if (isPlacedByUser) {
        return placedByUser[0]
      } else {
        return this.fields.filter((element : fields.Field) => { return element.id === index })[0]
      }
    }

    getStartId () : number {
      return this.start.position
    }

    getStartDirection () : levelParser.Directions {
      return this.start.direction
    }
}
