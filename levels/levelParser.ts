import { Counter } from '../helpers/counter'
import * as spicery from '../node_modules/spicery/build/index'
import { aNumber } from '../node_modules/spicery/build/index'
import { ParseFn, parse } from '../node_modules/spicery/build/parsers/index'
import * as fields from './fields'
import { Directions, GadgetType, Level, StartType } from './level'

// Level parser using Spicery package from NPM.
export function parseLevel (levelToParse: string): Level {
  const directionsParser: ParseFn<Directions> = (x: Directions) => {
    return x
  }
  const startParser: ParseFn<StartType> = (x: any) => ({
    position: spicery.fromMap(x, 'position', spicery.aNumber),
    direction: spicery.fromMap(x, 'direction', directionsParser)
  })

  const gadgetTypeParser: ParseFn<GadgetType> = (x: GadgetType) => {
    return x
  }

  const gadgetsParser: (counter: Counter<GadgetType>) => ParseFn<void> = (counter: Counter<GadgetType>) => {
    return (x: any) => {
      const gadgetToAdd = gadgetTypeParser(x[0])
      const howManyAvailable = aNumber(x[1])

      for (let i = 0; i < howManyAvailable; i++) {
        counter.add(gadgetToAdd)
      }
    }
  }

  const fieldsParser: ParseFn<fields.Field> = (x: any) => {
    // We have to consider all arrows separetly, because of possible typeOfField values.
    switch (x.typeOfField) {
      case 'FINISH':
        return new fields.Finish(x.image, x.id)
      case 'WALL':
        return new fields.Wall(x.image, x.id)
      case 'EMPTY':
        return new fields.Empty(x.image, x.id)
      case 'ARROWUP':
        return new fields.Arrow(x.attributes.direction, x.image, x.id)
      case 'ARROWDOWN':
        return new fields.Arrow(x.attributes.direction, x.image, x.id)
      case 'ARROWLEFT':
        return new fields.Arrow(x.attributes.direction, x.image, x.id)
      case 'ARROWRIGHT':
        return new fields.Arrow(x.attributes.direction, x.image, x.id)
      case 'START':
        return new fields.Start(x.image, x.id)
    }
  }

  const levelParser: ParseFn<Level> = (x: any) => {
    const fields = spicery.fromMap(x, 'fields', spicery.anArrayContaining(fieldsParser))
    const fieldsPerRow = spicery.fromMap(x, 'fieldsPerRow', spicery.aNumber)
    const start = spicery.fromMap(x, 'start', startParser)
    const gadgets = new Counter<GadgetType>()
    spicery.fromMap(x, 'gadgets', spicery.anArrayContaining(gadgetsParser(gadgets)))

    return new Level(fields, fieldsPerRow, gadgets, start)
  }

  return parse(levelParser)(levelToParse)
}
