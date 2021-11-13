import update from 'immutability-helper'
import { add, Counter, counterDelete, get } from '../helpers/counter'
import { Dragon } from '../engine/dragon'
import * as fields from './fields'

// Array matching type defined below. Used to generate form where editor of level, can choose how many and which fields player could use in game.
export const GadgetTypeArray: GadgetType[] = ['START', 'WALL', 'ARROWLEFT', 'ARROWRIGHT', 'ARROWUP', 'ARROWDOWN', 'SCALE']
// Gadget is the type for fields that users are allowed to put on board.
// TODO: Dodaj obsługę pola kończącego przy edytowaniu poziomu
export type GadgetType = 'START' | 'FINISH' | 'WALL' | 'ARROWLEFT' | 'ARROWRIGHT' | 'ARROWUP' | 'ARROWDOWN' | 'SCALE'
// Used to handle gadgets in views
export type GadgetInfo = [GadgetType, number]
export type Directions = 'U' | 'L' | 'D' | 'R'
export type GemColors = 'GREEN' | 'YELLOW' | 'BLACK' | 'RED' | 'BLUE'

// Type for dropdown options of fields to place by user.
export type GadgetOptionType = {direction : Directions} | {gemColor: GemColors}

// Utility type to extract keys from given union of objects
type Keys<T> = T extends {[key: string]: any} ? keyof T : never

export type GadgetOptionKeys = Keys<GadgetOptionType>
export type GadgetOptionDescription = Partial<Record<GadgetOptionKeys, string[]>>

// Used to represent Index => Field map
type FieldMap = {
  [key: number]: fields.Field
}

export interface Level {
  fields: fields.Field[]
  fieldsPerRow: number
  gadgets : Counter<GadgetType>
  playerPlacedGadgets : FieldMap
  baseDragon: Dragon
  treeGems: Record<GemColors, number>
}

export const LevelPredicates = {
  isPlacedByUser: function (level: Level, index : number): boolean {
    return (level.playerPlacedGadgets[index] !== undefined)
  },

  canPlaceField: function (level: Level, fieldType: GadgetType) : boolean {
    return get(level.gadgets, fieldType) > 0
  }
}

export const LevelGetters = {
  getField: function (level: Level, index: number) : fields.Field {
    if (index >= level.fields.length) {
      return null
    }

    const placedByPlayer = level.playerPlacedGadgets[index]

    if (placedByPlayer) {
      return placedByPlayer
    } else {
      return level.fields[index]
    }
  },

  getFieldsPerRow: function (level: Level) : number {
    return level.fieldsPerRow
  },

  getLevelSize: function (level: Level): number {
    return level.fields.length
  },

  getRowCount: function (level: Level) : number {
    return level.fields.length / level.fieldsPerRow
  }
}

export const LevelSpeedControls = {
  resetLevel: function (level: Level): Level {
    if (!level.playerPlacedGadgets || Object.keys(level.playerPlacedGadgets).length === 0) {
      return { ...level }
    }

    const indexToClear = Number(Object.keys(level.playerPlacedGadgets)[0])
    return LevelSpeedControls.resetLevel(LevelManipulation.clearSquare(level, indexToClear))
  },

  removeStart: function (level: Level) : Level {
    // We can set position and direction to null. When either is null, game won't start.
    // Using nulls instead of undefined because of engine implementation.
    return update(level, {
      gadgets: { $set: add(level.gadgets, 'START') },
      baseDragon: { $merge: { fieldId: null, direction: null } }
    })
  },

  setStart: function (level: Level, index: number, direction: Directions) : Level {
    return update(level, {
      baseDragon: { $merge: { fieldId: index, direction: direction } },
      gadgets: { $set: counterDelete(level.gadgets, 'START') }
    })
  },

  setFinish: function (level: Level, index: number): Level {
    const newLevel = update(level, {
      fields: {
        $set: level.fields.map((field, index) =>
          field.typeOfField === 'FINISH' ? fields.createField('EMPTY', 'E', index) : field)
      }
    })

    return update(newLevel, {
      fields: {
        $set: newLevel.fields.map((field, idx) =>
          index === idx ? fields.createField('FINISH', 'F', index, { opened: false }) : field)
      }
    })
  }
}

export const LevelCreation = {
  createLevel: function (
    fields : fields.Field[],
    fieldsPerRow : number,
    gadgets : Counter<GadgetType>,
    baseDragon: Dragon,
    treeGems: Record<GemColors, number>
  ): Level {
    // Flag determining if all ids from 0 to fields.length are assigned to fields.
    fields.sort((firstElem, secondElem) => { return firstElem.id - secondElem.id })
    // Iterate over array and chceck if every element is at it's place
    fields.map((field, index) => {
      if (field.id !== index) {
        throw Error('Wrong level format, ids missing')
      }
      return true
    })

    return {
      fields,
      fieldsPerRow,
      gadgets,
      playerPlacedGadgets: [],
      baseDragon,
      treeGems
    }
  },

  // Used as factory for fields to place on board.
  newFieldFromType: function (index: number, fieldType: GadgetType, options: GadgetOptionType) : fields.Field {
    switch (fieldType) {
      case 'ARROWUP':
        return fields.createField<fields.Arrow>('ARROWUP', 'AU', index, { direction: 'U' })
      case 'ARROWDOWN':
        return fields.createField<fields.Arrow>('ARROWDOWN', 'AD', index, { direction: 'D' })
      case 'ARROWLEFT':
        return fields.createField<fields.Arrow>('ARROWLEFT', 'AL', index, { direction: 'L' })
      case 'ARROWRIGHT':
        return fields.createField<fields.Arrow>('ARROWRIGHT', 'AR', index, { direction: 'R' })
      case 'SCALE':
        if ('gemColor' in options) return fields.createField<fields.Scale>('SCALE', `S ${options.gemColor}`, index, { gemColor: options.gemColor, onScale: 0 })
        else throw Error('Wrong options')
      case 'WALL':
        return fields.createField<fields.Wall>('WALL', 'W', index)
      case 'START':
        return fields.createField<fields.Start>('START', 'E', index)
      case 'FINISH':
        return fields.createField<fields.Finish>('FINISH', 'F', index, { opened: false })
      default:
        return fields.createField<fields.Empty>('EMPTY', 'E', index)
    }
  }
}

export const LevelManipulation = {
  fillSquare: function (level: Level, index : number, fieldType : GadgetType, options: GadgetOptionType) : Level {
    const newUserPlacedField : fields.Field = LevelCreation.newFieldFromType(index, fieldType, options)
    let playerPlacedGadgets: FieldMap = { ...level.playerPlacedGadgets }

    if (newUserPlacedField !== null) {
      playerPlacedGadgets = update(playerPlacedGadgets, { $merge: { [index]: newUserPlacedField } })
    }

    return update(level, {
      gadgets: { $set: counterDelete(level.gadgets, fieldType) },
      playerPlacedGadgets: { $set: playerPlacedGadgets }
    })
  },

  clearSquare: function (level: Level, index : number) : Level {
    const userPlacedField = LevelGetters.getField(level, index)

    // userPlacedField === 'EMPTY' cannot happen, but we have to tell this to TS.
    if (userPlacedField && userPlacedField.typeOfField !== 'EMPTY') {
      return update(level, {
        playerPlacedGadgets: { $unset: [index] },
        gadgets: { $set: add(level.gadgets, userPlacedField.typeOfField) }
      })
    }

    return { ...level }
  },

  changeLevelGemQty: function (level: Level, who: 'DRAGON' | 'TREE' | 'SCALE', color: GemColors, changeInQty: number): Level {
    switch (who) {
      case 'DRAGON':
        return update(level, {
          baseDragon: {
            gemsInPocket: {
              $merge: {
                [color]: level.baseDragon.gemsInPocket[color] + changeInQty < 0
                  ? 0
                  : (level.baseDragon.gemsInPocket[color] + changeInQty)
              }
            }
          }
        })
      case 'TREE':
        return update(level, {
          treeGems: { $merge: { [color]: level.treeGems[color] + changeInQty < 0 ? 0 : (level.treeGems[color] + changeInQty) } }
        })
      case 'SCALE':
        // TODO: Dorobić zmianę kryształów w balansie, kiedy będzie zrobiony
        return
      default:
        return { ...level }
    }
  }
}
