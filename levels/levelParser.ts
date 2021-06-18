import * as fields from './fields'
export type FieldToPlaceType = 'ARROWLEFT' | 'ARROWRIGHT' | 'ARROWUP' | 'ARROWDOWN'
export type LevelInfo = {fields: fields.Field[], fieldsPerRow: number, fieldsToPlace: {fieldType: FieldToPlaceType, howManyAvailable: number}[]}
export class LevelParser {
    static parsedLevelInfo: LevelInfo

    static getParsedLevelInfo (levelToParse: string): LevelInfo {
      LevelParser.parsedLevelInfo = LevelParser.parseLevel(levelToParse)
      return LevelParser.parsedLevelInfo
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

      return { fields: parsedLevel, fieldsPerRow: levelDescriptionJSON.fieldsPerRow, fieldsToPlace: levelDescriptionJSON.fieldsToPlace }
    }
}
