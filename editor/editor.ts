import { Counter, add, setInfinity, createCounter, setZero, items } from '../helpers/counter'
import { Field, createEmpty, createWall } from '../levels/fields'
import { canPlaceField, Directions, GadgetType, GadgetTypeArray, getRowCount, Level, newFieldFromType, removeStart, setStart, StartType } from '../levels/level'

// Type for dropdown options of fields to place by user.
export type GadgetOptionType = {direction : Directions}

export interface Editor {
  level: Level,
  // Array of fields which are going to be available to player, when level is imported.
  playerGadgets: Counter<GadgetType>
}

export function createEditor (howManyRows: number, howManyPerRow: number): Editor {
  const level = createLevelForEditor(howManyRows, howManyPerRow)
  let playerGadgets = createCounter<GadgetType>()
  GadgetTypeArray.filter((fieldType) => fieldType !== 'START' && fieldType !== 'WALL').forEach((fieldType) => {
    playerGadgets = setZero(playerGadgets, fieldType)
  })

  return { level, playerGadgets }
}

export function isBorder (index: number, fieldsPerRow: number, howManyRows: number): boolean {
  return (index < fieldsPerRow || index % fieldsPerRow === 0 || (index + 1) % fieldsPerRow === 0 || ((howManyRows * fieldsPerRow - index) < fieldsPerRow))
}

// Creates empty board, surrounded by walls.
function createLevelForEditor (howManyRows: number, fieldsPerRow: number): Level {
  const fields: Field[] = [...Array(howManyRows * fieldsPerRow).keys()].map((index: number) => {
    // Insert walls at boundaries of board
    if (isBorder(index, fieldsPerRow, howManyRows)) {
      return createWall('W', index)
    }

    return createEmpty('E', index)
  })
  const start: StartType = { position: null, direction: null }
  let gadgets: Counter<GadgetType> = createCounter<GadgetType>()

  GadgetTypeArray.forEach((gadgetType: GadgetType) => {
    if (gadgetType === 'START') {
      gadgets = add(gadgets, gadgetType)
    }
    gadgets = setInfinity(gadgets, gadgetType)
  })

  return { fields, fieldsPerRow, gadgets, start, playerPlacedGadgets: [] }
}

// Invoked when user deletes object from the board.
export function clearSquare (level: Level, index: number) : Level {
  let newLevel = { ...level }
  // Prevent deleting of border walls
  if (isBorder(index, newLevel.fieldsPerRow, getRowCount(newLevel))) {
    return { ...level }
  }

  const currentlyPlacedField = newLevel.fields[index]
  if (currentlyPlacedField.typeOfField === 'START') {
    newLevel = removeStart(newLevel)
  }
  newLevel.fields[index] = createEmpty('E', index)

  return newLevel
}

// Invoked when user places object on the board.
export function fillSquare (level: Level, index: number, gadgetType : GadgetType, options: GadgetOptionType) : Level {
  let newLevel = { ...level }

  if (!canPlaceField(newLevel, gadgetType)) {
    return { ...newLevel }
  }
  if (gadgetType === 'START') {
    newLevel = setStart(level, index, options.direction)
  }

  const newGadget = newFieldFromType(index, gadgetType)
  newLevel.fields[index] = newGadget

  return newLevel
}

// Function used to export built level to JSON.
export function exportLevel (editor: Editor) : string {
  const levelToExport: any = editor.level
  let gadgetsToExport = createCounter()
  for (const [gadgetType, howManyAvailable] of items(editor.playerGadgets)) {
    if (gadgetType === 'START') {
      continue
    }

    if (howManyAvailable === 0) {
      continue
    }

    [...Array(howManyAvailable).keys()].forEach(() => {
      gadgetsToExport = add(gadgetsToExport, gadgetType)
    })
  }

  levelToExport.gadgets = [...items(gadgetsToExport).entries()]
  // We don't use this field in parsing
  delete levelToExport.playerPlacedGadgets
  return JSON.stringify(levelToExport)
}
