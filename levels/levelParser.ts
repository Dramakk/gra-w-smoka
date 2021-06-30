import * as spicery from '../node_modules/spicery/build/index'
import { ParseFn, parse } from '../node_modules/spicery/build/parsers/index'
import * as fields from './fields'
import { FieldToPlaceObjectType, Level, Start } from './level'

export type FieldToPlaceType = 'START' | 'ARROWLEFT' | 'ARROWRIGHT' | 'ARROWUP' | 'ARROWDOWN'
export const FieldToPlaceTypeArray = ['START', 'ARROWLEFT', 'ARROWRIGHT', 'ARROWUP', 'ARROWDOWN']
export type Directions = 'U' | 'L' | 'D' | 'R'

export class LevelParser {
    static parsedLevel: Level

    static getParsedLevel (levelToParse: string = null): Level {
      LevelParser.parsedLevel = LevelParser.parseLevel(levelToParse)
      return LevelParser.parsedLevel
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

    // Used as factory for fields to place on board.
    static newFieldFromType (index: number, fieldType: FieldToPlaceType) : fields.Field {
      switch (fieldType) {
        case 'ARROWUP':
          return new fields.Arrow('U', 'AU', index)
        case 'ARROWDOWN':
          return new fields.Arrow('D', 'AD', index)
        case 'ARROWLEFT':
          return new fields.Arrow('L', 'AL', index)
        case 'ARROWRIGHT':
          return new fields.Arrow('R', 'AR', index)
        case 'START':
          return new fields.Start('E', index)
      }
    }

    // Creates empty board, surrounded by walls.
    static createLevelForEditor (howManyRows: number, fieldsPerRow: number) : Level {
      const levelFields : fields.Field[] = [...Array(howManyRows * fieldsPerRow).keys()].map((index: number) => {
        // Insert walls at boundaries of board
        if (index < fieldsPerRow || index % fieldsPerRow === 0 || (index + 1) % fieldsPerRow === 0 || ((howManyRows * fieldsPerRow - index) < fieldsPerRow)) {
          return new fields.Wall('W', index)
        }

        return new fields.Empty('E', index)
      })
      const start : Start = { position: null, direction: null }
      const fieldsToPlace : FieldToPlaceObjectType[] = FieldToPlaceTypeArray.map((fieldToPlaceType : FieldToPlaceType) => {
        if (fieldToPlaceType === 'START') {
          return { fieldType: fieldToPlaceType, howManyAvailable: 1 }
        }
        return { fieldType: fieldToPlaceType, howManyAvailable: Infinity }
      })

      return new Level(levelFields, fieldsPerRow, fieldsToPlace, start)
    }

    // Level parser using Spicery package from NPM.
    static parseLevel (levelToParse: string): Level {
      const directionsParser: ParseFn<Directions> = (x: Directions) => {
        return x
      }
      const startParser: ParseFn<Start> = (x : any) => ({
        position: spicery.fromMap(x, 'position', spicery.aNumber),
        direction: spicery.fromMap(x, 'direction', directionsParser)
      })

      const fieldToPlaceTypeParser: ParseFn<FieldToPlaceType> = (x : FieldToPlaceType) => {
        return x
      }
      const fieldToPlaceObject: ParseFn<FieldToPlaceObjectType> = (x: any) => ({
        fieldType: spicery.fromMap(x, 'fieldType', fieldToPlaceTypeParser),
        howManyAvailable: spicery.fromMap(x, 'howManyAvailable', spicery.aNumber)
      })

      const fieldsParser: ParseFn<fields.Field> = (x : any) => {
        switch (x.typeOfField) {
          case 'FINISH':
            return new fields.Finish(x.image, x.id)
          case 'WALL':
            return new fields.Wall(x.image, x.id)
          case 'EMPTY':
            return new fields.Empty(x.image, x.id)
          case 'ARROW':
            return new fields.Arrow(x.attributes.direction, x.image, x.id)
          case 'START':
            return new fields.Start(x.image, x.id)
        }
      }

      const levelParser : ParseFn<Level> = (x : any) => new Level(
        spicery.fromMap(x, 'fields', spicery.anArrayContaining(fieldsParser)),
        spicery.fromMap(x, 'fieldsPerRow', spicery.aNumber),
        spicery.fromMap(x, 'fieldsToPlace', spicery.anArrayContaining(fieldToPlaceObject)),
        spicery.fromMap(x, 'start', startParser)
      )

      return parse(levelParser)(levelToParse)
    }
}
