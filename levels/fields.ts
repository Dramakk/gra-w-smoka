import { Directions, GadgetType } from './level'

type FieldType = GadgetType | 'EMPTY'

interface FieldAttributes {
  direction?: Directions
}

export interface Field {
    typeOfField: FieldType
    id: number
    image: string
    attributes?: FieldAttributes
}

export interface Start extends Field {
  typeOfField: 'START',
}

export interface Finish extends Field {
  typeOfField: 'FINISH',
}

export interface Wall extends Field {
  typeOfField: 'WALL',
}
export interface Empty extends Field {
  typeOfField: 'EMPTY',
}
export interface Arrow extends Field {
  typeOfField: 'ARROWUP' | 'ARROWDOWN' | 'ARROWLEFT' | 'ARROWRIGHT',
  attributes: { direction: Directions }
}

export function createField<T extends Field> (typeOfField: FieldType, image: string, id: number, attributes?: FieldAttributes): T {
  return { typeOfField, image, id, attributes } as T
}
