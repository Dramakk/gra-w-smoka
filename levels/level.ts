import * as fields from './fields'
import * as levelParser from './levelParser'

export class Level {
    fields: fields.Field[];
    levelParser: levelParser.LevelParser

    constructor (levelDescription: string) {
      console.log('TWORZE')
      this.levelParser = new levelParser.LevelParser(levelDescription)
      this.fields = this.levelParser.getParsedLevel()
    }

    getFields (): fields.Field[] {
      return this.fields
    }
}
