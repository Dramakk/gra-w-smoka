import * as fields from './fields'
import * as levelParser from './levelParser'

export class Level {
    fields: fields.Field[];
    fieldsPerRow: number

    constructor (levelDescription: string) {
      const parsedLevelInfo: levelParser.LevelInfo = levelParser.LevelParser.getParsedLevelInfo(levelDescription)
      this.fields = parsedLevelInfo.fields
      this.fieldsPerRow = parsedLevelInfo.fieldsPerRow
    }

    getFields (): fields.Field[] {
      return this.fields
    }

    getFieldsPerRow (): number {
      return this.fieldsPerRow
    }
}
