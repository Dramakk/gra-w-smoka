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

export function getFieldsPerRow (level: Level) : number {
  return level.fieldsPerRow
}

export function getLevelSize (level: Level): number {
  return level.fields.length
}

export function getRowCount (level: Level) : number {
  return level.fields.length / level.fieldsPerRow
}

// Used as factory for fields to place on board.
export function newFieldFromType (index: number, fieldType: GadgetType) : fields.Field {
  switch (fieldType) {
    case 'ARROWUP':
      return fields.createArrow('U', 'AU', index)
    case 'ARROWDOWN':
      return fields.createArrow('D', 'AD', index)
    case 'ARROWLEFT':
      return fields.createArrow('L', 'AL', index)
    case 'ARROWRIGHT':
      return fields.createArrow('R', 'AR', index)
    case 'WALL':
      return fields.createWall('W', index)
    case 'START':
      return fields.createStart('E', index)
  }
}

export function fillSquare (level: Level, index : number, fieldType : GadgetType) : Level {
  const newUserPlacedField : fields.Field = newFieldFromType(index, fieldType)
  const foundField : fields.Field = level.playerPlacedGadgets[index]
  const playerPlacedGadgets: FieldMap = { ...level.playerPlacedGadgets }

  if (foundField) {
    delete playerPlacedGadgets[index]
  }

  if (newUserPlacedField !== null) {
    playerPlacedGadgets[index] = newUserPlacedField
  }

  return { ...level, gadgets: counterDelete(level.gadgets, fieldType), playerPlacedGadgets }
}

export function clearSquare (level: Level, index : number) : Level {
  const userPlacedField = getField(level, index)
  const playerPlacedGadgets = { ...level.playerPlacedGadgets }

  // userPlacedField === 'EMPTY' cannot happen, but we have to tell it to TS. Because of typeOfField type
  if (userPlacedField && userPlacedField.typeOfField !== 'EMPTY') {
    delete playerPlacedGadgets[index]
    return { ...level, playerPlacedGadgets, gadgets: add(level.gadgets, userPlacedField.typeOfField) }
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
