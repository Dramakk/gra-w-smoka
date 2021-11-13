import { Dragon } from '../engine/dragon'
import { Counter, add, createCounter } from '../helpers/counter'
import * as spicery from '../node_modules/spicery/build/index'
import { aNumber } from '../node_modules/spicery/build/index'
import { ParseFn, parse } from '../node_modules/spicery/build/parsers/index'
import * as fields from './fields'
import { Directions, GadgetType, GemColors, Level } from './level'

// Level parser using Spicery package from NPM.
export function parseLevel (levelToParse: string): Level {
  const directionsParser: ParseFn<Directions> = (x: Directions) => {
    return x
  }
  const baseDragonParser: ParseFn<Dragon> = (x: Dragon) => ({
    fieldId: spicery.fromMap(x, 'fieldId', spicery.aNumber),
    direction: spicery.fromMap(x, 'direction', directionsParser),
    gemsInPocket: spicery.fromMap(x, 'gemsInPocket', gemRecordParser),
    canMove: true
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
    if (!x.typeOfField || x.id == null || !x.image) {
      throw Error(`Parser error parsing ${x}`)
    }

    return fields.createField(x.typeOfField, x.image, x.id, x.attributes)
  }

  const gemRecordParser: ParseFn<Record<GemColors, number>> = (x: Record<GemColors, number>) => {
    if ('BLUE' in x && 'GREEN' in x && 'RED' in x && 'YELLOW' in x && 'BLACK' in x && Object.keys(x).length === 5) return x
    throw Error(`Parser error parsing ${x}`)
  }

  const levelParser: ParseFn<Level> = (x: any) => {
    const fields = spicery.fromMap(x, 'fields', spicery.anArrayContaining(fieldsParser))
    const fieldsPerRow = spicery.fromMap(x, 'fieldsPerRow', spicery.aNumber)
    const baseDragon = spicery.fromMap(x, 'baseDragon', baseDragonParser)
    const gadgets: Counter<GadgetType> = spicery.fromMap(x, 'gadgets', gadgetsParser)
    const treeGems: Record<GemColors, number> = spicery.fromMap(x, 'treeGems', gemRecordParser)
    const scalesGems: Record<GemColors, number> = {
      BLACK: 0,
      BLUE: 0,
      YELLOW: 0,
      RED: 0,
      GREEN: 0
    }

    return { fieldsPerRow, baseDragon, fields, gadgets, playerPlacedGadgets: [], scalesGems, treeGems }
  }

  return parse(levelParser)(levelToParse)
}
