import * as fields from './fields'
import * as levelParser from './levelParser'

export type FieldToPlaceObjectType = {fieldType: levelParser.FieldToPlaceType, howManyAvailable: number}
export class Level {
    fields: fields.Field[]
    fieldsPerRow: number
    fieldsToPlace : FieldToPlaceObjectType[]
    userPlacedFields : fields.Field[]
    start: {id: number, direction: fields.Directions}

    constructor (levelDescription: string) {
      const parsedLevelInfo: levelParser.LevelInfo = levelParser.LevelParser.getParsedLevelInfo(levelDescription)
      this.fields = parsedLevelInfo.fields
      this.fieldsPerRow = parsedLevelInfo.fieldsPerRow
      this.fieldsToPlace = parsedLevelInfo.fieldsToPlace
      this.userPlacedFields = []
      this.start = parsedLevelInfo.start
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
      let newUserPlacedField : fields.Field = null
      const isIndexInPlacedFields : boolean = (this.userPlacedFields.filter((element : fields.Field) => { return element.id === index }).length !== 0)

      switch (fieldType) {
        case 'ARROWUP':
          newUserPlacedField = new fields.Arrow('U', 'AU', index)
          break
        case 'ARROWDOWN':
          newUserPlacedField = new fields.Arrow('D', 'AD', index)
          break
        case 'ARROWLEFT':
          newUserPlacedField = new fields.Arrow('L', 'AL', index)
          break
        case 'ARROWRIGHT':
          newUserPlacedField = new fields.Arrow('R', 'AR', index)
          break
      }

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

        this.fieldsToPlace = this.fieldsToPlace.filter((element : FieldToPlaceObjectType) => { return element.fieldType !== fieldType })
        if (currentQuantity.howManyAvailable > 1) {
          currentQuantity.howManyAvailable += changeInQuantity
          this.fieldsToPlace.push(currentQuantity)
        }
      } else {
        if (changeInQuantity > 0) {
          this.fieldsToPlace.push({ fieldType: fieldType, howManyAvailable: changeInQuantity })
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
      return this.start.id
    }

    getStartDirection () : fields.Directions {
      return this.start.direction
    }
}
