import { Counter, add, createCounter } from '../helpers/counter'
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

  const gadgetsParser: ParseFn<Counter<GadgetType>> = (x: [string, number][]) => {
    let counterToReturn = createCounter<GadgetType>()

    x.forEach(gadgetDescription => {
      const gadgetToAdd = gadgetTypeParser(gadgetDescription[0])
      const howManyAvailable = aNumber(gadgetDescription[1])

      for (let i = 0; i < howManyAvailable; i++) {
        counterToReturn = add(counterToReturn, gadgetToAdd)
      }
    })

    return counterToReturn
  }

  const fieldsParser: ParseFn<fields.Field> = (x: any) => {
    // We have to consider all arrows separetly, because of possible typeOfField values.
    switch (x.typeOfField) {
      case 'FINISH':
        return fields.createField<fields.Finish>('FINISH', x.image, x.id)
      case 'WALL':
        return fields.createField<fields.Wall>('WALL', x.image, x.id)
      case 'EMPTY':
        return fields.createField<fields.Empty>('EMPTY', x.image, x.id)
      case 'ARROWUP':
        return fields.createField<fields.Arrow>('ARROWUP', x.image, x.id, { direction: x.attributes.direction })
      case 'ARROWDOWN':
        return fields.createField<fields.Arrow>('ARROWDOWN', x.image, x.id, { direction: x.attributes.direction })
      case 'ARROWLEFT':
        return fields.createField<fields.Arrow>('ARROWLEFT', x.image, x.id, { direction: x.attributes.direction })
      case 'ARROWRIGHT':
        return fields.createField<fields.Arrow>('ARROWRIGHT', x.image, x.id, { direction: x.attributes.direction })
      case 'START':
        return fields.createField<fields.Start>('START', x.image, x.id)
    }
  }

  const levelParser: ParseFn<Level> = (x: any) => {
    const fields = spicery.fromMap(x, 'fields', spicery.anArrayContaining(fieldsParser))
    const fieldsPerRow = spicery.fromMap(x, 'fieldsPerRow', spicery.aNumber)
    const start = spicery.fromMap(x, 'start', startParser)
    const gadgets: Counter<GadgetType> = spicery.fromMap(x, 'gadgets', gadgetsParser)

    return { fieldsPerRow, start, fields, gadgets, playerPlacedGadgets: [] }
  }

  return parse(levelParser)(levelToParse)
}
