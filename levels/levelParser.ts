import * as fields from './fields'
export type FieldToPlaceType = 'ARROWLEFT' | 'ARROWRIGHT' | 'ARROWUP' | 'ARROWDOWN'
export type LevelInfo = {fields: fields.Field[],
  start: {id: number, direction: fields.Directions}
  fieldsPerRow: number,
  fieldsToPlace: {fieldType: FieldToPlaceType, howManyAvailable: number}[]}
export class LevelParser {
    static parsedLevelInfo: LevelInfo

    static getParsedLevelInfo (levelToParse: string): LevelInfo {
      LevelParser.parsedLevelInfo = LevelParser.parseLevel(levelToParse)
      return LevelParser.parsedLevelInfo
    }

    // Maps type of field to corresponding type of field to place.
    static mapFromFieldTypeToFieldToPlaceType (field : fields.Field) : FieldToPlaceType {
      switch (field.typeOfField) {
        case 'ARROW':
          switch (field.attributes.direction) {
            case 'U':
              return 'ARROWUP'
            case 'D':
              return 'ARROWDOWN'
            case 'L':
              return 'ARROWLEFT'
            case 'R':
              return 'ARROWLEFT'
          }
      }
    }

    static parseLevel (levelToParse: string): LevelInfo {
      const parsedLevel: fields.Field[] = []
      const levelDescriptionJSON: Record<string, any> = JSON.parse(levelToParse)
      if (levelDescriptionJSON.level === undefined) {
        throw new Error('Empty level to parse')
      }
      for (const fieldDescription in levelDescriptionJSON.level) {
        parsedLevel.push(fields.Field.parseJSONToField(levelDescriptionJSON.level[fieldDescription]))
      }

      return { fields: parsedLevel, fieldsPerRow: levelDescriptionJSON.fieldsPerRow, fieldsToPlace: levelDescriptionJSON.fieldsToPlace, start: levelDescriptionJSON.start }
    }
}
