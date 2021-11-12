import { Counter, add, createCounter } from '../helpers/counter'
import * as spicery from '../node_modules/spicery/build/index'
import { aNumber } from '../node_modules/spicery/build/index'
import { ParseFn, parse } from '../node_modules/spicery/build/parsers/index'
import * as fields from './fields'
import { Directions, GadgetType, GemColors, Level, StartType } from './level'

// Level parser using Spicery package from NPM.
export function parseLevel (levelToParse: string): Level {
  const directionsParser: ParseFn<Directions> = (x: Directions) => {
    return x
  }
  const startParser: ParseFn<StartType> = (x: fields.Start) => ({
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

  const fieldsParser: ParseFn<fields.Field> = (x: fields.Field) => {
    if (!x.typeOfField || !x.id || !x.image) {
      throw Error(`Parser error parsing ${x}`)
    }

    return fields.createField(x.typeOfField, x.image, x.id, x.attributes)
  }

  const gemRecordParser: ParseFn<Record<GemColors, number>> = (x: Record<GemColors, number>) => {
    return x
  }

  const levelParser: ParseFn<Level> = (x: any) => {
    const fields = spicery.fromMap(x, 'fields', spicery.anArrayContaining(fieldsParser))
    const fieldsPerRow = spicery.fromMap(x, 'fieldsPerRow', spicery.aNumber)
    const start = spicery.fromMap(x, 'start', startParser)
    const gadgets: Counter<GadgetType> = spicery.fromMap(x, 'gadgets', gadgetsParser)
    const baseDragonGems: Record<GemColors, number> = spicery.fromMap(x, 'baseDragonGems', gemRecordParser)
    const treeGems: Record<GemColors, number> = spicery.fromMap(x, 'treeGems', gemRecordParser)

    return { fieldsPerRow, start, fields, gadgets, playerPlacedGadgets: [], baseDragonGems, treeGems }
  }

  return parse(levelParser)(levelToParse)
}
