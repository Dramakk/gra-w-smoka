import update from 'immutability-helper'
import { Dragon } from '../engine/dragon'
import { Counter, add, setInfinity, createCounter, setZero, items } from '../helpers/counter'
import { Field, createField, Wall, Empty, Entrance, Exit } from '../levels/fields'
import {
  LevelGetters, LevelPredicates, LevelSpeedControls, LevelCreation,
  GadgetOptionType, GadgetType, GadgetTypeArray, GemColors, Level, TreeRegisters, Labels
} from '../levels/level'

export interface Editor {
  level: Level,
  // Array of fields which are going to be available to player, when level is imported.
  playerGadgets: Counter<GadgetType>
}

export const EditorCreation = {
  createEditor: function (howManyRows: number, howManyPerRow: number): Editor {
    const level = EditorCreation.createLevelForEditor(howManyRows, howManyPerRow)
    let playerGadgets = createCounter<GadgetType>()
    GadgetTypeArray
      .filter(fieldType => fieldType !== 'FINISH' && fieldType !== 'START' && fieldType !== 'WALL')
      .forEach((fieldType) => {
        playerGadgets = setZero(playerGadgets, fieldType)
      })

    return { level, playerGadgets }
  },

  // Function used to export built level to JSON.
  exportLevel: function (editor: Editor) : string {
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
    // We don't use these fields in parsing
    delete levelToExport.playerPlacedGadgets
    delete levelToExport.scalesGems
    return levelToExport
  },

  // Creates empty board, surrounded by walls.
  createLevelForEditor: function (howManyRows: number, fieldsPerRow: number): Level {
    const fields: Field[] = [...Array(howManyRows * fieldsPerRow).keys()].map((index: number) => {
    // Insert walls at boundaries of board
      if (EditorPredicates.isBorder(index, fieldsPerRow, howManyRows)) {
        return createField<Wall>('WALL', index)
      }

      return createField<Empty>('EMPTY', index)
    })
    const baseDragon: Dragon = {
      fieldId: null,
      direction: null,
      gemsInPocket: {
        BLACK: 0,
        BLUE: 0,
        YELLOW: 0,
        RED: 0,
        GREEN: 0
      },
      canMove: true,
      directionHistory: {
        previous: null,
        current: null
      }
    }

    const treeGems: Record<GemColors, number> = {
      BLACK: 0,
      BLUE: 0,
      YELLOW: 0,
      RED: 0,
      GREEN: 0
    }

    const scalesGems: Record<GemColors, number> = {
      BLACK: 0,
      BLUE: 0,
      YELLOW: 0,
      RED: 0,
      GREEN: 0
    }

    let gadgets: Counter<GadgetType> = createCounter<GadgetType>()

    GadgetTypeArray.forEach((gadgetType: GadgetType) => {
      if (gadgetType === 'START') {
        gadgets = add(gadgets, gadgetType)
      }
      gadgets = setInfinity(gadgets, gadgetType)
    })

    const finishId : number = null
    const treeRegisters: TreeRegisters = [...Array(20).keys()].reduce((acc, key) => {
      acc[key] = { stored: 0, needed: 0 }

      return acc
    }, {} as TreeRegisters)
    const entrances : Record<Labels, number> = {}
    const exits : Record<Labels, number> = {}

    return {
      fields,
      fieldsPerRow,
      gadgets,
      baseDragon,
      playerPlacedGadgets: [],
      scalesGems,
      treeGems,
      treeRegisters,
      finishId,
      entrances,
      exits
    }
  }
}

export const EditorPredicates = {
  isBorder: function (index: number, fieldsPerRow: number, howManyRows: number): boolean {
    return (index < fieldsPerRow || index % fieldsPerRow === 0 || (index + 1) % fieldsPerRow === 0 || ((howManyRows * fieldsPerRow - index) < fieldsPerRow))
  }
}

export const EditorManipulation = {
  // Invoked when user deletes object from the board.
  clearSquare: function (level: Level, index: number) : Level {
    let newLevel = { ...level }
    // Prevent deleting of border walls
    if (EditorPredicates.isBorder(index, newLevel.fieldsPerRow, LevelGetters.getRowCount(newLevel))) {
      return { ...level }
    }

    const currentlyPlacedField = newLevel.fields[index]
    if (currentlyPlacedField.typeOfField === 'START') {
      newLevel = LevelSpeedControls.removeStart(newLevel)
    }

    if (currentlyPlacedField.typeOfField === 'FINISH') {
      newLevel = LevelSpeedControls.removeFinish(newLevel)
    }

    if (currentlyPlacedField.typeOfField === 'ENTRANCE') {
      const tmp = currentlyPlacedField as Entrance
      newLevel = LevelSpeedControls.removeEntrance(level, index, tmp.attributes.label)
    }

    if (currentlyPlacedField.typeOfField === 'EXIT') {
      const tmp = currentlyPlacedField as Exit
      return LevelSpeedControls.removeExit(level, index, tmp.attributes.label)
    }

    return update(newLevel, {
      fields: {
        $set: newLevel.fields.map((item, itemIndex) =>
          itemIndex === index ? createField<Empty>('EMPTY', index) : item)
      }
    })
  },

  // Invoked when user places object on the board.
  fillSquare: function (level: Level, index: number, gadgetType : GadgetType, options: GadgetOptionType) : Level {
    const newLevel = { ...level }

    if (!LevelPredicates.canPlaceField(newLevel, gadgetType)) {
      return { ...newLevel }
    }

    if (gadgetType === 'START' && 'direction' in options) {
      return LevelSpeedControls.setStart(level, index, options.direction)
    }

    if (gadgetType === 'FINISH') {
      return LevelSpeedControls.setFinish(level, index)
    }

    if (gadgetType === 'ENTRANCE' && 'label' in options) {
      return LevelSpeedControls.setEntrance(level, index, options.label)
    }

    if (gadgetType === 'EXIT' && 'label' in options) {
      return LevelSpeedControls.setExit(level, index, options.label)
    }

    const newGadget = LevelCreation.newFieldFromType(index, gadgetType, options)

    return update(newLevel, {
      fields: { $set: newLevel.fields.map((item, itemIndex) => itemIndex === index ? newGadget : item) }
    })
  }
}
