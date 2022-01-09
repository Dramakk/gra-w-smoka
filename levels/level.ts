import update from 'immutability-helper'
import { add, Counter, counterDelete, get } from '../helpers/counter'
import { Dragon } from '../engine/dragon'
import * as fields from './fields'

// Array matching type defined below. Used to generate form where editor of level, can choose how many and which fields player could use in game.
export const GadgetTypeArray = [
  'START',
  'FINISH',
  'PAUSE',
  'WALL',
  'ARROWLEFT',
  'ARROWRIGHT',
  'ARROWUP',
  'ARROWDOWN',
  'SCALE',
  'ADD',
  'SUBSTRACT',
  'MULTIPLY',
  'DIVIDE',
  'SET',
  'SWAP',
  'TAKE',
  'STORE',
  'IF',
  'ENTRANCE',
  'EXIT'
]

export const GemColorsArray = ['GREEN', 'BLUE', 'BLACK', 'RED', 'YELLOW']
// Gadget is the type for fields that users are allowed to put on board.
export type GadgetType = typeof GadgetTypeArray[number]
// Used to handle gadgets in views
export type GadgetInfo = [GadgetType, number]
export type Directions = 'U' | 'L' | 'D' | 'R'
export type GemColors = typeof GemColorsArray[number]

// Type for dropdown options of fields to place by user.
export type GadgetOptionType =
  | fields.FinishAttributes
  | fields.ArrowAttributes
  | fields.ScaleAttributes
  | fields.ArithmeticOperationAttributes
  | fields.SwapOperationAttributes
  | fields.RegisterOperationAttributes
  | fields.IfAttributes
  | fields.EntranceAttributes
  | fields.ExitAttributes

// Utility type to extract keys from given union of objects
type Keys<T> = T extends {[key: string]: any} ? keyof T : never

export type GadgetOptionKeys = Keys<GadgetOptionType>
export type GadgetOptionDescription = Partial<Record<GadgetOptionKeys, (string | number)[]>>

// Used to represent Index => Field map
type FieldMap = {
  [key: number]: fields.Field
}

export const SignsArray = ['<', '=', '>']
export type Signs = typeof SignsArray[number]

export const LabelsArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
export type Labels = typeof LabelsArray[number]

// Representation of 20 tree registers
export interface RegisterData {needed: number, stored: number}
export interface TreeRegisters {[key: number]: RegisterData}

export interface Level {
  fields: fields.Field[]
  fieldsPerRow: number
  gadgets : Counter<GadgetType>
  playerPlacedGadgets : FieldMap
  baseDragon: Dragon
  scalesGems: Record<GemColors, number>
  treeGems: Record<GemColors, number>
  treeRegisters: TreeRegisters
  finishId: number
  entrances: Record<Labels, number>
  exits: Record<Labels, number>
}

export const LevelPredicates = {
  checkLevelGemQty: function (level: Level) : boolean {
    return GemColorsArray.every(color => level.scalesGems[color] === level.treeGems[color])
  },

  isPlacedByUser: function (level: Level, index : number): boolean {
    return (level.playerPlacedGadgets[index] !== undefined)
  },

  canPlaceField: function (level: Level, fieldType: GadgetType) : boolean {
    return get(level.gadgets, fieldType) > 0
  },

  checkRegisters: function (level : Level) : boolean {
    return Object.values(level.treeRegisters).every(register => register.stored === register.needed)
  },

  canPlaceEntrance: function (level: Level, label: Labels) : boolean {
    console.log(level)
    return label in level.exits
  },

  canPlaceExit: function (level: Level, label: Labels) : boolean {
    console.log(level)
    return !(label in level.exits)
  },

  canRemoveExit: function (level: Level, label: Labels) : boolean {
    console.log(level)
    return !(label in level.entrances)
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
  resetFinish: function (level: Level): Level {
    if (level.finishId !== null) {
      return LevelManipulation.tryOpenExit(level)
    }
    return { ...level }
  },
  resetGems: function (level: Level): Level {
    return update(level, {
      scalesGems: { $set: { BLACK: 0, BLUE: 0, YELLOW: 0, RED: 0, GREEN: 0 } }
    })
  },
  resetPlacedGadgets (level: Level) : Level {
    if (!level.playerPlacedGadgets || Object.keys(level.playerPlacedGadgets).length === 0) {
      return { ...level }
    }

    const indexToClear = Number(Object.keys(level.playerPlacedGadgets)[0])
    return LevelSpeedControls.resetLevel(LevelManipulation.clearSquare(level, indexToClear))
  },
  // Resets finish, gems on scales and placed gadgets
  resetLevel: function (level: Level): Level {
    const afterFinishReset = LevelSpeedControls.resetFinish(level)
    const afterGemsReset = LevelSpeedControls.resetGems(afterFinishReset)

    return LevelSpeedControls.resetPlacedGadgets(afterGemsReset)
  },

  removeStart: function (level: Level) : Level {
    // We can set position and direction to null. When either is null, game won't start.
    // Using nulls instead of undefined because of engine implementation.
    return update(level, {
      gadgets: { $set: add(level.gadgets, 'START') },
      baseDragon: { $merge: { fieldId: null, direction: null } }
    })
  },

  removeFinish: function (level: Level) : Level {
    // We set finishId to null
    // Using nulls instead of undefined because of engine implementation.
    return update(level, {
      gadgets: { $set: add(level.gadgets, 'FINISH') },
      finishId: { $set: null }
    })
  },

  setStart: function (level: Level, index: number, direction: Directions) : Level {
    const newLevel = update(level, {
      fields: {
        $set: level.fields.map((field, index) =>
          field.typeOfField === 'START' ? fields.createField('EMPTY', index) : field)
      }
    })

    return update(newLevel, {
      baseDragon: { $merge: { fieldId: index, direction: direction, directionHistory: { previous: null, current: direction } } },
      gadgets: { $set: counterDelete(level.gadgets, 'START') },
      fields: {
        $set: newLevel.fields.map((field, mapIdx) =>
          index === mapIdx ? fields.createField('START', index) : field
        )
      }
    })
  },

  setFinish: function (level: Level, index: number): Level {
    const newLevel = update(level, {
      fields: {
        $set: level.fields.map((field, index) =>
          field.typeOfField === 'FINISH' ? fields.createField('EMPTY', index) : field)
      }
    })
    const isFinishOpened = LevelPredicates.checkLevelGemQty(level) ? 1 : 0
    return update(newLevel, {
      fields: {
        $set: newLevel.fields.map((field, idx) =>
          index === idx ? fields.createField('FINISH', index, { opened: isFinishOpened }) : field)
      },
      finishId: { $set: index }
    })
  },

  setEntrance: function (level: Level, index: number, label: Labels): Level {
    if (LevelPredicates.canPlaceEntrance(level, label)) {
      return update(level, {
        fields: {
          $set: level.fields.map((field, idx) =>
            index === idx ? fields.createField('ENTRANCE', index, { label: label, exit: level.exits[label] }) : field)
        },
        entrances: { $merge: { [label]: label in level.entrances ? level.entrances[label] + 1 : 1 } }
      })
    }
    return { ...level }
  },

  removeEntrance: function (level: Level, index: number, label: Labels): Level {
    if (level.entrances[label] > 1) {
      return update(level, {
        entrances: { $merge: { [label]: level.entrances[label] - 1 } }
      })
    } else {
      return update(level, {
        entrances: { $unset: [label] }
      })
    }
  },

  removeExit: function (level: Level, index: number, label: Labels): Level {
    if (LevelPredicates.canRemoveExit(level, label)) {
      return update(level, {
        fields: {
          $set: level.fields.map((item, itemIndex) =>
            itemIndex === index ? fields.createField<fields.Empty>('EMPTY', index) : item)
        },
        exits: { $unset: [label] }
      })
    }
    return { ...level }
  },

  setExit: function (level: Level, index: number, label: Labels): Level {
    if (LevelPredicates.canPlaceExit(level, label)) {
      return update(level, {
        fields: {
          $set: level.fields.map((field, idx) =>
            index === idx ? fields.createField('EXIT', index, { label: label }) : field)
        },
        exits: { $merge: { [label]: index } }
      })
    }
    return { ...level }
  }
}

export const LevelCreation = {
  createLevel: function (
    fields : fields.Field[],
    fieldsPerRow : number,
    gadgets : Counter<GadgetType>,
    baseDragon: Dragon,
    treeGems: Record<GemColors, number>,
    treeRegisters: TreeRegisters,
    finishId: number,
    exits: Record<Labels, number>,
    entrances: Record<Labels, number>
  ): Level {
    // Flag determining if all ids from 0 to fields.length are asSignsed to fields.
    fields.sort((firstElem, secondElem) => { return firstElem.id - secondElem.id })
    // Iterate over array and chceck if every element is at it's place
    fields.forEach((field, index) => {
      if (field.id !== index) {
        throw Error('Wrong level format, ids missing')
      }
    })

    if (fields.length % fieldsPerRow !== 0) {
      throw Error('Too many fields for given description')
    }

    if (finishId === null) {
      finishId = fields.findIndex(field => field.typeOfField === 'FINISH')
    }

    const scalesGems: Record<GemColors, number> = {
      BLACK: 0,
      BLUE: 0,
      YELLOW: 0,
      RED: 0,
      GREEN: 0
    }
    return {
      fields,
      fieldsPerRow,
      gadgets,
      playerPlacedGadgets: [],
      baseDragon,
      scalesGems,
      treeGems,
      treeRegisters,
      finishId,
      entrances,
      exits
    }
  },

  // Used as factory for fields to place on board.
  newFieldFromType: function (index: number, fieldType: GadgetType, options: GadgetOptionType) : fields.Field {
    switch (fieldType) {
      case 'ARROWUP':
        return fields.createField<fields.Arrow>('ARROWUP', index, { direction: 'U' })
      case 'ARROWDOWN':
        return fields.createField<fields.Arrow>('ARROWDOWN', index, { direction: 'D' })
      case 'ARROWLEFT':
        return fields.createField<fields.Arrow>('ARROWLEFT', index, { direction: 'L' })
      case 'ARROWRIGHT':
        return fields.createField<fields.Arrow>('ARROWRIGHT', index, { direction: 'R' })
      case 'SCALE':
        if ('gemColor' in options) return fields.createField<fields.Scale>('SCALE', index, { gemColor: options.gemColor })
        else throw Error('Wrong options')
      case 'WALL':
        return fields.createField<fields.Wall>('WALL', index)
      case 'START':
        return fields.createField<fields.Start>('START', index)
      case 'PAUSE':
        return fields.createField<fields.Pause>('PAUSE', index)
      case 'FINISH':
        if ('opened' in options) return fields.createField<fields.Finish>('FINISH', index, { opened: options.opened })
        else throw Error('Wrong options')
      case 'ADD':
        if ('numberOfGems' in options) return fields.createField<fields.ArithmeticOperation>('ADD', index, { ...options })
        else throw Error('Wrong options')
      case 'SUBSTRACT':
        if ('numberOfGems' in options) return fields.createField<fields.ArithmeticOperation>('SUBSTRACT', index, { ...options })
        else throw Error('Wrong options')
      case 'MULTIPLY':
        if ('numberOfGems' in options) return fields.createField<fields.ArithmeticOperation>('MULTIPLY', index, { ...options })
        else throw Error('Wrong options')
      case 'DIVIDE':
        if ('numberOfGems' in options) return fields.createField<fields.ArithmeticOperation>('DIVIDE', index, { ...options })
        else throw Error('Wrong options')
      case 'SET':
        if ('numberOfGems' in options) return fields.createField<fields.ArithmeticOperation>('SET', index, { ...options })
        else throw Error('Wrong options')
      case 'SWAP':
        if ('firstGemColor' in options) return fields.createField<fields.Swap>('SWAP', index, { ...options })
        else throw Error('Wrong options')
      case 'STORE':
        if ('registerNumber' in options) return fields.createField<fields.RegisterOperation>('STORE', index, { ...options })
        else throw Error('Wrong options for STORE')
      case 'TAKE':
        if ('registerNumber' in options) return fields.createField<fields.RegisterOperation>('TAKE', index, { ...options })
        else throw Error('Wrong options for TAKE')
      case 'IF':
        if ('sign' in options) return fields.createField<fields.If>('IF', index, { ...options })
        else throw Error('Wrong options for IF')
      case 'ENTRANCE':
        if ('label' in options) return fields.createField<fields.Entrance>('ENTRANCE', index, { ...options })
        else throw Error('Wrong options for ENTRANCE')
      case 'EXIT':
        if ('label' in options) return fields.createField<fields.Exit>('EXIT', index, { ...options })
        else throw Error('Wrong options for EXIT')
      default:
        return fields.createField<fields.Empty>('EMPTY', index)
    }
  }
}

export const LevelManipulation = {
  fillSquare: function (level: Level, index : number, fieldType : GadgetType, options: GadgetOptionType) : Level {
    const newUserPlacedField : fields.Field = LevelCreation.newFieldFromType(index, fieldType, options)
    let playerPlacedGadgets: FieldMap = { ...level.playerPlacedGadgets }
    let exits = { ...level.exits }
    let entrances = { ...level.entrances }

    if (newUserPlacedField === null) return { ...level }
    if (newUserPlacedField.typeOfField === 'ENTRANCE' && 'label' in newUserPlacedField.attributes) {
      const label = newUserPlacedField.attributes.label
      if (LevelPredicates.canPlaceEntrance(level, label)) {
        entrances = update(entrances, { $merge: { [label]: label in level.entrances ? level.entrances[label] + 1 : 1 } })
      } else return { ...level }
    }
    if (newUserPlacedField.typeOfField === 'EXIT' && 'label' in newUserPlacedField.attributes) {
      const label = newUserPlacedField.attributes.label
      if (LevelPredicates.canPlaceExit(level, label)) {
        exits = update(exits, { $merge: { [label]: index } })
      } else return { ...level }
    }

    playerPlacedGadgets = update(playerPlacedGadgets, { $merge: { [index]: newUserPlacedField } })

    return update(level, {
      gadgets: { $set: counterDelete(level.gadgets, fieldType) },
      playerPlacedGadgets: { $set: playerPlacedGadgets },
      entrances: { $set: entrances },
      exits: { $set: exits }
    })
  },

  clearSquare: function (level: Level, index : number) : Level {
    const userPlacedField = LevelGetters.getField(level, index)
    let newLevel = { ...level }

    // userPlacedField === 'EMPTY' cannot happen, but we have to tell this to TS.
    if (!userPlacedField || userPlacedField.typeOfField === 'EMPTY') return { ...level }

    if (userPlacedField.typeOfField === 'ENTRANCE' && 'label' in userPlacedField.attributes) {
      newLevel = LevelSpeedControls.removeEntrance(level, index, userPlacedField.attributes.label)
    }
    if (userPlacedField.typeOfField === 'EXIT' && 'label' in userPlacedField.attributes) {
      if (LevelPredicates.canRemoveExit(level, userPlacedField.attributes.label)) {
        newLevel = update(level, { exits: { $unset: [userPlacedField.attributes.label] } })
      } else return { ...level }
    }

    return update(newLevel, {
      playerPlacedGadgets: { $unset: [index] },
      gadgets: { $set: add(level.gadgets, userPlacedField.typeOfField) }
    })
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
        return LevelManipulation.tryOpenExit(update(level, {
          treeGems: { $merge: { [color]: level.treeGems[color] + changeInQty < 0 ? 0 : (level.treeGems[color] + changeInQty) } }
        }))
      case 'SCALE':
        return LevelManipulation.tryOpenExit(update(level, {
          scalesGems: { $merge: { [color]: level.scalesGems[color] + changeInQty < 0 ? 0 : (level.scalesGems[color] + changeInQty) } }
        }))
      default:
        return { ...level }
    }
  },

  tryOpenExit: function (level : Level) : Level {
    // Guard because used in editor too
    if (level.finishId != null) {
      const isFinishOpened = LevelPredicates.checkLevelGemQty(level) && LevelPredicates.checkRegisters(level) ? 1 : 0
      return update(level, {
        fields: { [level.finishId]: { attributes: { $merge: { opened: isFinishOpened } } } }
      })
    }
    return { ...level }
  },

  changeLevelRegisters: function (level: Level, registerIndex: number, register: RegisterData): Level {
    const updatedLevel = update(level, {
      treeRegisters: { [registerIndex]: { $set: register } }
    })

    return LevelManipulation.tryOpenExit(updatedLevel)
  },

  changeGemsRegister: function (level: Level, registerIndex: number, numberOfGems: number): Level {
    return LevelManipulation.tryOpenExit(update(level, {
      treeRegisters: { [registerIndex]: { $merge: { stored: numberOfGems } } }
    }))
  }
}
