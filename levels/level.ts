import * as fields from './fields'
import * as levelParser from './levelParser'

export type FieldToPlaceObjectType = {fieldType: levelParser.FieldToPlaceType, howManyAvailable: number}
export class Level {
    fields: fields.Field[]
    fieldsPerRow: number
    fieldsToPlace : FieldToPlaceObjectType[]
    userPlacedFields : fields.Field[]
    dragonPositionId : number

    constructor (levelDescription: string) {
      const parsedLevelInfo: levelParser.LevelInfo = levelParser.LevelParser.getParsedLevelInfo(levelDescription)
      this.fields = parsedLevelInfo.fields
      this.fieldsPerRow = parsedLevelInfo.fieldsPerRow
      this.fieldsToPlace = parsedLevelInfo.fieldsToPlace
      this.userPlacedFields = []
      this.dragonPositionId = this.fields.find((element : fields.Field) => element instanceof fields.Start).id
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
    }

    changeFieldToPlaceTypeQuantity (fieldType : levelParser.FieldToPlaceType) : void {
      const currentQuantityArray : FieldToPlaceObjectType[] = this.fieldsToPlace.filter((element : FieldToPlaceObjectType) => { return element.fieldType === fieldType })

      if (currentQuantityArray.length !== 0) {
        const currentQuantity : FieldToPlaceObjectType = currentQuantityArray[0]

        this.fieldsToPlace = this.fieldsToPlace.filter((element : FieldToPlaceObjectType) => { return element.fieldType !== fieldType })
        if (currentQuantity.howManyAvailable > 1) {
          currentQuantity.howManyAvailable -= 1
          this.fieldsToPlace.push(currentQuantity)
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
}
