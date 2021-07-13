import { Multiset } from '../helpers/multiset'
import * as fields from './fields'

// Array matching type defined below. Used to generate form where editor of level, can choose how many and which fields player could use in game.
export const GadgetTypeArray: GadgetType[] = ['START', 'ARROWLEFT', 'ARROWRIGHT', 'ARROWUP', 'ARROWDOWN']
// Gadget is the type for fields that users are allowed to put on board.
// TODO: Dodaj obsługę ścian oraz pola kończącego przy edytowaniu poziomu
export type GadgetType = 'START' | 'FINISH' | 'WALL' | 'ARROWLEFT' | 'ARROWRIGHT' | 'ARROWUP' | 'ARROWDOWN'
// Used to handle gadgets in views
export type GadgetInfo = [GadgetType, number]
export type Directions = 'U' | 'L' | 'D' | 'R'
export type Start = {position: number, direction: Directions}

// Used to represent Index => Field map
type FieldMap = {
  [key: number]: fields.Field
}

export class Level {
    fields: fields.Field[]
    fieldsPerRow: number
    gadgets : Multiset<GadgetType>
    playerPlacedGadgets : FieldMap
    start: Start

    constructor (fields : fields.Field[], fieldsPerRow : number, gadgets : Multiset<GadgetType>, start : Start) {
      // TODO: Dodanie sprawdzania czy każde pole ma unikalne id od 0 do fields.length - 1.
      this.fields = fields
      this.fieldsPerRow = fieldsPerRow
      this.gadgets = gadgets
      this.playerPlacedGadgets = []
      this.start = start
    }

    getFieldsPerRow () : number {
      return this.fieldsPerRow
    }

    getLevelSize (): number {
      return this.fields.length
    }

    getRowCount () : number {
      return this.fields.length / this.fieldsPerRow
    }

    // Used as factory for fields to place on board.
    newFieldFromType (index: number, fieldType: GadgetType) : fields.Field {
      switch (fieldType) {
        case 'ARROWUP':
          return new fields.Arrow('U', 'AU', index)
        case 'ARROWDOWN':
          return new fields.Arrow('D', 'AD', index)
        case 'ARROWLEFT':
          return new fields.Arrow('L', 'AL', index)
        case 'ARROWRIGHT':
          return new fields.Arrow('R', 'AR', index)
        case 'START':
          return new fields.Start('E', index)
      }
    }

    fillSquare (index : number, fieldType : GadgetType) : void {
      const newUserPlacedField : fields.Field = this.newFieldFromType(index, fieldType)
      const foundField : fields.Field = this.playerPlacedGadgets[index]

      if (foundField) {
        delete this.playerPlacedGadgets[index]
      }
      if (newUserPlacedField !== null) {
        this.playerPlacedGadgets[index] = newUserPlacedField
      }
      this.gadgets.delete(fieldType)
    }

    clearSquare (index : number) : void {
      const userPlacedField = this.getField(index).typeOfField

      // userPlacedField === 'EMPTY' cannot happen, but we have to tell it to TS. Because of typeOfField type
      if (userPlacedField !== 'EMPTY') {
        this.gadgets.add(userPlacedField)
        delete this.playerPlacedGadgets[index]
      }
    }

    isPlacedByUser (index : number) : boolean {
      return (this.playerPlacedGadgets[index] !== undefined)
    }

    canPlaceField (fieldType: GadgetType) : boolean {
      const currentAvailable = this.gadgets.get(fieldType)

      return currentAvailable > 0
    }

    getField (index: number) : fields.Field {
      if (index >= this.fields.length) {
        return null
      }

      const placedByPlayer = this.playerPlacedGadgets[index]

      if (placedByPlayer) {
        return placedByPlayer
      } else {
        return this.fields.find((element : fields.Field) => { return element.id === index })
      }
    }
}
