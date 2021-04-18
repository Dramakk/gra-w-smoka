import * as fields from './fields'

export class LevelParser {
    parsedLevel: fields.Field[];
    levelToParse: string;
    tokens: string[] = ['.', 'S', 'A']
    directions: string[] = ['U', 'D', 'L', 'R']

    constructor (levelToParse: string) {
      this.parsedLevel = null
      this.levelToParse = levelToParse
    }

    getParsedLevel (): fields.Field[] {
      if (this.parsedLevel === null) {
        this.parsedLevel = this.parseLevel()
      }
      return this.parsedLevel
    }

    private getTokensFromLevelDescription (): string[] {
      const whitespaceRegex: RegExp = /\s+/g
      return this.levelToParse.replace(whitespaceRegex, '').split(';')
    }

    private parseToken (token: string, index: number): fields.Field {
      if (token === 'S') {
        return new fields.Empty(true, 'S', index)
      } else if (token === 'E') {
        return new fields.Empty(false, 'E', index)
      } else if (token === 'F') {
        return new fields.Finish(false, 'F', index)
      } else if (token === 'W') {
        return new fields.Wall(false, 'W', index)
      } else if (token[0] === 'A') {
        if (this.directions.indexOf(token[1]) !== -1) {
          return new fields.Arrow(false, token[1], token[1], index)
        }
        throw 'Unknown token, parse error when parsing arrow token on index: ' + index.toString()
      } else {
        throw 'Unknown token, parse error on index: ' + index.toString()
      }
    }

    private parseLevel (): fields.Field[] {
      const parsedLevel: fields.Field[] = []
      const levelDescriptionTokens: string[] = this.getTokensFromLevelDescription()
      levelDescriptionTokens.forEach((token, index) => {
        try {
          parsedLevel.push(this.parseToken(token, index))
        } catch (e) {
          console.log(e)
        }
      })

      return parsedLevel
    }
}
