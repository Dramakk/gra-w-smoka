import { add, Counter, counterDelete, get } from '../helpers/counter'
import * as fields from './fields'

// Array matching type defined below. Used to generate form where editor of level, can choose how many and which fields player could use in game.
export const GadgetTypeArray: GadgetType[] = ['START', 'WALL', 'ARROWLEFT', 'ARROWRIGHT', 'ARROWUP', 'ARROWDOWN']
// Gadget is the type for fields that users are allowed to put on board.
// TODO: Dodaj obsługę pola kończącego przy edytowaniu poziomu
export type GadgetType = 'START' | 'FINISH' | 'WALL' | 'ARROWLEFT' | 'ARROWRIGHT' | 'ARROWUP' | 'ARROWDOWN'
// Used to handle gadgets in views
export type GadgetInfo = [GadgetType, number]
export type Directions = 'U' | 'L' | 'D' | 'R'
export type StartType = {position: number, direction: Directions}

// Used to represent Index => Field map
type FieldMap = {
  [key: number]: fields.Field
}

export interface Level {
  fields: fields.Field[]
  fieldsPerRow: number
  gadgets : Counter<GadgetType>
  playerPlacedGadgets : FieldMap
  start: StartType
}

export function createLevel (fields : fields.Field[], fieldsPerRow : number, gadgets : Counter<GadgetType>, start : StartType): Level {
  // Flag determining if all ids from 0 to fields.length are assigned to fields.
  fields.sort((firstElem, secondElem) => { return firstElem.id - secondElem.id })
  // Iterate over array and chceck if every element is at it's place
  fields.map((field, index) => {
    if (field.id !== index) {
      throw Error('Wrong level format, ids missing')
    }
    return true
  })

  return { fields, fieldsPerRow, gadgets, playerPlacedGadgets: [], start }
}

export function resetLevel (level: Level): Level {
  if (!level.playerPlacedGadgets || Object.keys(level.playerPlacedGadgets).length === 0) {
    return { ...level }
  }

  const indexToClear = Number(Object.keys(level.playerPlacedGadgets)[0])
  return resetLevel(clearSquare(level, indexToClear))
}

export function getFieldsPerRow (level: Level) : number {
  return level.fieldsPerRow
}

export function getLevelSize (level: Level): number {
  return level.fields.length
}

export function getRowCount (level: Level) : number {
  return level.fields.length / level.fieldsPerRow
}

export function removeStart (level: Level) : Level {
  // We can set position and direction to null. When either is null, game won't start.
  // Using nulls instead of undefined because of engine implementation.
  return { ...level, gadgets: add(level.gadgets, 'START'), start: { position: null, direction: null } }
}

export function setStart (level: Level, index: number, direction: Directions) : Level {
  return { ...level, start: { position: index, direction: direction }, gadgets: counterDelete(level.gadgets, 'START') }
}

// Used as factory for fields to place on board.
export function newFieldFromType (index: number, fieldType: GadgetType) : fields.Field {
  switch (fieldType) {
    case 'ARROWUP':
      return fields.createField<fields.Arrow>('ARROWUP', 'AU', index, { direction: 'U' })
    case 'ARROWDOWN':
      return fields.createField<fields.Arrow>('ARROWDOWN', 'AD', index, { direction: 'D' })
    case 'ARROWLEFT':
      return fields.createField<fields.Arrow>('ARROWLEFT', 'AL', index, { direction: 'L' })
    case 'ARROWRIGHT':
      return fields.createField<fields.Arrow>('ARROWRIGHT', 'AR', index, { direction: 'R' })
    case 'WALL':
      return fields.createField<fields.Wall>('WALL', 'W', index)
    case 'START':
      return fields.createField<fields.Empty>('EMPTY', 'E', index)
  }
}

export function fillSquare (level: Level, index : number, fieldType : GadgetType) : Level {
  const newUserPlacedField : fields.Field = newFieldFromType(index, fieldType)
  const foundField : fields.Field = level.playerPlacedGadgets[index]
  let playerPlacedGadgets: FieldMap = { ...level.playerPlacedGadgets }

  if (foundField) {
    // Retrive element at index, and return rest of the object in immutable way
    const { [index]: _, ...rest } = playerPlacedGadgets
    playerPlacedGadgets = rest
  }

  if (newUserPlacedField !== null) {
    playerPlacedGadgets = { ...playerPlacedGadgets, [index]: newUserPlacedField }
  }

  return { ...level, gadgets: counterDelete(level.gadgets, fieldType), playerPlacedGadgets }
}

export function clearSquare (level: Level, index : number) : Level {
  const userPlacedField = getField(level, index)

  // userPlacedField === 'EMPTY' cannot happen, but we have to tell it to TS. Because of typeOfField type
  if (userPlacedField && userPlacedField.typeOfField !== 'EMPTY') {
    const { [index]: _, ...rest } = level.playerPlacedGadgets
    return { ...level, playerPlacedGadgets: rest, gadgets: add(level.gadgets, userPlacedField.typeOfField) }
  }

  return { ...level }
}

export function isPlacedByUser (level: Level, index : number) : boolean {
  return (level.playerPlacedGadgets[index] !== undefined)
}

export function canPlaceField (level: Level, fieldType: GadgetType) : boolean {
  return get(level.gadgets, fieldType) > 0
}

export function getField (level: Level, index: number) : fields.Field {
  if (index >= level.fields.length) {
    return null
  }

  const placedByPlayer = level.playerPlacedGadgets[index]

  if (placedByPlayer) {
    return placedByPlayer
  } else {
    return level.fields[index]
  }
}
